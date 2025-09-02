const express = require('express');
const router = express.Router();

const { readDB, writeDB } = require('../server/utils');
// GET /api/stats?username=...
router.get('/', (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  const db = readDB();
  const stats = db.userStats?.[username];
  
  if (!stats) {
    return res.status(404).json({ error: 'Stats not found for user' });
  }

  res.status(200).json(stats);
});

// POST /api/stats/update
router.post('/update', (req, res) => {
  const { username, typedCharacters } = req.body;
  
  const typed = Number(typedCharacters);
  if (!username || !Number.isInteger(typed)) {
    return res.status(400).json({ error: 'Missing or invalid fields' });
  }

  const db = readDB();
  db.userStats = db.userStats || {};
  db.userStats[username] = db.userStats[username] || { totalTypedCharacters: 0 };

  db.userStats[username].totalTypedCharacters += typedCharacters;
  db.userStats[username].lastActive = new Date().toISOString();

  writeDB(db);

  res.status(200).json({ message: 'Stats updated' });
});

module.exports = router;