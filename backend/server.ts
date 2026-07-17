import express from "express";
import authRouter from "./routes/auth";
import complaintsRouter from "./routes/complaints";
import adminRouter from "./routes/admin";

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRouter);
app.use("/api/complaints", complaintsRouter);
app.use("/api", adminRouter);

app.get("/", (_req, res) => {
  res.send("CSNMC backend is running");
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});