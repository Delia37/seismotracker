import { MailerService } from "@nestjs-modules/mailer";
import { Controller, Delete, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { use } from "passport";
import { BuildingsService } from "src/buildings/buildings.service";

@ApiTags("notifications")
@Controller("notifications")
export class NotificationController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly buildingsService: BuildingsService
  ) {}

  @Get("notify/:buildingId")
  @ApiOkResponse()
  async notify(@Param("buildingId") id: string) {
    // get all the users that are subscribed to this building
    let notifications = await this.buildingsService.getBuldingNotifications(
      +id
    );
    if (notifications == null) return "no notifications";

    let notificationText = "";
    notifications.forEach((notification) => {
      notificationText += "Notificarea numarul " + notification.id + "\n";
      notificationText += notification.title + "\n";
      notificationText += notification.description + "\n\n";
    });

    let location = await this.buildingsService.getBuildingLocation(+id);
    let users = await this.buildingsService.getUsersByBuildingId(+id);
    let user = await this.buildingsService.getUsersByBuildingIdAdded(+id);
    console.log(users);
    // send an email to each user
    if (users == null) return "no users subscribed to this building";
    users.forEach(async (user) => {
      console.log(user.email);
      await this.mailerService.sendMail({
        to: user.email,
        from: "eqk.exposed.buildings@gmail.com",
        subject:
          "Noi schimbari pentru cladirea de la adresa " +
          location?.street +
          " " +
          location?.number,
        text: notificationText,
      });
    });

    //send an email to the user that added the building
    if (user == null) return "no user added this building";
    await this.mailerService.sendMail({
      to: user.email,
      from: "eqk.exposed.buildings@gmail.com",
      subject:
        "Noi schimbari pentru cladirea de la adresa " +
        location?.street +
        " " +
        location?.number,
      text: notificationText,
    });

    return "emails sent";
  }

  @Delete("deleteNotifications/:buildingId")
  @ApiOkResponse()
  async deleteNotifications(@Param("buildingId") id: string) {
    await this.buildingsService.deleteBuildingNotifications(+id);
    return "notifications deleted";
  }
}
