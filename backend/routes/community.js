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
    const { name, instructions, author = 'Anonymous', example } = req.body;
    
    if (!name || !instructions) {
      return res.status(400).json({
        success: false,
        error: 'Name and instructions are required',
      });
    }

    // Auto-approve scripts for now (no moderation)
    const result = await pool.query(
      `INSERT INTO community_scripts (name, instructions, author, status)
       VALUES (?, ?, ?, 'approved')`,
      [name, instructions, author]
    );

    // Get the created script
    const scriptId = result.rows[0].id;
    const createdScript = await pool.query(
      `SELECT id, name, instructions, author, votes, created_at, status
       FROM community_scripts WHERE id = ?`,
      [scriptId]
    );

    console.log('✅ Community script created:', createdScript.rows[0]);

    res.status(201).json({
      success: true,
      message: "Your community script has been created and is now live!",
      script: createdScript.rows[0],
      scriptId: scriptId
    });
  } catch (error) {
    console.error('❌ Error creating script:', error);
    res.status(500).json({ success: false, error: 'Failed to create script' });
  }
});

// Get script count (for checking unlock status)
router.get('/scripts/count', requireDB, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT COUNT(*) as count FROM community_scripts`
    );
    
    const count = result.rows[0].count;
    console.log(`📊 Community script count: ${count}`);
    
    res.json({ 
      success: true, 
      count: parseInt(count),
      unlocked: count >= 50
    });
  } catch (error) {
    console.error('❌ Error getting script count:', error);
    res.status(500).json({ success: false, error: 'Failed to get script count' });
  }
});

// Submit contribution (for locked community)
router.post('/contribute', requireDB, async (req, res) => {
  try {
    const { name, scriptName, instructions, example } = req.body;
    
    if (!name || !scriptName || !instructions) {
      return res.status(400).json({
        success: false,
        error: 'Name, script name, and instructions are required',
      });
    }

    // Store as pending contribution
    const result = await pool.query(
      `INSERT INTO community_scripts (name, instructions, author, status)
       VALUES (?, ?, ?, 'pending')`,
      [scriptName, instructions, name]
    );

    // Get new count
    const countResult = await pool.query(
      `SELECT COUNT(*) as count FROM community_scripts`
    );
    
    const newCount = parseInt(countResult.rows[0].count);
    const unlocked = newCount >= 50;
    
    console.log(`✅ Contribution added by ${name}: "${scriptName}" (${newCount}/50)`);
    
    // If we just hit 50, auto-approve all pending scripts
    if (unlocked && newCount === 50) {
      await pool.query(
        `UPDATE community_scripts SET status = 'approved' WHERE status = 'pending'`
      );
      console.log('🎉 Community unlocked! All scripts approved.');
    }

    res.status(201).json({
      success: true,
      message: unlocked ? "Community unlocked! Your script is now live!" : "Thank you for your contribution!",
      newCount: newCount,
      unlocked: unlocked,
      contributionId: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Error adding contribution:', error);
    res.status(500).json({ success: false, error: 'Failed to add contribution' });
  }
});

// Get all approved scripts
router.get('/scripts', requireDB, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, instructions, author, votes, created_at, status
       FROM community_scripts WHERE status = 'approved' ORDER BY created_at DESC`
    );
    
    console.log(`📚 Fetched ${result.rows.length} community scripts`);
    
    res.json({ 
      success: true, 
      scripts: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching scripts:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch scripts' });
  }
});

// Vote on script
router.post('/scripts/:id/vote', requireDB, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { direction = 'up', voter = 'Anonymous' } = req.body;
    
    if (Number.isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid script ID' 
      });
    }

    // For now, just increment/decrement votes (no duplicate vote checking)
    const voteChange = direction === 'up' ? 1 : -1;
    
    const result = await pool.query(
      `UPDATE community_scripts SET votes = votes + ? WHERE id = ?`,
      [voteChange, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Script not found' 
      });
    }

    // Get updated vote count
    const updatedScript = await pool.query(
      `SELECT votes FROM community_scripts WHERE id = ?`,
      [id]
    );

    const newVotes = updatedScript.rows[0].votes;
    
    console.log(`🗳️ Script ${id} voted ${direction}, new total: ${newVotes}`);

    res.json({ 
      success: true, 
      votes: newVotes,
      direction: direction
    });
  } catch (error) {
    console.error('❌ Error voting:', error);
    res.status(500).json({ success: false, error: 'Failed to record vote' });
  }
});

// Get script by ID
router.get('/scripts/:id', requireDB, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    
    if (Number.isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid script ID' 
      });
    }

    const result = await pool.query(
      `SELECT id, name, instructions, author, votes, created_at, status
       FROM community_scripts WHERE id = ? AND status = 'approved'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Script not found' 
      });
    }

    res.json({ 
      success: true, 
      script: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error fetching script:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch script' });
  }
});

export default router;
