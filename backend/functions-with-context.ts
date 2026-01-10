import { Context } from "./context";

interface CreateUserInput {
  id: number;
  email: string;
  password: string;
  fullName: string;
  isAdmin: boolean;
}

interface UpdateUserInput {
  id: number;
  fullName: string;
}

interface CreateBuildingInput {
  buildingYear: number;
  heightRegime: string;
  numApartments: number | null;
  analysisYear: number;
  buildingStatus: string;
  technicExpert: string;
  extraInfo: string | null;
  seismicRiskId: number;
  userId: number;
  adminId: number;
}

interface UpdateBuildingInput {
  id: number;
  buildingYear?: number;
  heightRegime?: string;
  numApartments?: number | null;
  analysisYear?: number;
  buildingStatus?: string;
  technicExpert?: string;
  extraInfo?: string | null;
}

interface CreateLocationInput {
  street: string;
  number: string | null;
  sector: number;
  thumbnail: string | null;
  buildingId: number;
}

interface UpdateLocationInput {
  id: number;
  street?: string;
  number?: string | null;
  sector?: number;
  thumbnail?: string | null;
}

interface CreateSeismicRiskInput {
  className: string;
  description: string;
}

interface UpdateSeismicRiskInput {
  id: number;
  className?: string;
  description?: string;
}
interface CreateTicketInput {
  title: string;
  description: string;
  category: string;
  docs: string[];
  buildingId: number;
  userId: number;
  adminId: number;
}

interface UpdateTicketInput {
  id: number;
  title?: string;
  description?: string;
  category?: string;
  docs?: string[];
}

interface CreateNotificationInput {
  title: string;
  description: string;
  buildingId: number;
  userId: number;
}

interface UpdateNotificationInput {
  id: number;
  title?: string;
  description?: string;
}

export async function createUser(user: CreateUserInput, ctx: Context) {
  return await ctx.prisma.user.create({
    data: user,
  });
}

export async function updateUser(user: UpdateUserInput, ctx: Context) {
  return await ctx.prisma.user.update({
    where: { id: user.id },
    data: { fullName: user.fullName },
  });
}

export async function deleteUser(id: number, ctx: Context) {
  return await ctx.prisma.user.delete({
    where: { id },
  });
}

export async function getUser(id: number, ctx: Context) {
  return await ctx.prisma.user.findUnique({
    where: { id },
  });
}

export async function deleteBuilding(id: number, ctx: Context) {
  return await ctx.prisma.building.delete({
    where: { id },
  });
}

export async function getBuilding(id: number, ctx: Context) {
  return await ctx.prisma.building.findUnique({
    where: { id },
  });
}

export async function createBuilding(
  building: CreateBuildingInput,
  ctx: Context
) {
  return await ctx.prisma.building.create({
    data: building,
  });
}

export async function updateBuilding(
  building: UpdateBuildingInput,
  ctx: Context
) {
  const { id, ...updateData } = building;
  return await ctx.prisma.building.update({
    where: { id },
    data: updateData,
  });
}

export async function createLocation(
  location: CreateLocationInput,
  ctx: Context
) {
  return await ctx.prisma.location.create({
    data: location,
  });
}

export async function updateLocation(
  location: UpdateLocationInput,
  ctx: Context
) {
  const { id, ...updateData } = location;
  return await ctx.prisma.location.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteLocation(id: number, ctx: Context) {
  return await ctx.prisma.location.delete({
    where: { id },
  });
}

export async function getLocation(id: number, ctx: Context) {
  return await ctx.prisma.location.findUnique({
    where: { id },
  });
}

export async function createSeismicRisk(
  seismicRisk: CreateSeismicRiskInput,
  ctx: Context
) {
  return await ctx.prisma.seismicRisk.create({
    data: seismicRisk,
  });
}

export async function updateSeismicRisk(
  seismicRisk: UpdateSeismicRiskInput,
  ctx: Context
) {
  const { id, ...updateData } = seismicRisk;
  return await ctx.prisma.seismicRisk.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteSeismicRisk(id: number, ctx: Context) {
  return await ctx.prisma.seismicRisk.delete({
    where: { id },
  });
}

export async function getSeismicRisk(id: number, ctx: Context) {
  return await ctx.prisma.seismicRisk.findUnique({
    where: { id },
  });
}

export async function createTicket(ticket: CreateTicketInput, ctx: Context) {
  return await ctx.prisma.ticket.create({
    data: ticket,
  });
}

export async function updateTicket(ticket: UpdateTicketInput, ctx: Context) {
  const { id, ...updateData } = ticket;
  return await ctx.prisma.ticket.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteTicket(id: number, ctx: Context) {
  return await ctx.prisma.ticket.delete({
    where: { id },
  });
}

export async function getTicket(id: number, ctx: Context) {
  return await ctx.prisma.ticket.findUnique({
    where: { id },
  });
}

export async function createNotification(
  notification: CreateNotificationInput,
  ctx: Context
) {
  return await ctx.prisma.notification.create({
    data: notification,
  });
}

export async function updateNotification(
  notification: UpdateNotificationInput,
  ctx: Context
) {
  const { id, ...updateData } = notification;
  return await ctx.prisma.notification.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteNotification(id: number, ctx: Context) {
  return await ctx.prisma.notification.delete({
    where: { id },
  });
}

export async function getNotification(id: number, ctx: Context) {
  return await ctx.prisma.notification.findUnique({
    where: { id },
  });
}
