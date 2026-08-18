import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  salt: string;
  passwordHash: string;
  role: "admin" | "editor" | "user";
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const TMP_USERS_FILE = path.join("/tmp", "users.json");

let inMemoryDb: DatabaseSchema | null = null;

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function getDefaultUsers(): DatabaseSchema {
  const defaultSalt = generateSalt();
  return {
    users: [
      {
        id: "u_" + crypto.randomUUID(),
        username: "admin",
        fullName: "Administrator",
        salt: defaultSalt,
        passwordHash: hashPassword("admin123", defaultSalt),
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: "u_" + crypto.randomUUID(),
        username: "editor",
        fullName: "News Editor",
        salt: defaultSalt,
        passwordHash: hashPassword("editor123", defaultSalt),
        role: "editor",
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

/**
 * Initializes the database with a default admin user if not present.
 */
export async function initDb(): Promise<DatabaseSchema> {
  if (inMemoryDb) return inMemoryDb;

  // Try /tmp file first (if running in serverless and already created)
  try {
    const tmpData = await fs.readFile(TMP_USERS_FILE, "utf-8");
    inMemoryDb = JSON.parse(tmpData) as DatabaseSchema;
    return inMemoryDb;
  } catch {}

  // Try workspace data file
  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    inMemoryDb = JSON.parse(data) as DatabaseSchema;
    return inMemoryDb;
  } catch {}

  // Seed default user
  const initialDb = getDefaultUsers();
  inMemoryDb = initialDb;

  // Try saving to workspace or /tmp
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
  } catch {
    try {
      await fs.writeFile(TMP_USERS_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    } catch {}
  }

  return initialDb;
}

export async function readDb(): Promise<DatabaseSchema> {
  if (inMemoryDb) return inMemoryDb;
  try {
    const tmpData = await fs.readFile(TMP_USERS_FILE, "utf-8");
    inMemoryDb = JSON.parse(tmpData) as DatabaseSchema;
    return inMemoryDb;
  } catch {}

  try {
    const data = await fs.readFile(USERS_FILE, "utf-8");
    inMemoryDb = JSON.parse(data) as DatabaseSchema;
    return inMemoryDb;
  } catch {
    return await initDb();
  }
}

export async function writeDb(db: DatabaseSchema): Promise<void> {
  inMemoryDb = db;
  let written = false;

  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(db, null, 2), "utf-8");
    written = true;
  } catch {}

  if (!written) {
    try {
      await fs.writeFile(TMP_USERS_FILE, JSON.stringify(db, null, 2), "utf-8");
    } catch {}
  }
}

export async function findUserByUsername(username: string): Promise<UserRecord | null> {
  const db = await readDb();
  const normalized = username.trim().toLowerCase();
  const user = db.users.find((u) => u.username.toLowerCase() === normalized);
  return user || null;
}

export async function createUser(data: {
  username: string;
  password: string;
  fullName?: string;
  role?: "admin" | "editor" | "user";
}): Promise<Omit<UserRecord, "passwordHash" | "salt">> {
  const db = await readDb();
  const normalized = data.username.trim().toLowerCase();

  if (db.users.some((u) => u.username.toLowerCase() === normalized)) {
    throw new Error("Username already exists");
  }

  const salt = generateSalt();
  const newUser: UserRecord = {
    id: "u_" + crypto.randomUUID(),
    username: normalized,
    fullName: data.fullName?.trim() || data.username.trim(),
    salt,
    passwordHash: hashPassword(data.password, salt),
    role: data.role || "editor",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  await writeDb(db);

  const { passwordHash: _, salt: __, ...safeUser } = newUser;
  return safeUser;
}

export async function verifyUserPassword(username: string, password: string): Promise<UserRecord | null> {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const inputHash = hashPassword(password, user.salt);
  if (inputHash === user.passwordHash) {
    return user;
  }
  return null;
}

export async function changeUserPassword(
  username: string,
  oldPassword: string,
  newPassword: string
): Promise<boolean> {
  const db = await readDb();
  const normalized = username.trim().toLowerCase();
  const index = db.users.findIndex((u) => u.username.toLowerCase() === normalized);

  if (index === -1) {
    throw new Error("User not found");
  }

  const user = db.users[index];
  const oldHash = hashPassword(oldPassword, user.salt);
  if (oldHash !== user.passwordHash) {
    throw new Error("Current password is incorrect");
  }

  const newSalt = generateSalt();
  db.users[index] = {
    ...user,
    salt: newSalt,
    passwordHash: hashPassword(newPassword, newSalt),
  };

  await writeDb(db);
  return true;
}

export async function getAllUsersSafe(): Promise<Array<Omit<UserRecord, "passwordHash" | "salt">>> {
  const db = await readDb();
  return db.users.map(({ passwordHash: _, salt: __, ...safe }) => safe);
}

export async function deleteUser(userId: string): Promise<boolean> {
  const db = await readDb();
  const index = db.users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error("प्रयोगकर्ता भेटिएन (User not found)");
  }
  const userToDelete = db.users[index];
  if (userToDelete.username.toLowerCase() === "admin") {
    throw new Error("मुख्य एडमिन खाता हटाउन मिल्दैन (Default admin cannot be deleted)");
  }
  db.users.splice(index, 1);
  await writeDb(db);
  return true;
}

