import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";
import { BuildingsService } from "../buildings/buildings.service";

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly buildingsService: BuildingsService
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      roundsOfHashing
    );

    try {
      await this.prisma.user.create({ data: createUserDto });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          return Promise.reject({
            statusCode: 409,
            message: "Email already in use",
          });
        }
      }
    }

    return Promise.resolve({
      statusCode: 200,
      message: "User successfully created",
    });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUniqueOrThrow({ where: { id: id } });
  }

  async addFavoriteBuildings(userId: number, buildingIds: number[]) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.prisma.user.findUniqueOrThrow({
          where: { id: userId },
        });
        const updatedUser = await this.prisma.user.update({
          where: { id: userId },
          data: {
            favoriteBuildings: {
              connect: buildingIds.map((buildingId) => ({ id: buildingId })),
            },
          },
          include: {
            favoriteBuildings: true,
          },
        });
        resolve({
          statusCode: 200,
          message: "Favorite buildings successfully added",
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2025") {
            reject({ statusCode: 404, message: "Building not found" });
          }
        }
        reject(e);
      }
    });
  }

  async favouriteBuildings(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          favoriteBuildings: {
            include: {
              location: true,
              seismicRisk: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const favoriteBuildings = user.favoriteBuildings;

      if (favoriteBuildings.length === 0) {
        return Promise.resolve({
          statusCode: 200,
          message: "User has no favorite buildings.",
          favoriteBuildings: [],
        });
      }

      return Promise.resolve({
        statusCode: 200,
        message: "Favorite buildings retrieved successfully.",
        favoriteBuildings,
      });
    } catch (e) {
      throw e;
    }
  }

  async addedBuildings(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          addedBuildings: {
            include: {
              location: true,
              seismicRisk: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const addedBuildings = user.addedBuildings;

      if (addedBuildings.length === 0) {
        return Promise.resolve({
          statusCode: 200,
          message: "User has not added any buildings.",
          addedBuildings: [],
        });
      }

      return Promise.resolve({
        statusCode: 200,
        message: "Added buildings retrieved successfully.",
        addedBuildings,
      });
    } catch (e) {
      throw e;
    }
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async deleteFavoriteBuilding(
    userId: number,
    buildingId: number
  ): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favoriteBuildings: {
          disconnect: { id: buildingId },
        },
      },
    });

    return "Building successfully removed from favorites";
  }
}
