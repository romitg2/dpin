import express from "express";
import { authMiddleware } from "./middleware";
import { prisma, type WebsitesWithTicksData } from "@repo/db";
import type {
  GetWebsitesResponse,
  GetWebsiteResponse,
  AddWebsiteRequest,
  AddWebsiteResponse,
} from "@repo/types";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
// create website endpoint
// get website endpoint status
// get all websites endpoint

app.post("/api/website", authMiddleware, async (req, res) => {
  const userId = (req as unknown as any).userId;
  const { url } = req.body as Omit<AddWebsiteRequest, "userId">;

  console.log("userId: ", userId);
  console.log("url: ", url);

  try {
    const response: AddWebsiteResponse = await prisma.websites.upsert({
      where: {
        url_userId: {
          url,
          userId,
        },
      },
      create: {
        userId,
        url,
      },
      update: {
        userId,
        url,
      },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to create website" });
  }
});

app.get("/api/websites", authMiddleware, async (req, res) => {
  const userId = (req as unknown as any).userId;

  try {
    const data: WebsitesWithTicksData = await prisma.websites.findMany({
      where: {
        userId,
        Disabled: false,
      },
      include: {
        websiteTicks: true,
      },
    });

    const response: GetWebsitesResponse = { websites: data };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to get websites" });
  }
});

import type { WebsiteWithTicksData } from "@repo/db";

app.get("/api/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId?.toString() as string;
  const userId = (req as unknown as any).userId;

  const data: WebsiteWithTicksData | null = await prisma.websites.findFirst({
    where: {
      id: websiteId,
      userId,
      Disabled: false,
    },
    include: {
      websiteTicks: true,
    },
  });

  const response: GetWebsiteResponse = { website: data };

  if (!data) {
    res.status(404).json({ error: "Website not found" });
  }

  res.status(200).json(data);
});

app.delete("/api/website", authMiddleware, async (req, res) => {
  const userId = (req as unknown as any).userId;
  const websiteId = req.query.websiteId?.toString() as string;

  try {
    const data = await prisma.websites.update({
      where: {
        id: websiteId,
        userId,
      },
      data: {
        Disabled: true,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete website" });
  }
});

app.listen(5050, () => {
  console.log("server is running on port 5050");
});
