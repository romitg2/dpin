import {  Prisma } from "@prisma/client";

export type WebsitesWithTicksData = Prisma.WebsitesGetPayload<{
  include: { websiteTicks: true };
}>;

export type WebsiteWithTicksData = Prisma.WebsitesGetPayload<{
  include: { websiteTicks: true };
}>; 

export type WebsiteTickData = Prisma.WebsiteTicksGetPayload<{}>;

export type ValidatorData = Prisma.ValidatorGetPayload<{}>;

export type WebsiteData = Prisma.WebsitesGetPayload<{}>;    