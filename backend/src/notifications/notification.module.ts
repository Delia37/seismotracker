import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { MailerModule } from "@nestjs-modules/mailer";
import { BuildingsModule } from "src/buildings/buildings.module";

@Module({
  controllers: [NotificationController],
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.sendgrid.net",
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY,
        },
      },
    }),
    BuildingsModule,
  ],
})
export class NotificationModule {}
