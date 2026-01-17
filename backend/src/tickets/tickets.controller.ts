import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("tickets")
@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOkResponse()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOkResponse()
  @ApiTags("tickets")
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(":user_id")
  @ApiOkResponse()
  @ApiTags("tickets")
  findAllForUser(@Param("user_id")user_id: string) {
    return this.ticketsService.getTicketsByUserId(+user_id);
  }

  @Get(":id")
  @ApiOkResponse()
  @ApiTags("tickets")
  findOne(@Param("id") id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(":id")
  @ApiOkResponse()
  @ApiTags("tickets")
  update(@Param("id") id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Delete(":id")
  @ApiOkResponse()
  @ApiTags("tickets")
  remove(@Param("id") id: string) {
    return this.ticketsService.remove(+id);
  }
}
