import { Module } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { TicketsController } from "./tickets.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersModule } from "../users/users.module";
import { BuildingsModule } from "../buildings/buildings.module";

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [PrismaModule, UsersModule, BuildingsModule],
  exports: [TicketsService],
})
export class TicketsModule {}
