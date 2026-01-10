import { Controller, Get, Query } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { LatLngLiteral } from "@googlemaps/google-maps-services-js";

@ApiTags("App Controller")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    description: "A hello string",
    type: String,
    isArray: false,
  })
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
