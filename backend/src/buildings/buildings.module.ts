import { Module } from "@nestjs/common";
import { BuildingsService } from "./buildings.service";
import { BuildingsController } from "./buildings.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { GoogleMapsModule } from "src/google-maps/google-maps.module";
import { ConfigModule } from "@nestjs/config";


@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService],
  imports: [PrismaModule, GoogleMapsModule, ConfigModule],
  exports: [BuildingsService],
})
export class BuildingsModule {}
