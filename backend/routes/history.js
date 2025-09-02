const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_PATH = path.join(__dirname, '../data/db.json');

function readDB() {
  const raw = fs.readFileSync(DB_PATH);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// POST /api/history
router.post('/', (req, res) => {
  const { username, mode, stats } = req.body;
  if (!mode || !stats) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = readDB();
  const historyEntry = {
    username: username || 'guest',
    mode,
    stats,
    datetime: new Date().toISOString()
  };

  db.gameHistory = db.gameHistory || [];
  db.gameHistory.push(historyEntry);
  writeDB(db);

  res.status(201).json({ message: 'History saved', historyEntry });
});

// GET /api/history?username=...
router.get('/', (req, res) => {
  const db = readDB();
  const allHistory = db.gameHistory || [];
  const { username } = req.query;

  const filtered = username
    ? allHistory.filter(entry => entry.username === username)
    : allHistory;

  res.json(filtered);
});

module.exports = router;
