import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { tmpdir } from 'os';

// Use the module's directory so the data path is consistent regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const DATA_DIR = isProduction ? tmpdir() : join(__dirname, 'data');
const USAGE_FILE = join(DATA_DIR, 'usage.json');

function ensureDataDir() {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        if (!fs.existsSync(USAGE_FILE)) fs.writeFileSync(USAGE_FILE, JSON.stringify({}), 'utf8');
    } catch (err) {
        console.error('❌ Failed to ensure data dir/file:', err.message);
        // We don't throw here to avoid crashing the whole request if usage tracking is secondary
    }
}

function load() {
    ensureDataDir();
    try {
        const raw = fs.readFileSync(USAGE_FILE, 'utf8');
        return JSON.parse(raw || '{}');
    } catch (e) {
        return {};
    }
}

function save(data) {
    ensureDataDir();
    fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function todayKey() {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD UTC-ish
}

/**
 * Increment usage for a key (IP or userId) and check limit
 * @param {string} key
 * @param {number} limit
 * @returns {{allowed:boolean, remaining:number, count:number}}
 */
export async function incrementAndCheck(key, limit = 7) {
    // If a DATABASE_URL is provided, prefer Postgres storage
    if (process.env.DATABASE_URL) return await awaitPgIncrement(key, limit);
    return fileIncrementAndCheck(key, limit);
}

function fileIncrementAndCheck(key, limit = 7) {
    const data = load();
    const day = todayKey();
    if (!data[key] || data[key].day !== day) {
        data[key] = { day, count: 0 };
    }
    data[key].count = (data[key].count || 0) + 1;
    save(data);
    const count = data[key].count;
    return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        count
    };
}

export async function getUsage(key) {
    if (process.env.DATABASE_URL) return await getPgUsage(key);
    const data = load();
    const day = todayKey();
    if (!data[key] || data[key].day !== day) return { count: 0, remaining: 0 };
    return { count: data[key].count };
}

// Development helpers
export async function resetUsage(key) {
    ensureDataDir();
    const data = load();
    if (!key) return false;
    delete data[key];
    save(data);
    return true;
}

export async function resetAllUsage() {
    ensureDataDir();
    save({});
    return true;
}

// --- Postgres helpers (used if DATABASE_URL is set) ---
async function awaitPgClient() {
    try {
        const { Client } = await import('pg');
        const client = new Client({ connectionString: process.env.DATABASE_URL });
        await client.connect();
        // Ensure table exists
        await client.query(`CREATE TABLE IF NOT EXISTS usage_counters (
            key TEXT NOT NULL,
            day TEXT NOT NULL,
            count INTEGER NOT NULL,
            PRIMARY KEY (key, day)
        )`);
        return client;
    } catch (err) {
        console.error('Postgres init failed, falling back to file store:', err.message);
        return null;
    }
}

async function awaitPgIncrement(key, limit) {
    const client = await awaitPgClient();
    if (!client) return fileIncrementAndCheck(key, limit);
    try {
        const day = todayKey();
        const res = await client.query('SELECT count FROM usage_counters WHERE key=$1 AND day=$2', [key, day]);
        let count = 0;
        if (res.rows.length === 0) {
            await client.query('INSERT INTO usage_counters(key, day, count) VALUES($1,$2,$3)', [key, day, 1]);
            count = 1;
        } else {
            count = res.rows[0].count + 1;
            await client.query('UPDATE usage_counters SET count=$3 WHERE key=$1 AND day=$2', [key, day, count]);
        }
        await client.end();
        return { allowed: count <= limit, remaining: Math.max(0, limit - count), count };
    } catch (err) {
        console.error('Postgres usage increment failed:', err.message);
        try { await client.end(); } catch (_) { }
        return fileIncrementAndCheck(key, limit);
    }
}

async function getPgUsage(key) {
    const client = await awaitPgClient();
    if (!client) return { count: 0, remaining: 0 };
    try {
        const day = todayKey();
        const res = await client.query('SELECT count FROM usage_counters WHERE key=$1 AND day=$2', [key, day]);
        const count = res.rows.length === 0 ? 0 : res.rows[0].count;
        await client.end();
        return { count };
    } catch (err) {
        console.error('Postgres getUsage failed:', err.message);
        try { await client.end(); } catch (_) { }
        return { count: 0 };
    }
}
