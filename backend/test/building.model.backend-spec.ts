import { MockContext, Context, createMockContext } from "../context";
import {
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getBuilding,
} from "../functions-with-context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test("should create new building ", async () => {
  const building = {
    id: 1,
    buildingYear: 2000,
    heightRegime: "Low Rise",
    numApartments: 20,
    analysisYear: 2020,
    status: "Approved",
    technicExpert: "John Doe",
    extraInfo: "No extra information",
    seismicRiskId: 1,
    userId: 1,
    adminId: 1,
  };
  mockCtx.prisma.building.create.mockResolvedValue(building);

  await expect(createBuilding(building, ctx)).resolves.toEqual(building);
});

test("should update a building", async () => {
  const building = {
    id: 1,
    buildingYear: 2005,
    heightRegime: "P+1",
    numApartments: 25,
    analysisYear: 2021,
    status: "Rejected",
    technicExpert: "Jane Doe",
    extraInfo: "Updated extra information",
    seismicRiskId: 1,
    userId: 1,
    adminId: 1,
  };
  mockCtx.prisma.building.update.mockResolvedValue(building);

  await expect(updateBuilding(building, ctx)).resolves.toEqual(building);
});

test("should delete a building", async () => {
  const buildingId = 1;
  const building = {
    id: buildingId,
    buildingYear: 2000,
    heightRegime: "Low Rise",
    numApartments: 20,
    analysisYear: 2020,
    status: "Approved",
    technicExpert: "John Doe",
    extraInfo: "No extra information",
    seismicRiskId: 1,
    userId: 1,
    adminId: 1,
  };

  mockCtx.prisma.building.delete.mockResolvedValue(building);

  await expect(deleteBuilding(buildingId, ctx)).resolves.toEqual(building);
});

test("should get a building by id", async () => {
  const buildingId = 1;
  const building = {
    id: buildingId,
    buildingYear: 2000,
    heightRegime: "Low Rise",
    numApartments: 20,
    analysisYear: 2020,
    status: "Approved",
    technicExpert: "John Doe",
    extraInfo: "No extra information",
    seismicRiskId: 1,
    userId: 1,
    adminId: 1,
  };

  mockCtx.prisma.building.findUnique.mockResolvedValue(building);

  await expect(getBuilding(buildingId, ctx)).resolves.toEqual(building);
});
