// src/users/entities/user.entity.ts
import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";
import { Exclude } from "class-transformer";
import { UpdateBuildingDto } from "src/buildings/dto/update-building.dto";

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ type: [Number], isArray: true })
  favoriteBuildings: number[];
}
