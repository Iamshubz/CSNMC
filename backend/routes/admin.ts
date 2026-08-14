import express from "express";
import db from "../db/database";
import { authenticateToken } from "../middleware/auth";
import { requireRole } from "../middleware/authorize";

const router = express.Router();

// Get Workers List
router.get(
  "/workers",
  authenticateToken,
  requireRole("ADMIN"),
  async (_req, res) => {
    try {
      const result = await db.query(
        `
        SELECT id, name, email
        FROM users
        WHERE role = 'WORKER'
        ORDER BY name
        `
      );

      res.json(result.rows);
    } catch (error) {
      console.error("Get workers error:", error);

      res.status(500).json({
        error: "Failed to fetch workers",
      });
    }
  }
);

// Get Analytics
router.get(
  "/analytics",
  authenticateToken,
  requireRole("ADMIN"),
  async (_req, res) => {
    try {
      const totalResult = await db.query(
        "SELECT COUNT(*) AS count FROM complaints"
      );

      const resolvedResult = await db.query(
        "SELECT COUNT(*) AS count FROM complaints WHERE status = 'RESOLVED'"
      );

      const pendingResult = await db.query(
        "SELECT COUNT(*) AS count FROM complaints WHERE status = 'PENDING'"
      );

      const categoryResult = await db.query(`
        SELECT
          category AS name,
          COUNT(*) AS value
        FROM complaints
        GROUP BY category
        ORDER BY value DESC
      `);

      res.json({
        total: Number(totalResult.rows[0].count),
        resolved: Number(resolvedResult.rows[0].count),
        pending: Number(pendingResult.rows[0].count),
        byCategory: categoryResult.rows.map((row) => ({
          name: row.name,
          value: Number(row.value),
        })),
      });
    } catch (error) {
      console.error("Analytics error:", error);

      res.status(500).json({
        error: "Failed to fetch analytics",
      });
    }
  }
);

export default router;