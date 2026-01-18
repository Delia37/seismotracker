import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { DashboardService } from "./dashboard.service";

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get("stats")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Dashboard statistics",
  })
  async getStats() {
    return this.dashboardService.getStats();
  }
}
