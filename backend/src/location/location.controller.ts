import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { LocationService } from "./location.service";
import { CreateLocationDto } from "./dto/create-location.dto";
import { UpdateLocationDto } from "./dto/update-location.dto";

@Controller("location")
// eslint-disable-next-line @darraghor/nestjs-typed/controllers-should-supply-api-tags
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Post()
  createLocation(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.createLocation(createLocationDto);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get()
  findAll() {
    return this.locationService.findAll();
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.locationService.findOne(+id);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateLocationDto: UpdateLocationDto
  ) {
    return this.locationService.update(+id, updateLocationDto);
  }

  // eslint-disable-next-line @darraghor/nestjs-typed/api-method-should-specify-api-response
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.locationService.remove(+id);
  }
}
