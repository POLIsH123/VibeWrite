import express from 'express';
import { pool, dbConnected } from '../db/connection.js';

const router = express.Router();

// Middleware to check if DB is available
const requireDB = (req, res, next) => {
  if (!dbConnected || !pool) {
    return res.status(503).json({
      success: false,
      error: 'Community features are currently unavailable (database not connected)'
    });
  }
  next();
};

// Submit new community script
router.post('/scripts', requireDB, async (req, res) => {
  try {
    const { name, instructions, author = 'Anonymous' } = req.body;
    
    if (!name || !instructions) {
      return res.status(400).json({
        success: false,
        error: 'name and instructions are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO community_scripts (name, instructions, author)
       VALUES ($1, $2, $3)
       RETURNING id, name, instructions, author, votes, created_at, status`,
      [name, instructions, author]
    );

    res.status(201).json({
      success: true,
      message: "Your community script has been submitted and is pending review!",
      script: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating script:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Get all approved scripts
router.get('/scripts', requireDB, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, instructions, author, votes, created_at, status
       FROM community_scripts WHERE status = 'approved' ORDER BY created_at DESC`
    );
    res.json({ success: true, scripts: result.rows });
  } catch (error) {
    console.error('Error fetching scripts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Vote on script
router.post('/scripts/:id/vote', requireDB, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid script id' });
    }

    const result = await pool.query(
      `UPDATE community_scripts SET votes = votes + 1 WHERE id = $1
       RETURNING id, votes`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Script not found' });
    }

    res.json({ success: true, votes: result.rows[0].votes });
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
