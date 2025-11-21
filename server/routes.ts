import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConfigSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Config endpoints
  app.get("/api/config", async (req, res) => {
    const config = await storage.getConfig();
    res.json(config);
  });

  app.post("/api/config", async (req, res) => {
    try {
      const validated = insertConfigSchema.parse(req.body);
      const config = await storage.updateConfig(validated);
      res.json(config);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
