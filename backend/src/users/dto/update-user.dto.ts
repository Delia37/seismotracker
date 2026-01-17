import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  Validate,
  ValidateNested,
} from "class-validator";

export class UpdateUserDto {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty()
  password: string;

  @IsBoolean()
  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty({ isArray: true })
  @IsOptional()
  @IsNumber({}, { each: true })
  favoriteBuildings: number[];
}
