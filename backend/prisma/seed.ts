import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import { readFileSync } from "fs";
import { AppService } from "../src/app.service";
import { GoogleMapsService } from "../src/google-maps/google-maps.service";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();
const config = new ConfigService();
const googleMapsService = new GoogleMapsService(config);
const appService = new AppService(googleMapsService);

type CsvEntry = {
  address: string;
  number: string;
  sector: string;
  building_year: number;
  height_regime: string;
  no_aps: number;
  technical_year: number;
  expert: string;
  seismic_risk: string;
  thumbnail: string;
  lat: number;
  lng: number;
};

async function createSuperUser() {
  const superUser = await prisma.user
      .create({
        data: {
          email: "admin@example.com",
          password: await bcrypt.hash("admin", 10),
          fullName: "The Admin",
          isAdmin: true,

          tickets: {},
          notifications: {},
          addedBuildings: {},
          favoriteBuildings: {},
          Building: {},
          Ticket: {},
        },
      })
      .catch((error) => {
        if (error.code === "P2002") {
          console.log("Super user already exists");
        }
      });
}

async function upsertRisks() {
  const rs1 = await prisma.seismicRisk.upsert({
    where: { className: "RsI" },
    update: {},
    create: {
      className: "RsI",
      description:
          "construcțiile cu risc ridicat de prăbușire la cutremurul" +
          " de proiectare corespunzător stării-limită ultime",
    },
  });

  const rs2 = await prisma.seismicRisk.upsert({
    where: { className: "RsII" },
    update: {},
    create: {
      className: "RsII",
      description:
          "construcțiile care sub efectul cutremurului de proiectare " +
          "pot suferi degradări structurale majore, dar la care pierderea " +
          "stabilității este puțin probabilă",
    },
  });

  const rs3 = await prisma.seismicRisk.upsert({
    where: { className: "RsIII" },
    update: {},
    create: {
      className: "RsIII",
      description:
          "construcțiile care sub efectul cutremurului de proiectare" +
          " pot prezenta degradări structurale care nu afectează semnificativ" +
          " siguranța structurală, dar la care degradările nestructurale" +
          " pot fi importante;",
    },
  });
}

async function seedBuildings(csvEntries) {
  for (const entry of csvEntries) {
    await prisma.building.create({
      data: {
        buildingYear: parseInt(entry.building_year) || 0,
        heightRegime: entry.height_regime,
        numApartments: parseInt(entry.no_aps) || 0,
        analysisYear: parseInt(entry.technical_year) || 0,
        buildingStatus: "active",
        technicExpert: entry.expert,

        location: {
          create: {
            street: entry.address,
            number: entry.number,
            latitude: +entry.lat,
            longitude: +entry.lng,
            thumbnail: entry.thumbnail,
            sector: parseInt(entry.sector.replace(/\D/g, "")) || 0,
          },
        },
        tickets: {},
        savedBy: {},
        notifications: {},
        seismicRisk: {
          connect: { className: entry.seismic_risk.split(" ").at(-1) },
        },
      },
    });
  }
}

async function main() {
  await createSuperUser();
  await upsertRisks();

  const data = readFileSync("./prisma/building_list.csv", "utf-8");
  const headers = [
    "address",
    "number",
    "sector",
    "building_year",
    "height_regime",
    "no_aps",
    "technical_year",
    "expert",
    "seismic_risk",
    "thumbnail",
    "lat",
    "lng",
  ];
  parse(
      data,
      {
        delimiter: ",",
        columns: headers,
      },
      async (error, result: CsvEntry[]) => {
        if (error) {
          console.error(error);
        }

        await seedBuildings(result);
      }
  );
}

main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });