// backend/routes/records.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const dbPath = path.join(__dirname, '../data/db.json');

function getTopByMode(history, mode, key, limit = 10) {
  return history
    .filter(g => g.mode === mode && g.stats[key] !== undefined)
    .sort((a, b) => b.stats[key] - a.stats[key])
    .slice(0, limit)
    .map(entry => ({
      username: entry.username,
      ...entry.stats,
      datetime: entry.datetime
    }));
}

router.get('/', (req, res) => {
  try {
    const db = JSON.parse(fs.readFileSync(dbPath));
    const history = db.gameHistory || [];

    const textPracticeTop = getTopByMode(history, 'text-practice', 'wpm');
    const wordsModeTop = getTopByMode(history, 'Words-mode', 'score');
    const visualKeyTop = getTopByMode(history, 'Visual-key', 'kscore');

    res.json({
      'text-practice': textPracticeTop,
      'Words-mode': wordsModeTop,
      'Visual-key': visualKeyTop
    });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при чтении базы данных' });
  }
});

module.exports = router;