import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import authRoutes from "./backend/routes/auth";
import complaintRoutes from "./backend/routes/complaints";
import adminRoutes from "./backend/routes/admin";

dotenv.config();

const app = express();
app.use(express.json());

// --- API Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api", adminRoutes);

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
