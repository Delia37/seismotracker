import { MockContext, Context, createMockContext } from "../context";
import {
  createLocation,
  updateLocation,
  deleteLocation,
  getLocation,
} from "../functions-with-context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test("should create new location ", async () => {
  const location = {
    id: 1,
    street: "Main St",
    number: "123",
    sector: 1,
    thumbnail: "http://example.com/image.jpg",
    buildingId: 1,
  };
  mockCtx.prisma.location.create.mockResolvedValue(location);

  await expect(createLocation(location, ctx)).resolves.toEqual(location);
});

test("should update a location", async () => {
  const location = {
    id: 1,
    street: "New Main St",
    number: "124",
    sector: 2,
    thumbnail: "http://example.com/new-image.jpg",
    buildingId: 1,
  };
  mockCtx.prisma.location.update.mockResolvedValue(location);

  await expect(updateLocation(location, ctx)).resolves.toEqual(location);
});

test("should delete a location", async () => {
  const locationId = 1;
  const location = {
    id: locationId,
    street: "Main St",
    number: "123",
    sector: 1,
    thumbnail: "http://example.com/image.jpg",
    buildingId: 1,
  };

  mockCtx.prisma.location.delete.mockResolvedValue(location);

  await expect(deleteLocation(locationId, ctx)).resolves.toEqual(location);
});

test("should get a location by id", async () => {
  const locationId = 1;
  const location = {
    id: locationId,
    street: "Main St",
    number: "123",
    sector: 1,
    thumbnail: "http://example.com/image.jpg",
    buildingId: 1,
  };

  mockCtx.prisma.location.findUnique.mockResolvedValue(location);

  await expect(getLocation(locationId, ctx)).resolves.toEqual(location);
});
