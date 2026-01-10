import { MockContext, Context, createMockContext } from "../context";
import {
  createNotification,
  updateNotification,
  deleteNotification,
  getNotification,
} from "../functions-with-context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test("should create new notification", async () => {
  const notification = {
    id: 1,
    title: "New Notification",
    description: "Notification description",
    buildingId: 1,
    userId: 1,
  };
  mockCtx.prisma.notification.create.mockResolvedValue(notification);

  await expect(createNotification(notification, ctx)).resolves.toEqual(
    notification
  );
});

test("should update a notification", async () => {
  const notification = {
    id: 1,
    title: "Updated Notification",
    description: "Updated notification description",
    buildingId: 1,
    userId: 1,
  };
  mockCtx.prisma.notification.update.mockResolvedValue(notification);

  await expect(updateNotification(notification, ctx)).resolves.toEqual(
    notification
  );
});

test("should delete a notification", async () => {
  const notificationId = 1;
  const notification = {
    id: notificationId,
    title: "New Notification",
    description: "Notification description",
    buildingId: 1,
    userId: 1,
  };

  mockCtx.prisma.notification.delete.mockResolvedValue(notification);

  await expect(deleteNotification(notificationId, ctx)).resolves.toEqual(
    notification
  );
});

test("should get a notification by id", async () => {
  const notificationId = 1;
  const notification = {
    id: notificationId,
    title: "New Notification",
    description: "Notification description",
    buildingId: 1,
    userId: 1,
  };

  mockCtx.prisma.notification.findUnique.mockResolvedValue(notification);

  await expect(getNotification(notificationId, ctx)).resolves.toEqual(
    notification
  );
});
