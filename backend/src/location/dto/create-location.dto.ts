import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsDefined,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Building } from "../../buildings/entities/building.entity";

export class CreateLocationDto {
  @IsString()
  @ApiProperty()
  street: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  number?: string;

  @IsNumber()
  @ApiProperty()
  sector: number;

  @IsOptional()
  @ApiPropertyOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  longitude?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  thumbnail?: string;
}

export default CreateLocationDto;
