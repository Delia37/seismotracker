import { MockContext, Context, createMockContext } from "../context";
import {
  createUser,
  updateUser,
  deleteUser,
  getUser,
} from "../functions-with-context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test("should create new user ", async () => {
  const user = {
    id: 1,
    email: "hello@test.io",
    fullName: "Rich",
    isAdmin: false,
  };
  mockCtx.prisma.user.create.mockResolvedValue(user);

  await expect(createUser(user, ctx)).resolves.toEqual({
    id: 1,
    email: "hello@test.io",
    fullName: "Rich",
    isAdmin: false,
  });
});

test("should update a users name ", async () => {
  const user = {
    id: 1,
    email: "hello@test.io",
    fullName: "Rich Haines",
    isAdmin: false,
  };
  mockCtx.prisma.user.update.mockResolvedValue(user);

  await expect(updateUser(user, ctx)).resolves.toEqual({
    id: 1,
    email: "hello@test.io",
    fullName: "Rich Haines",
    isAdmin: false,
  });
});

test("should delete a user", async () => {
  const userId = 1;
  const user = {
    id: userId,
    email: "hello@test.io",
    fullName: "Rich Haines",
    isAdmin: false,
  };

  mockCtx.prisma.user.delete.mockResolvedValue(user);

  await expect(deleteUser(userId, ctx)).resolves.toEqual(user);
});

test("should get a user by id", async () => {
  const userId = 1;
  const user = {
    id: userId,
    email: "hello@test.io",
    fullName: "Rich Haines",
    isAdmin: false,
  };

  mockCtx.prisma.user.findUnique.mockResolvedValue(user);

  await expect(getUser(userId, ctx)).resolves.toEqual(user);
});
