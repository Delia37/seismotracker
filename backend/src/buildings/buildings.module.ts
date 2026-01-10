import { Module } from "@nestjs/common";
import { BuildingsService } from "./buildings.service";
import { BuildingsController } from "./buildings.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { GoogleMapsModule } from "src/google-maps/google-maps.module";

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService],
  imports: [PrismaModule, GoogleMapsModule],
  exports: [BuildingsService],
})
export class BuildingsModule {}
