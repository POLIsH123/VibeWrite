import { pool } from './connection.js';

async function check() {
    try {
        const result = await pool.query('SELECT COUNT(*) as count FROM community_scripts');
        console.log(`📊 Current Community Script Count: ${result.rows[0].count}`);

        if (result.rows[0].count > 0) {
            const scripts = await pool.query('SELECT name FROM community_scripts LIMIT 5');
            console.log('📝 Sample Script Names:');
            scripts.rows.forEach(s => console.log(` - ${s.name}`));
        }
    } catch (err) {
        console.error('❌ Check failed:', err.message);
    }
}

check().then(() => process.exit(0));
