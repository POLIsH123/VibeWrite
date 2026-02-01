import pg from 'pg';

const { Pool } = pg;

let pool = null;
let dbConnected = false;

const connectDB = async () => {
  // Skip if no DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not set - Community features disabled');
    return;
  }

  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    const client = await pool.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS community_scripts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        instructions TEXT NOT NULL,
        author VARCHAR(255) DEFAULT 'Anonymous',
        votes INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
      )
    `);
    client.release();
    dbConnected = true;
    console.log('✅ PostgreSQL connected');
  } catch (error) {
    console.error('⚠️  PostgreSQL connection failed:', error.message);
    console.log('   Community features will be disabled. Main app still works!');
    pool = null;
    dbConnected = false;
    // Don't exit - let the main app continue working
  }
};

export { pool, dbConnected };
export default connectDB;
