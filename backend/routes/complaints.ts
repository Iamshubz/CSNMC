import express from "express";
import db from "../db/database";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

type ComplaintPayload = {
  title?: string;
  description?: string;
  location?: string;
  image_url?: string;
  captured_at?: string;
  capture_latitude?: number | string | null;
  capture_longitude?: number | string | null;
  capture_accuracy?: number | string | null;
};

const toNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const scoreComplaintRisk = (payload: {
  imageUrl: string;
  capturedAt?: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
}) => {
  const reasons: string[] = [];
  let score = 0;

  if (!payload.imageUrl.startsWith("data:image/")) {
    score += 45;
    reasons.push("Image was not captured through the live camera flow");
  }

  if (!payload.capturedAt) {
    score += 25;
    reasons.push("Capture timestamp is missing");
  } else {
    const capturedTime = Date.parse(payload.capturedAt);
    const ageMs = Number.isNaN(capturedTime) ? Number.POSITIVE_INFINITY : Date.now() - capturedTime;
    if (ageMs > 5 * 60 * 1000) {
      score += 20;
      reasons.push("Capture timestamp looks stale");
    }
  }

  if (payload.latitude === null || payload.longitude === null) {
    score += 20;
    reasons.push("GPS location is missing");
  }

  if (payload.accuracy !== null && payload.accuracy !== undefined && payload.accuracy > 150) {
    score += 10;
    reasons.push("GPS accuracy is low");
  }

  if (payload.imageUrl.length < 6000) {
    score += 10;
    reasons.push("Image payload is unusually small");
  }

  const riskLevel = score >= 70 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";
  const moderationStatus = score >= 35 ? "REVIEW_REQUIRED" : "AUTO_APPROVED";

  return {
    riskScore: Math.min(score, 100),
    riskLevel,
    moderationStatus,
    riskReason: reasons.length > 0 ? reasons.join("; ") : "Live capture looks consistent",
  };
};

const categorizeWithGroq = async (title: string, description: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0,
        max_tokens: 12,
        messages: [
          {
            role: "system",
            content:
              "You classify waste management complaints. Return only one category name from this list: Garbage Overflow, Illegal Dumping, Missed Pickup, Hazardous Waste, Other.",
          },
          {
            role: "user",
            content: `Title: ${title}\nDescription: ${description}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq request failed with status ${response.status}`);
    }

    const data = await response.json();
    const category = data?.choices?.[0]?.message?.content?.trim();
    return category || null;
  } catch (error) {
    console.warn("Groq categorization unavailable, skipping categorization", error);
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
  const payload = req.body as ComplaintPayload;
  const title = payload.title?.trim();
  const description = payload.description?.trim();
  const location = payload.location?.trim();
  const imageUrl = payload.image_url?.trim();
  const capturedAt = payload.captured_at?.trim();
  const captureLatitude = toNumber(payload.capture_latitude);
  const captureLongitude = toNumber(payload.capture_longitude);
  const captureAccuracy = toNumber(payload.capture_accuracy);

  if (!title || !description || !location) {
    return res.status(400).json({ error: "Title, description, and location are required" });
  }

  if (!imageUrl || !imageUrl.startsWith("data:image/")) {
    return res.status(400).json({ error: "A live camera image is required" });
  }

  if (!capturedAt) {
    return res.status(400).json({ error: "Capture timestamp is required" });
  }
  
  let category = "General";
  const groqCategory = await categorizeWithGroq(title, description);
  if (groqCategory) {
    category = groqCategory;
  }

  const moderation = scoreComplaintRisk({
    imageUrl,
    capturedAt,
    latitude: captureLatitude,
    longitude: captureLongitude,
    accuracy: captureAccuracy,
  });

  const result = db.prepare(`
    INSERT INTO complaints (
      title,
      description,
      location,
      category,
      citizen_id,
      image_url,
      captured_at,
      capture_latitude,
      capture_longitude,
      capture_accuracy,
      risk_score,
      risk_level,
      risk_reason,
      moderation_status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    description,
    location,
    category,
    req.user.id,
    imageUrl,
    capturedAt,
    captureLatitude,
    captureLongitude,
    captureAccuracy,
    moderation.riskScore,
    moderation.riskLevel,
    moderation.riskReason,
    moderation.moderationStatus
  );
  
  res.status(201).json({
    id: result.lastInsertRowid,
    category,
    moderation,
  });
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
