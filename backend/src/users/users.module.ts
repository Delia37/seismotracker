// src/users/users.module.ts
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { BuildingsModule } from "../buildings/buildings.module";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, BuildingsModule],
  exports: [UsersService],
})
export class UsersModule {}
