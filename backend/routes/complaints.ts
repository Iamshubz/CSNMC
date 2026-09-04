import express from "express";
import multer from "multer";
import db from "../db/database";
import { authenticateToken } from "../middleware/auth";
import {
  calculateDistanceInMeters,
  DUPLICATE_RADIUS_METERS,
  getBoundingBox,
} from "../utils/geoUtils";

const router = express.Router();
const proofUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

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

type ActiveComplaintLocation = {
  id: number;
  capture_latitude: number;
  capture_longitude: number;
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

    const ageMs = Number.isNaN(capturedTime)
      ? Number.POSITIVE_INFINITY
      : Date.now() - capturedTime;

    if (ageMs > 5 * 60 * 1000) {
      score += 20;
      reasons.push("Capture timestamp looks stale");
    }
  }

  if (payload.latitude === null || payload.longitude === null) {
    score += 20;
    reasons.push("GPS location is missing");
  }

  if (
    payload.accuracy !== null &&
    payload.accuracy !== undefined &&
    payload.accuracy > 150
  ) {
    score += 10;
    reasons.push("GPS accuracy is low");
  }

  if (payload.imageUrl.length < 6000) {
    score += 10;
    reasons.push("Image payload is unusually small");
  }

  const riskLevel =
    score >= 70 ? "HIGH" : score >= 35 ? "MEDIUM" : "LOW";

  const moderationStatus =
    score >= 35 ? "REVIEW_REQUIRED" : "AUTO_APPROVED";

  return {
    riskScore: Math.min(score, 100),
    riskLevel,
    moderationStatus,
    riskReason:
      reasons.length > 0
        ? reasons.join("; ")
        : "Live capture looks consistent",
  };
};

const categorizeWithGroq = async (
  title: string,
  description: string
) => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
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
      }
    );

    if (!response.ok) {
      throw new Error(
        `Groq request failed with status ${response.status}`
      );
    }

    const data = await response.json();

    const category =
      data?.choices?.[0]?.message?.content?.trim();

    return category || null;
  } catch (error) {
    console.warn(
      "Groq categorization unavailable, skipping categorization",
      error
    );

    return null;
  }
};

