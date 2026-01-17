import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Median")
    .addBearerAuth()
    .setDescription("The Median API description")
    .setVersion("0.1")
    .build();
  app.enableCors({
    origin: "http://localhost:3001",
    allowedHeaders:
      "Content-type, Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe",
    credentials: true,
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(3000);
}

bootstrap();
