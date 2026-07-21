import path from "path";
import Database from "better-sqlite3";

const dbPath = path.resolve(__dirname, "../../waste_management.db");
const db = new Database(dbPath);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT,
    status TEXT DEFAULT 'PENDING',
    citizen_id INTEGER NOT NULL,
    worker_id INTEGER,
    image_url TEXT,
    proof_image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES users(id),
    FOREIGN KEY (worker_id) REFERENCES users(id)
  );
`);

const complaintColumns = db.prepare("PRAGMA table_info(complaints)").all() as Array<{ name: string }>;
const complaintColumnNames = new Set(complaintColumns.map((column) => column.name));

const ensureComplaintColumn = (name: string, definition: string) => {
  if (!complaintColumnNames.has(name)) {
    db.prepare(`ALTER TABLE complaints ADD COLUMN ${definition}`).run();
    complaintColumnNames.add(name);
  }
};

ensureComplaintColumn("captured_at", "captured_at TEXT");
ensureComplaintColumn("capture_latitude", "capture_latitude REAL");
ensureComplaintColumn("capture_longitude", "capture_longitude REAL");
ensureComplaintColumn("capture_accuracy", "capture_accuracy REAL");
ensureComplaintColumn("risk_score", "risk_score INTEGER DEFAULT 0");
ensureComplaintColumn("risk_level", "risk_level TEXT DEFAULT 'LOW'");
ensureComplaintColumn("risk_reason", "risk_reason TEXT");
ensureComplaintColumn("moderation_status", "moderation_status TEXT DEFAULT 'AUTO_APPROVED'");

export default db;
