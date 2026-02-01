// ===========================
// Database Connection - SQLite Edition
// ===========================
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db = null;
let dbConnected = false;

const connectDB = async () => {
  try {
    // Create/connect to SQLite database
    const dbPath = join(__dirname, '..', 'vibewrite.db');
    console.log('📁 Database path:', dbPath);
    
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
    
  } catch (error) {
    console.error('⚠️  SQLite connection failed:', error.message);
    console.log('   Community features will be disabled. Main app still works!');
    db = null;
    dbConnected = false;
  }
};

// Get database instance (replaces pool)
const pool = {
  query: async (sql, params = []) => {
    if (!db) throw new Error('Database not connected');
    
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return { rows: await db.all(sql, params) };
    } else {
      const result = await db.run(sql, params);
      return { 
        rows: [{ id: result.lastID }],
        rowCount: result.changes 
      };
    }
  }
};

export { pool, dbConnected };
export default connectDB;
