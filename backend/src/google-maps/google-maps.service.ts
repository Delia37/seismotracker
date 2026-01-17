import { Client, LatLngLiteral } from "@googlemaps/google-maps-services-js";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleMapsService extends Client {
  private readonly accessKey = this.config.get("GOOGLE_MAPS_ACCESS_KEY");

  constructor(private config: ConfigService) {
    super();
  }

  async getCoordinates(address: {
    street: string;
    number: string | undefined;
    city: string;
    state: string;
    postalCode: string;
  }): Promise<LatLngLiteral> {
    const googleRes = await this.geocode({
      params: {
        address: `${address.street}, ${address.number}, ${address.city}, ${address.state}, ${address.postalCode}`,
        key: this.accessKey,
      },
    }).catch((err) => {
      throw new Error("Could not find location");
    });

    if (googleRes.data.status !== "OK") {
      throw new Error("Could not find location");
    }
    const { lng, lat } = googleRes.data.results[0].geometry.location;
    return { lng, lat };
  }

async getStaticImage(address: { lat: number; lng: number }): Promise<string> {
  let endpointUrl =
    "https://maps.googleapis.com/maps/api/streetview";

  endpointUrl += `?size=600x300`;
  endpointUrl += `&location=${address.lat},${address.lng}`;
  endpointUrl += `&key=${this.accessKey}`;

  return endpointUrl;
}

}
