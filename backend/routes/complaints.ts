import express from "express";
import db from "../db/database";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

const getAiClient = async () => {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (error) {
    console.warn("Gemini AI client unavailable, skipping categorization", error);
    return null;
  }
};

// Get Complaints
router.get("/", authenticateToken, (req: any, res) => {
  let complaints;
  if (req.user.role === 'ADMIN') {
    complaints = db.prepare(`
      SELECT c.*, u.name as citizen_name, w.name as worker_name 
      FROM complaints c 
      JOIN users u ON c.citizen_id = u.id 
      LEFT JOIN users w ON c.worker_id = w.id
      ORDER BY c.created_at DESC
    `).all();
  } else if (req.user.role === 'WORKER') {
    complaints = db.prepare("SELECT * FROM complaints WHERE worker_id = ? ORDER BY created_at DESC").all(req.user.id);
  } else {
    complaints = db.prepare("SELECT * FROM complaints WHERE citizen_id = ? ORDER BY created_at DESC").all(req.user.id);
  }
  res.json(complaints);
});

// Create Complaint
router.post("/", authenticateToken, async (req: any, res) => {
  const { title, description, location, image_url } = req.body;
  
  // AI Categorization
  let category = "General";
  const ai = await getAiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Categorize this waste management complaint into one of: [Garbage Overflow, Illegal Dumping, Missed Pickup, Hazardous Waste, Other]. 
        Title: ${title}
        Description: ${description}
        Return ONLY the category name.`,
      });
      category = response.text?.trim() || "General";
    } catch (e) {
      console.error("AI Categorization failed", e);
    }
  }

  const result = db.prepare(`
    INSERT INTO complaints (title, description, location, category, citizen_id, image_url) 
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, description, location, category, req.user.id, image_url);
  
  res.status(201).json({ id: result.lastInsertRowid, category });
});

// Update Complaint
router.put("/:id", authenticateToken, (req: any, res) => {
  const { id } = req.params;
  const { status, worker_id, proof_image_url } = req.body;

  if (req.user.role === 'ADMIN') {
    db.prepare("UPDATE complaints SET status = ?, worker_id = ? WHERE id = ?").run(status, worker_id, id);
  } else if (req.user.role === 'WORKER') {
    db.prepare("UPDATE complaints SET status = ?, proof_image_url = ? WHERE id = ? AND worker_id = ?").run(status, proof_image_url, id, req.user.id);
  }
  res.json({ success: true });
});

export default router;
