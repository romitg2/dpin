import express from "express";
import { authMiddleware } from "./middleware";
import { prisma } from "@repo/db";

const app = express();
app.use(express.json());

// create website endpoint
// get website endpoint status
// get all websites endpoint

app.post("/api/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;
  const { name, url } = req.body;

  try {
    const data = await prisma.websites.create({
      data: {
        userId,
        name,
        url,
      },
    });

    res.status(200).json(data.id);
  } catch (error) {
    res.status(500).json({ error: "Failed to create website" });
  }
});

app.get("/api/website", authMiddleware, async (req, res) => {
  const userId = req.userId!;

  try {
    const data = await prisma.websites.findMany({
      where: {
        userId,
        Disabled: false,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to get websites" });
  }
});

app.get("/api/website/status", authMiddleware, async (req, res) => {
  const websiteId = req.query.websiteId?.toString() as string;
  const userId = req.userId;

  const data = await prisma.websites.findFirst({
    where: {
      id: websiteId,
      userId,
      Disabled: false,
    },
    include: {
      websiteTicks: true,
    },
  });

  if (!data) {
    res.status(404).json({ error: "Website not found" });
  }

  res.status(200).json(data);
});

app.delete("/api/website", authMiddleware, async (req, res) => {
  const userId = req.userId;
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

app.listen(3000, () => {
  console.log("server is running on port 3000");
});
