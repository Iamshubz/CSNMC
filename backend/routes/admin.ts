import express from "express";
import db from "../db/database";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/authorize";

const router = express.Router();

// Get Workers List
router.get("/workers", authenticateToken, requireRole('ADMIN'), (req: any, res) => {
  const workers = db.prepare("SELECT id, name, email FROM users WHERE role = 'WORKER'").all();
  res.json(workers);
});

// Get Analytics
router.get("/analytics", authenticateToken, requireRole('ADMIN'), (req: any, res) => {
  const total = db.prepare("SELECT COUNT(*) as count FROM complaints").get() as any;
  const resolved = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'RESOLVED'").get() as any;
  const pending = db.prepare("SELECT COUNT(*) as count FROM complaints WHERE status = 'PENDING'").get() as any;
  const byCategory = db.prepare("SELECT category as name, COUNT(*) as value FROM complaints GROUP BY category").all();
  
  res.json({
    total: total.count,
    resolved: resolved.count,
    pending: pending.count,
    byCategory
  });
});

export default router;
