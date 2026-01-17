import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { BuildingsService } from "./buildings.service";
import { CreateBuildingDto } from "./dto/create-building.dto";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { UpdateBuildingStatusDto } from "./dto/update-building-status.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UpdateBuildingDto } from "./dto/update-building.dto";

@ApiTags("buildings")
@Controller("buildings")
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiTags("buildings")
  async create(@Body() createBuildingDto: CreateBuildingDto) {
    return await this.buildingsService.create(createBuildingDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiTags("buildings")
  findAll(@Query("skip") skip?: string, @Query("take") take?: string) {
    return this.buildingsService.findAll({
      skip: Number(skip),
      take: Number(take),
    });
  }

  @Get("pending")
  @ApiOkResponse()
  @ApiTags("buildings")
  findPending(@Query("skip") skip?: string, @Query("take") take?: string) {
    return this.buildingsService.findPending({
      skip: Number(skip),
      take: Number(take),
    });
  }

  @Get("search")
  @ApiOkResponse()
  @ApiTags("buildings")
  search(@Query("q") q: string) {
    return this.buildingsService.search(q);
  }

  @Get(":id")
  @ApiOkResponse()
  @ApiTags("buildings")
  findOne(@Param("id") id: string) {
    return this.buildingsService.findOne(+id);
  }

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  updateBuildingStatus(
    @Param("id") id: string,
    @Body() updateBuildingStatusDto: UpdateBuildingStatusDto
  ) {
    return this.buildingsService.updateBuildingStatus(
      +id,
      updateBuildingStatusDto
    );
  }

  @Patch(":id")
  @ApiOkResponse()
  @ApiTags("buildings")
  update(
    @Param("id") id: string,
    @Body() updateBuildingDto: UpdateBuildingDto
  ) {
    return this.buildingsService.update(+id, updateBuildingDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  deleteBuilding(@Param("id") id: string) {
    return this.buildingsService.deleteBuilding(+id);
  }
}
