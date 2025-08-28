import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";
import { registerRoutes } from "./routes.js";
import cors from "cors";

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(cors({
  origin: [
    "http://localhost:5173",  // local dev
    "https://hire-job-fast.netlify.app" // production
  ],
  credentials: true, // if you use cookies or `credentials: "include"`
}));

// Middleware: API logging
app.use((req, res, next) => {
  const start = Date.now();
  const pathUrl = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathUrl.startsWith("/api")) {
      let logLine = `${req.method} ${pathUrl} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse)
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 120) logLine = logLine.slice(0, 119) + "…";
      console.log(logLine);
    }
  });

  next();
});

// Register routes
(async () => {
  const server = await registerRoutes(app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });

  // Start only backend server (no Vite, no React)
  const port = parseInt(process.env.PORT || "3000", 10);
  server.listen(port, "0.0.0.0", () => {
    console.log(`🚀 API running at http://localhost:${port}`);
  });
})();

// ⚡ Export app (for testing / serverless)
export default app;