// GET complaints
router.get("/", authenticateToken, async (req: any, res) => {
  try {
    let result;

    if (req.user.role === "ADMIN") {
      result = await db.query(`
        SELECT
          c.*,
          u.name AS citizen_name,
          w.name AS worker_name
        FROM complaints c
        JOIN users u ON c.citizen_id = u.id
        LEFT JOIN users w ON c.worker_id = w.id
        ORDER BY c.created_at DESC
      `);
    } else if (req.user.role === "WORKER") {
      result = await db.query(
        `
        SELECT *
        FROM complaints
        WHERE worker_id = $1
        ORDER BY created_at DESC
        `,
        [req.user.id]
      );
    } else {
      result = await db.query(
        `
        SELECT *
        FROM complaints
        WHERE citizen_id = $1
        ORDER BY created_at DESC
        `,
        [req.user.id]
      );
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Get complaints error:", error);

    res.status(500).json({
      error: "Failed to fetch complaints",
    });
  }
});

// CREATE complaint
router.post("/", authenticateToken, async (req: any, res) => {
  try {
    const payload = req.body as ComplaintPayload;

    const title = payload.title?.trim();
    const description = payload.description?.trim();
    const location = payload.location?.trim();
    const imageUrl = payload.image_url?.trim();
    const capturedAt = payload.captured_at?.trim();

    const captureLatitude = toNumber(
      payload.capture_latitude
    );

    const captureLongitude = toNumber(
      payload.capture_longitude
    );

    const captureAccuracy = toNumber(
      payload.capture_accuracy
    );

    if (!title || !description || !location) {
      return res.status(400).json({
        error: "Title, description, and location are required",
      });
    }

    if (!imageUrl || !imageUrl.startsWith("data:image/")) {
      return res.status(400).json({
        error: "A live camera image is required",
      });
    }

    if (!capturedAt) {
      return res.status(400).json({
        error: "Capture timestamp is required",
      });
    }

    if (captureLatitude !== null && captureLongitude !== null) {
      const boundingBox = getBoundingBox(
        captureLatitude,
        captureLongitude,
        DUPLICATE_RADIUS_METERS
      );

      const activeComplaints = await db.query<ActiveComplaintLocation>(
        `
        SELECT id, capture_latitude, capture_longitude
        FROM complaints
        WHERE status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS')
          AND capture_latitude BETWEEN $1 AND $2
          AND capture_longitude BETWEEN $3 AND $4
        ORDER BY created_at ASC
        `,
        [
          boundingBox.minLatitude,
          boundingBox.maxLatitude,
          boundingBox.minLongitude,
          boundingBox.maxLongitude,
        ]
      );

      const primaryComplaint = activeComplaints.rows.find(
        (complaint) =>
          calculateDistanceInMeters(
            captureLatitude,
            captureLongitude,
            complaint.capture_latitude,
            complaint.capture_longitude
          ) <= DUPLICATE_RADIUS_METERS
      );

      if (primaryComplaint) {
        await db.query(
          `
          UPDATE complaints
          SET duplicate_count = duplicate_count + 1
          WHERE id = $1
            AND status IN ('PENDING', 'ASSIGNED', 'IN_PROGRESS')
          `,
          [primaryComplaint.id]
        );

        return res.status(200).json({
          success: true,
          isDuplicate: true,
          message:
            "A complaint for this location has already been reported by another citizen and is currently being addressed. We have recorded your report to increase its priority!",
        });
      }
    }

    let category = "General";

    const groqCategory = await categorizeWithGroq(
      title,
      description
    );

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

    const result = await db.query(
      `
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
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14
      )
      RETURNING id
      `,
      [
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
        moderation.moderationStatus,
      ]
    );

    res.status(201).json({
      id: result.rows[0].id,
      category,
      moderation,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    res.status(500).json({
      error: "Failed to create complaint",
    });
  }
});

// UPDATE complaint
router.patch("/:id/status", authenticateToken, async (req: any, res) => {
  try {
    if (req.user.role !== "WORKER" || req.body.status !== "IN_PROGRESS") {
      return res.sendStatus(403);
    }

    const result = await db.query(
      `
      UPDATE complaints
      SET status = 'IN_PROGRESS'
      WHERE id = $1
        AND worker_id = $2
        AND status = 'ASSIGNED'
      RETURNING id
      `,
      [req.params.id, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Assigned complaint not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Start complaint error:", error);
    res.status(500).json({ error: "Failed to start complaint" });
  }
});

router.post(
  "/:id/resolve",
  authenticateToken,
  proofUpload.single("image"),
  async (req: any, res) => {
    try {
      if (req.user.role !== "WORKER") {
        return res.sendStatus(403);
      }

      const latitude = toNumber(req.body.latitude);
      const longitude = toNumber(req.body.longitude);
      const proofImage = req.file;

      if (!proofImage || latitude === null || longitude === null) {
        return res.status(400).json({
          success: false,
          message: "A proof image and GPS coordinates are required.",
        });
      }

      const complaintResult = await db.query(
        `
        SELECT id, worker_id, status, capture_latitude, capture_longitude
        FROM complaints
        WHERE id = $1
        `,
        [req.params.id]
      );
      const complaint = complaintResult.rows[0];

      if (!complaint || complaint.worker_id !== req.user.id) {
        return res.status(404).json({ success: false, message: "Complaint not found" });
      }

      if (complaint.status !== "IN_PROGRESS") {
        return res.status(400).json({
          success: false,
          message: "Complaint must be in progress before proof can be submitted.",
        });
      }

      if (complaint.capture_latitude === null || complaint.capture_longitude === null) {
        return res.status(400).json({
          success: false,
          message: "Location mismatch: The reported site has no GPS coordinates.",
        });
      }

      const distance = calculateDistanceInMeters(
        latitude,
        longitude,
        complaint.capture_latitude,
        complaint.capture_longitude
      );

      if (distance > 100) {
        return res.status(400).json({
          success: false,
          message: "Location mismatch: You must be at the reported site (within 100m) to submit proof.",
        });
      }

      const proofImageUrl = `data:${proofImage.mimetype};base64,${proofImage.buffer.toString("base64")}`;
      await db.query(
        `
        UPDATE complaints
        SET proof_image_url = $1,
            status = 'RESOLVED',
            completed_at = CURRENT_TIMESTAMP
        WHERE id = $2
          AND worker_id = $3
        `,
        [proofImageUrl, req.params.id, req.user.id]
      );

      res.status(200).json({ success: true, message: "Task resolved successfully" });
    } catch (error) {
      console.error("Resolve complaint error:", error);
      res.status(500).json({ success: false, message: "Failed to resolve complaint" });
    }
  }
);

router.put("/:id", authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { status, worker_id, proof_image_url } = req.body;

    if (req.user.role === "ADMIN") {
      await db.query(
        `
        UPDATE complaints
        SET status = $1,
            worker_id = $2
        WHERE id = $3
        `,
        [status, worker_id, id]
      );
    } else if (req.user.role === "WORKER") {
      if (status !== "IN_PROGRESS") {
        return res.status(403).json({
          error: "Workers must submit camera proof to resolve a complaint",
        });
      }

      await db.query(
        `
        UPDATE complaints
        SET status = $1,
            proof_image_url = $2
        WHERE id = $3
          AND worker_id = $4
        `,
        [status, proof_image_url, id, req.user.id]
      );
    } else {
      return res.sendStatus(403);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      error: "Failed to update complaint",
    });
  }
});

export default router;