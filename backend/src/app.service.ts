import { Injectable } from "@nestjs/common";
import { GoogleMapsService } from "./google-maps/google-maps.service";
import { LatLngLiteral } from "@googlemaps/google-maps-services-js";
@Injectable()
export class AppService {
  constructor(private readonly googleMapsService: GoogleMapsService) {}

  async getHello(): Promise<string> {
    return "Hello World!";
  }

  async getAddressCoords(address): Promise<LatLngLiteral> {
    const { lng, lat } = await this.googleMapsService.getCoordinates(address);

    console.log(lng, lat);
    return { lng, lat };
  }

  async getStaticImage(location: LatLngLiteral): Promise<string> {
    const staticImage = await this.googleMapsService.getStaticImage(location);

    return staticImage;
  }
}
