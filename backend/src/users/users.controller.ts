// src/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Put,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserEntity } from "./entities/user.entity";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "@prisma/client";

@Controller("users")
@ApiTags("users")
export class UsersController {
  prisma: any;
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOkResponse()
  @ApiCreatedResponse()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.findOne(id));
  }

  @Get(":id/favorites")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findFavorites(@Param("id", ParseIntPipe) id: number) {
    const buildings = await this.usersService.favouriteBuildings(id);
    return buildings;
  }

  @Get(":id/added-buildings")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findAddedBuildings(@Param("id", ParseIntPipe) id: number) {
    const buildings = await this.usersService.addedBuildings(id);
    return buildings;
  }

  @Put(":id/favorite-buildings")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async addFavoriteBuildings(
    @Param("id", ParseIntPipe) userId: number,
    @Body() buildingIds: number[]
  ) {
    const updatedUser = await this.usersService.addFavoriteBuildings(
      userId,
      buildingIds
    );

    return updatedUser;
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return new UserEntity(await this.usersService.remove(id));
  }

  @Delete(":userId/favorite-buildings/:buildingId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async deleteFavoriteBuilding(
    @Param("userId", ParseIntPipe) userId: number,
    @Param("buildingId", ParseIntPipe) buildingId: number
  ): Promise<string> {
    return this.usersService.deleteFavoriteBuilding(userId, buildingId);
  }
}
