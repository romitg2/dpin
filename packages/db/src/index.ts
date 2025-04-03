import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };

export type WebsiteWithTicksData = Prisma.WebsitesGetPayload<{
  include: { websiteTicks: true };
}>;

export type WebsitesWithTicksData = WebsiteWithTicksData[];

export type WebsiteTickData = Prisma.WebsiteTicksGetPayload<{}>;
