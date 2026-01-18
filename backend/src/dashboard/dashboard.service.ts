import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    // 1) Buildings by seismic risk
    const byRisk = await this.prisma.building.groupBy({
      by: ["seismicRiskId"],
      _count: { _all: true },
    });

    const riskIds = byRisk.map((x) => x.seismicRiskId);
    const risks = await this.prisma.seismicRisk.findMany({
      where: { id: { in: riskIds } },
      select: { id: true, className: true },
    });

    const riskMap = new Map(risks.map((r) => [r.id, r.className]));
    const buildingsByRisk = byRisk.map((x) => ({
      risk: riskMap.get(x.seismicRiskId) ?? `RiskId:${x.seismicRiskId}`,
      count: x._count._all,
    }));

    // 2) Buildings by status
    const byStatus = await this.prisma.building.groupBy({
      by: ["buildingStatus"],
      _count: { _all: true },
    });

    const buildingsByStatus = byStatus.map((x) => ({
      status: x.buildingStatus,
      count: x._count._all,
    }));

    // 3) Buildings by sector (din Location)
    const bySector = await this.prisma.location.groupBy({
      by: ["sector"],
      _count: { _all: true },
    });

    const buildingsBySector = bySector
      .map((x) => ({ sector: x.sector, count: x._count._all }))
      .sort((a, b) => a.sector - b.sector);

    // 4) Tickets open/closed + by category
    const ticketsByClosed = await this.prisma.ticket.groupBy({
      by: ["isClosed"],
      _count: { _all: true },
    });

    const ticketsStatus = {
      open: ticketsByClosed.find((x) => x.isClosed === false)?._count._all ?? 0,
      closed:
        ticketsByClosed.find((x) => x.isClosed === true)?._count._all ?? 0,
    };

    const ticketsByCategoryRaw = await this.prisma.ticket.groupBy({
      by: ["category", "isClosed"],
      _count: { _all: true },
    });

    // normalizăm pe categorie: { category, open, closed }
    const catMap = new Map<
      string,
      { category: string; open: number; closed: number }
    >();
    for (const row of ticketsByCategoryRaw) {
      const entry = catMap.get(row.category) ?? {
        category: row.category,
        open: 0,
        closed: 0,
      };
      if (row.isClosed) entry.closed += row._count._all;
      else entry.open += row._count._all;
      catMap.set(row.category, entry);
    }
    const ticketsByCategory = Array.from(catMap.values()).sort(
      (a, b) => b.open + b.closed - (a.open + a.closed)
    );

    // 5) Top saved buildings (optional, nice)
    const topSaved = await this.prisma.building.findMany({
      take: 5,
      orderBy: {
        savedBy: { _count: "desc" },
      },
      include: {
        location: true,
        _count: { select: { savedBy: true } },
      },
    });

    const topSavedBuildings = topSaved.map((b) => ({
      id: b.id,
      address: `${b.location?.street ?? ""} ${b.location?.number ?? ""}`.trim(),
      saves: b._count.savedBy,
    }));

    return {
      buildingsByRisk,
      buildingsByStatus,
      buildingsBySector,
      ticketsStatus,
      ticketsByCategory,
      topSavedBuildings,
    };
  }
}
