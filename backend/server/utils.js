const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

function readDB() {
  const raw = fs.readFileSync(dbPath);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = { readDB, writeDB };