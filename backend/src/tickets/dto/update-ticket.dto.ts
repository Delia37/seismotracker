import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber } from "class-validator";

export class UpdateTicketDto {
  @IsBoolean()
  @ApiProperty()
  isClosed: boolean;

  @IsNumber()
  @ApiProperty()
  adminId: number;
}
