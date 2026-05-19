import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/database";
import { JWT_SECRET } from "../middleware/auth";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, role, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = db.prepare("INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)").run(email, hashedPassword, role, name);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET);
  res.json({ token, user: { id: user.id, role: user.role, email: user.email, name: user.name } });
});

export default router;
