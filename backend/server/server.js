const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { registerUser, loginUser } = require('../routes/auth');
const historyRoutes = require('../routes/history');
const statsRoutes = require('../routes/stats')
const recordRoutes = require('../routes/records')

const app = express();
const PORT = 3000;

// Путь к базе данных
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'public')));
app.use('/api/history', historyRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/records', recordRoutes);

// Регистрация
app.post('/api/auth/register', (req, res) => {
  const { username, password } = req.body;
  const result = registerUser(username, password);
  res.status(result.success ? 200 : 400).json(result);
});

// Вход
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const result = loginUser(username, password);
  res.status(result.success ? 200 : 401).json(result);
});

// Получить таблицу рекордов
app.get('/api/records', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath));
  res.json(db.records || []);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Добавить новый рекорд
app.post('/api/records', (req, res) => {
  const { username, mode, wpm, accuracy } = req.body;

  if (!username || !mode || wpm == null || accuracy == null) {
    return res.status(400).json({ message: 'Неполные данные' });
  }

  const db = JSON.parse(fs.readFileSync(dbPath));
  db.records.push({ username, mode, wpm, accuracy });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  res.status(201).json({ message: 'Результат сохранён' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});