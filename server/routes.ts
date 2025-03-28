import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // This application is primarily client-side
  // We only need the server to serve the static files
  
  // For future API endpoints if needed, add them here
  // app.get('/api/example', (req, res) => {
  //   res.json({ message: 'Example API response' });
  // });

  const httpServer = createServer(app);

  return httpServer;
}
