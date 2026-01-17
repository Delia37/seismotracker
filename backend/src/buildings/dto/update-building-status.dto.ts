import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateBuildingStatusDto {
  @IsString()
  @ApiProperty()
  buildingStatus: string;
}
