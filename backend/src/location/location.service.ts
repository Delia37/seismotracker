import { Injectable } from "@nestjs/common";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class LocationService {
  // constructor(private prisma: PrismaService) {}

  async createLocation(createLocationDto: CreateLocationDto) {
    // try{
    //   const location = await this.prisma.location
    //     .create({ data: createLocationDto
    //     });
    //   return {
    //     statusCode: 200,
    //     message: "Location successfully created",
    //     location,
    //   };
    // }
    // catch (error) {
    //   if (error.code === "P2002") {
    //     return Promise.reject({
    //       statusCode: 409,
    //       message: "Location already exists",
    //     });
    //   }
    //   return await Promise.reject({
    //     statusCode: 500,
    //     message: "Internal server error",
    //   });
    // }
    return "This action adds a new location";
  }

  findAll() {
    return `This action returns all location`;
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  update(id: number, updateLocationDto: UpdateLocationDto) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
