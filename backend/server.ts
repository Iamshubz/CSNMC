import express from "express";
import path from "node:path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import complaintRoutes from "./routes/complaints";
import adminRoutes from "./routes/admin";

dotenv.config();

const app = express();
app.use(express.json());
const frontendRoot = path.resolve(process.cwd(), "frontend");

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api", adminRoutes);

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      root: frontendRoot,
      configFile: path.resolve(frontendRoot, "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(frontendRoot, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(frontendRoot, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
