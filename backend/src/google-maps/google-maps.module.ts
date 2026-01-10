import { Module } from "@nestjs/common";
import { GoogleMapsService } from "./google-maps.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  providers: [GoogleMapsService],
  exports: [GoogleMapsService],
  imports: [ConfigModule],
})
export class GoogleMapsModule {}
