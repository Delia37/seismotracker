import { MockContext, Context, createMockContext } from "../context";
import {
  createSeismicRisk,
  updateSeismicRisk,
  deleteSeismicRisk,
  getSeismicRisk,
} from "../functions-with-context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test("should create new seismic risk ", async () => {
  const seismicRisk = {
    id: 1,
    className: "Class A",
    description: "Low risk",
  };
  mockCtx.prisma.seismicRisk.create.mockResolvedValue(seismicRisk);

  await expect(createSeismicRisk(seismicRisk, ctx)).resolves.toEqual(
    seismicRisk
  );
});

test("should update a seismic risk", async () => {
  const seismicRisk = {
    id: 1,
    className: "Class B",
    description: "Medium risk",
  };
  mockCtx.prisma.seismicRisk.update.mockResolvedValue(seismicRisk);

  await expect(updateSeismicRisk(seismicRisk, ctx)).resolves.toEqual(
    seismicRisk
  );
});

test("should delete a seismic risk", async () => {
  const seismicRiskId = 1;
  const seismicRisk = {
    id: seismicRiskId,
    className: "Class A",
    description: "Low risk",
  };

  mockCtx.prisma.seismicRisk.delete.mockResolvedValue(seismicRisk);

  await expect(deleteSeismicRisk(seismicRiskId, ctx)).resolves.toEqual(
    seismicRisk
  );
});

test("should get a seismic risk by id", async () => {
  const seismicRiskId = 1;
  const seismicRisk = {
    id: seismicRiskId,
    className: "Class A",
    description: "Low risk",
  };

  mockCtx.prisma.seismicRisk.findUnique.mockResolvedValue(seismicRisk);

  await expect(getSeismicRisk(seismicRiskId, ctx)).resolves.toEqual(
    seismicRisk
  );
});
