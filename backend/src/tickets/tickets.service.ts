import { Injectable } from "@nestjs/common";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { PrismaService } from "../prisma/prisma.service";
import {Prisma, Ticket} from "@prisma/client";
import { CreateTicketDto } from "./dto/create-ticket.dto";

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      await this.prisma.ticket.create({
        data: {
          ...createTicketDto,
          adminId: 2,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          return Promise.reject({
            statusCode: 409,
            message: "Ticket already exists",
          });
        }
      }
      throw e;
    }

    return Promise.resolve({
      statusCode: 200,
      message: "Ticket successfully created.",
    });
  }


  findAll(): Promise<{ length: number; tickets: any[] }> {
    let length = 0;
    return new Promise((resolve, reject) => {
      this.prisma.ticket
        .findMany({
          orderBy: { id: "asc" },
          include: { closedBy: true, building: true, user: true },
        })
        .then((tickets) => {
          length = tickets.length;
          resolve({ length, tickets });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // async getTicketsByUserId(userId: number): Promise<Ticket[] | null> {
  //   return this.prisma.ticket
  //       .findMany({ where: { userId: userId } })
  // }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return this.prisma.ticket.findMany({
      where: {
        OR: [
          { userId: userId },   // tichete create de user
          { adminId: userId },  // tichete repartizate adminului
        ],
      },
      include: {
        user: true,
        building: true,
        closedBy: true,
      },
    });
  }

  findOne(id: number) {
    return new Promise((resolve, reject) => {
      this.prisma.ticket
        .findUniqueOrThrow({
          where: { id },
          include: { closedBy: true, building: true, user: true },
        })
        .then((ticket) => {
          resolve(ticket);
        })
        .catch((error) => {
          if (error.code === "P2025") {
            // error code for not found in prisma
            reject({ statusCode: 404, message: "Ticket not found" });
          }
          reject(error);
        });
    });
  }

  async update(id: number, updateTicketDto: UpdateTicketDto) {
    return this.prisma.ticket
      .update({
        where: { id },
        data: updateTicketDto,
      })
      .catch((error) => {
        if (error.code === "P2025") {
          // error code for not found in prisma
          return Promise.reject({
            statusCode: 404,
            message: "Ticket not found",
          });
        }
        if (error.code === "P2003") {
          // error code for user not found in prisma
          return Promise.reject({ statusCode: 404, message: "User not found" });
        }
        return Promise.reject(error);
      });
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
