import { Inject, Injectable, Module, NotFoundException } from "@nestjs/common";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { GoogleMapsService } from "../google-maps/google-maps.service";
import { PrismaService } from "src/prisma/prisma.service";
import { NotificationController } from "../notifications/notification.controller";
import axios from "axios";

import { Building, Location, Notification, User } from "@prisma/client";
import Fuse from "fuse.js";
import { UpdateBuildingStatusDto } from "./dto/update-building-status.dto";
import { deleteNotification } from "functions-with-context";
import { UpdateBuildingDto } from "./dto/update-building.dto";

@Injectable()
export class BuildingsService {
  constructor(
    private prisma: PrismaService,
    private readonly googleMapsService: GoogleMapsService
  ) {}
  private readonly notificationController: NotificationController;

  async getBuildingByCoordinates(latitude: number, longitude: number) {
    try {
      const building = await this.prisma.building.findFirst({
        where: {
          location: {
            latitude,
            longitude,
          },
        },
      });
      return building;
    } catch (e) {
      throw e;
    }
  }

  async create(createBuildingDto: CreateBuildingDto) {
    try {
      const { location, ...buildingData } = createBuildingDto;

      let coordinates = await this.googleMapsService
        .getCoordinates({
          street: location.street,
          number: location.number,
          city: "Bucharest",
          state: "RO",
          postalCode: "",
        })
        .catch((err) => {
          return { lat: 0, lng: 0 };
        });

      const existingBuilding = await this.getBuildingByCoordinates(
        coordinates.lat,
        coordinates.lng
      );
      if (existingBuilding !== null) {
        return Promise.reject({
          statusCode: 409,
          message: "Building already exists",
          existingBuilding,
        });
      }

      location.longitude = coordinates.lng;
      location.latitude = coordinates.lat;

      // Generate thumbnail URL using the updated lat and lng values
      const thumbnail = await this.googleMapsService.getStaticImage({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });

      // Assign the generated thumbnail to the location object
      location.thumbnail = thumbnail;

      const building = await this.prisma.building.create({
        data: { ...buildingData, location: { create: { ...location } } },
      });

      return Promise.resolve({
        statusCode: 200,
        message: "Building successfully created.",
        building,
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }

  findAll(params: {
    skip?: number;
    take?: number;
  }): Promise<{ length: number; buildings: any[] }> {
    const skip = params.skip || 0;
    const take = params.take || 10;
    let length = 0;
    return new Promise((resolve, reject) => {
      this.prisma.building
        .findMany({
          where: { buildingStatus: "active" },
          skip,
          take,
          orderBy: { buildingYear: "asc" },
          include: { location: true, seismicRisk: true },
        })
        .then((buildings) => {
          length = buildings.length;
          resolve({ length, buildings });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  findPending(params: {
    skip?: number;
    take?: number;
  }): Promise<{ length: number; buildings: any[] }> {
    const skip = params.skip || 0;
    const take = params.take || 10;
    let length = 0;
    return new Promise((resolve, reject) => {
      this.prisma.building
        .findMany({
          where: { buildingStatus: "pending" },
          skip,
          take,
          orderBy: { buildingYear: "asc" },
          include: { location: true, seismicRisk: true },
        })
        .then((buildings) => {
          length = buildings.length;
          resolve({ length, buildings });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async getUsersByBuildingId(buildingID: number): Promise<User[] | null> {
    return this.prisma.building
      .findUnique({ where: { id: buildingID } })
      .savedBy();
  }
  async getUsersByBuildingIdAdded(buildingID: number): Promise<User | null> {
    return this.prisma.building
      .findUnique({ where: { id: buildingID } })
      .addedBy();
  }

  async getBuildingLocation(buildingID: number): Promise<Location | null> {
    return this.prisma.building
      .findUnique({ where: { id: buildingID } })
      .location();
  }

  async getBuldingNotifications(
    buildingID: number
  ): Promise<Notification[] | null> {
    return this.prisma.building
      .findUnique({ where: { id: buildingID } })
      .notifications();
  }

  async deleteBuildingNotifications(buildingID: number): Promise<Building> {
    return this.prisma.building.update({
      where: { id: buildingID },
      data: { notifications: { deleteMany: {} } },
    });
  }

  findOne(id: number): Promise<Building> {
    return new Promise((resolve, reject) => {
      this.prisma.building
        .findUniqueOrThrow({
          where: { id },
          include: { location: true, seismicRisk: true, savedBy: true },
        })
        .then((building) => {
          resolve(building);
        })
        .catch((error) => {
          if (error.code === "P2025") {
            //P2025 is the error code for not found in Prisma
            reject({ statusCode: 404, message: "Building not found" });
          }
          reject(error);
        });
    });
  }

  search(q: string) {
    return new Promise((resolve, reject) => {
      this.prisma.building
        .findMany({
          where: { buildingStatus: "active" },
          include: { location: true, seismicRisk: true },
        })
        .then((buildings) => {
          const options = {
            includeScore: true,
            keys: ["location.street", "location.number"], //keys to search
            findAllMatches: false,
            threshold: 0.2,
            distance: 800,
            shouldSort: true,
          };
          const fuse = new Fuse(buildings, options);

          const queryArray = q.split(" ");
          let street = "";
          let number = "";
          queryArray.forEach((element) => {
            const pattern = new RegExp("^[0-9]+[a-zA-Z]*$");
            if (pattern.test(element)) {
              number = element;
            } else {
              street += element + " ";
            }
          });
          street = street.trim();
          const query = { street, number };
          const result_part1 = fuse.search(query.street);
          const options2 = {
            includeScore: false,
            keys: ["item.location.number"],
            findAllMatches: true,
            shouldSort: false,
          };
          const fuse2 = new Fuse(result_part1, options2);
          if (query.number === "") {
            const length = result_part1.length;
            resolve({ length, buildings: result_part1 });
          } else {
            const result = fuse2.search(query.number);
            const length = result.length;
            resolve({ length, buildings: result });
          }
        })
        .catch((error) => {
          console.log("error", error);
          reject(error);
        });
    });
  }

  async update(id: number, updateBuildingDto: UpdateBuildingDto) {
    const { location, seismicRiskId, ...buildingData } = updateBuildingDto;

    if (location && (location.street || location.number)) {
      let coordinates = await this.googleMapsService
        .getCoordinates({
          street: location.street || "",
          number: location.number || "",
          city: "Bucharest",
          state: "RO",
          postalCode: "",
        })
        .catch((err) => {
          return { lat: 0, lng: 0 };
        });

      location.longitude = coordinates.lng;
      location.latitude = coordinates.lat;

      const thumbnail = await this.googleMapsService.getStaticImage({
        lat: coordinates.lat,
        lng: coordinates.lng,
      });
      location.thumbnail = thumbnail;
    }

    return this.prisma.building
      .update({
        where: { id },
        data: {
          ...buildingData,
          location: location ? { update: { ...location } } : undefined,
          seismicRiskId: seismicRiskId ? seismicRiskId : undefined,
        },
      })
      .then(async (building) => {
        await this.createNotification(id);
        await this.getNotify(id);
        await this.deleteBuildingNotifications(id);
        return {
          statusCode: 200,
          message: `Building with id ${id} has been updated.`,
          building,
        };
      })
      .catch((error) => {
        if (error.code === "P2025") {
          throw { statusCode: 404, message: "Building not found" };
        }
        throw error;
      });
  }

  async updateBuildingStatus(
    id: number,
    updateBuildingStatusDto: UpdateBuildingStatusDto
  ) {
    const { buildingStatus } = updateBuildingStatusDto;
    return new Promise((resolve, reject) => {
      this.prisma.building
        .update({
          where: { id },
          data: { buildingStatus },
        })
        .then(async (building) => {
          await this.createNotificationStatus(id, buildingStatus);
          await this.getNotify(id);
          await this.deleteBuildingNotifications(id);
          resolve(
            `Building with id ${id} has been updated to status ${buildingStatus}`
          );
        })
        .catch((error) => {
          if (error.code === "P2025") {
            reject({ statusCode: 404, message: "Building not found" });
          }
          reject(error);
        });
    });
  }

  private apiUrl: string = "http://localhost:3000/notifications/notify";

  private deleteUrl: string = "http://localhost:3000/deleteNotifications";

  async getNotify(buildingId: number): Promise<string> {
    const endpointUrl = `${this.apiUrl}/${buildingId}`;

    try {
      const response = await axios.get(endpointUrl);
      return response.data;
    } catch (error) {
      throw new Error("Failed to send notification.");
    }
  }

  async deleteNotification(id: number) {
    const endpointUrl = `${this.apiUrl}/${id}`;

    try {
      const response = await axios.delete(endpointUrl);
      return response.data;
    } catch (error) {
      throw new Error("Failed to delete notification.");
    }
  }

  async createNotificationStatus(buildingId: number, buildingStatus: string) {
    const userIds = await this.getUsersByBuildingId(buildingId);
    if (!userIds || userIds.length === 0) {
      return; // No users found for the building
    }

    const userId = await this.getUsersByBuildingIdAdded(buildingId);

    for (const { id } of userIds) {
      // Check if the user is already in userIds
      if (userId && id === userId.id) {
        continue; // Skip sending notification for this user
      }

      await this.prisma.notification.create({
        data: {
          title: "Building Status Update",
          description: `The building with ID ${buildingId} has been updated to status ${buildingStatus}`,
          building: { connect: { id: buildingId } },
          user: { connect: { id } },
        },
      });
    }

    if (userId) {
      await this.prisma.notification.create({
        data: {
          title: "Building Status Update",
          description: `The building with ID ${buildingId} has been updated to status ${buildingStatus}`,
          building: { connect: { id: buildingId } },
          user: { connect: { id: userId.id } },
        },
      });
    }
  }

  async createNotification(buildingId: number) {
    const userIds = await this.getUsersByBuildingId(buildingId);
    if (!userIds || userIds.length === 0) {
      return; // No users found for the building
    }

    const userId = await this.getUsersByBuildingIdAdded(buildingId);

    for (const { id } of userIds) {
      // Check if the user is already in userIds
      if (userId && id === userId.id) {
        continue; // Skip sending notification for this user
      }

      await this.prisma.notification.create({
        data: {
          title: "Building Update",
          description: `A new building with ID ${buildingId} has been added`,
          building: { connect: { id: buildingId } },
          user: { connect: { id } },
        },
      });
    }

    if (userId) {
      await this.prisma.notification.create({
        data: {
          title: "Building Update",
          description: `A new building with ID ${buildingId} has been added`,
          building: { connect: { id: buildingId } },
          user: { connect: { id: userId.id } },
        },
      });
    }
  }

  async deleteBuilding(buildingId: number) {
    const building = await this.prisma.building.findUniqueOrThrow({
      where: { id: buildingId },
      include: { location: true },
    });

    await this.prisma.location.delete({
      where: { id: building.location!.id },
    });

    await this.prisma.building.delete({
      where: { id: buildingId },
    });

    return "Building successfully deleted.";
  }
}
