// ===========================
// Database Connection - SQLite Edition (Vercel Compatible)
// ===========================
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;
let dbConnected = false;

const connectDB = async () => {
  try {
    // For Vercel, use /tmp directory for SQLite database
    const isProduction = process.env.NODE_ENV === 'production';
    const dbPath = isProduction 
      ? join(tmpdir(), 'vibewrite.db')
      : join(__dirname, '..', 'vibewrite.db');
    
    console.log('📁 Database path:', dbPath);
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });
    
    // Create tables if they don't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS community_scripts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        instructions TEXT NOT NULL,
        author TEXT DEFAULT 'Anonymous',
        votes INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        example TEXT
      )
    `);
    
    // Create users table for future features
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE,
        is_pro BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create contributions tracking table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contributions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        contributor_name TEXT NOT NULL,
        script_name TEXT NOT NULL,
        instructions TEXT NOT NULL,
        example TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'pending'
      )
    `);
    
    dbConnected = true;
    console.log('✅ SQLite database connected and tables created');
    
    // In production, warn about temporary storage
    if (isProduction) {
      console.log('⚠️  Production mode: Database is stored in temporary directory');
      console.log('   Data will be lost on serverless function restarts');
      console.log('   Consider upgrading to a persistent database for production');
    }
    
  } catch (error) {
    console.error('⚠️  SQLite connection failed:', error.message);
    console.log('   Community features will be disabled. Main app still works!');
    db = null;
    dbConnected = false;
  }
};

// Ensure database connection for serverless functions
const ensureConnection = async () => {
  if (!db || !dbConnected) {
    await connectDB();
  }
  return db;
};

// Get database instance (replaces pool)
const pool = {
  query: async (sql, params = []) => {
    const database = await ensureConnection();
    if (!database) throw new Error('Database not connected');
    
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return { rows: await database.all(sql, params) };
    } else {
      const result = await database.run(sql, params);
      return { 
        rows: [{ id: result.lastID }],
        rowCount: result.changes 
      };
    }
  }
};

export { pool, dbConnected };
export default connectDB;
