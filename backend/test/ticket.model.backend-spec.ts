import { MockContext, Context, createMockContext } from "../context";
import {
  createTicket,
  updateTicket,
  deleteTicket,
  getTicket,
} from "../functions-with-context";

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test("should create new ticket ", async () => {
  const ticket = {
    id: 1,
    title: "New Ticket",
    description: "Ticket description",
    category: "General",
    docs: ["doc1.pdf", "doc2.pdf"],
    buildingId: 1,
    userId: 1,
    adminId: 1,
  };
  mockCtx.prisma.ticket.create.mockResolvedValue(ticket);

  await expect(createTicket(ticket, ctx)).resolves.toEqual(ticket);
});

test("should update a ticket", async () => {
  const ticket = {
    id: 1,
    title: "Updated Ticket",
    description: "Updated ticket description",
    category: "Maintenance",
    docs: ["doc1.pdf", "doc2.pdf", "doc3.pdf"],
    buildingId: 1,
    userId: 1,
    adminId: 1,
  };
  mockCtx.prisma.ticket.update.mockResolvedValue(ticket);

  await expect(updateTicket(ticket, ctx)).resolves.toEqual(ticket);
});

test("should delete a ticket", async () => {
  const ticketId = 1;
  const ticket = {
    id: ticketId,
    title: "New Ticket",
    description: "Ticket description",
    category: "General",
    docs: ["doc1.pdf", "doc2.pdf"],
    buildingId: 1,
    userId: 1,
    adminId: 1,
  };

  mockCtx.prisma.ticket.delete.mockResolvedValue(ticket);

  await expect(deleteTicket(ticketId, ctx)).resolves.toEqual(ticket);
});

test("should get a ticket by id", async () => {
  const ticketId = 1;
  const ticket = {
    id: ticketId,
    title: "New Ticket",
    description: "Ticket description",
    category: "General",
    docs: ["doc1.pdf", "doc2.pdf"],
    buildingId: 1,
    userId: 1,
    adminId: 1,
  };

  mockCtx.prisma.ticket.findUnique.mockResolvedValue(ticket);

  await expect(getTicket(ticketId, ctx)).resolves.toEqual(ticket);
});
