import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import CreateLocationDto from "src/location/dto/create-location.dto";
import { Type } from "class-transformer";

export class CreateBuildingDto {
  @IsNumber()
  @ApiProperty()
  buildingYear: number;

  @IsString()
  @ApiProperty()
  heightRegime: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  numApartments?: number;

  @IsNumber()
  @ApiProperty()
  analysisYear: number;

  @IsString()
  @ApiProperty()
  buildingStatus: string;

  @IsString()
  @ApiProperty()
  technicExpert: string;

  @IsNumber()
  @ApiProperty()
  seismicRiskId: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  userId?: number;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional()
  adminId?: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => CreateLocationDto)
  @ApiProperty()
  location: CreateLocationDto;
}

export default CreateBuildingDto;
