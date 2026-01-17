import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";
import { readFileSync, writeFileSync } from "fs";
import { AppService } from "../src/app.service";
import { GoogleMapsService } from "../src/google-maps/google-maps.service";
import { ConfigService } from "@nestjs/config";

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
};

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
    let coordinates = await appService
      .getAddressCoords({
        street: entry.address,
        number: entry.number,
        city: "Bucharest",
        state: "RO",
        postalCode: "",
      })
      .catch((err) => {
        return { lat: 0, lng: 0 };
      });

    // get the thumbnail url for the building
    const thumbnailUrl = await appService
      .getStaticImage({
        lat: coordinates.lat,
        lng: coordinates.lng,
      })
      .catch((err) => {
        return "";
      });

    if (
      (coordinates.lat === 0 && coordinates.lng === 0) ||
      thumbnailUrl === ""
    ) {
      console.log(
        "Skipping entry" + entry.id + " " + entry.number + " " + entry.address
      );
      continue;
    }

    entry.seismic_risk = entry.seismic_risk.split(" ").at(-1);

    if (
      entry.seismic_risk !== "RsI" &&
      entry.seismic_risk !== "RsII" &&
      entry.seismic_risk !== "RsIII"
    ) {
      entry.seismic_risk = "RsIII";
    }

    let toWrite =
      entry.address +
      "," +
      entry.number +
      "," +
      entry.sector +
      "," +
      entry.building_year +
      "," +
      entry.height_regime +
      "," +
      entry.no_aps +
      "," +
      entry.technical_year +
      "," +
      entry.expert +
      "," +
      entry.seismic_risk +
      "," +
      `"${thumbnailUrl}"` +
      "," +
      coordinates.lat +
      "," +
      coordinates.lng +
      "\n";

    writeFileSync("./prisma/thumbnail_urls.txt", toWrite, {
      flag: "a",
    });

    console.log("Writing entry" + entry.address + " " + entry.number);

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
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            thumbnail: thumbnailUrl,
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
