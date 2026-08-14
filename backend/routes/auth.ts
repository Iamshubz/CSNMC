import express from "express";
import bcrypt from "bcryptjs";
import db from "../db/database";
import { signJwt } from "../middleware/auth";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { email, password, role, name } = req.body;

  const userRole = role || "CITIZEN";

  if (!email || !password || !name) {
    return res.status(400).json({
      error: "Email, password, and name are required",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await db.query(
      `
      INSERT INTO users (email, password, role, name)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [email, hashedPassword, userRole, name]
    );

    res.status(201).json({
      id: result.rows[0].id,
    });
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    console.error("Registration error:", error);

    res.status(500).json({
      error: "Registration failed",
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user: any = result.rows[0];

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = signJwt({
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      error: "Login failed",
    });
  }
});

export default router;