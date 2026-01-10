import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateTicketDto {
  @IsString()
  @ApiProperty()
  title: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsString()
  @ApiProperty()
  category: string;

  @IsString()
  @ApiProperty()
  docs: string;

  @IsNumber()
  @ApiProperty()
  buildingId: number;

  @IsNumber()
  @ApiProperty()
  userId: number;

  @IsNumber()
  adminId: number;
}
