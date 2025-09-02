const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

// Чтение базы
function readDB() {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Запись в базу
function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function registerUser(username, password) {
  const db = readDB();
  const exists = db.users.find(user => user.username === username);
  if (exists) {
    return { success: false, message: 'Пользователь уже существует' };
  }

  db.users.push({ username, password });
  writeDB(db);
  return { success: true, message: 'Регистрация прошла успешно' };
}

function loginUser(username, password) {
  const db = readDB();
  const user = db.users.find(user => user.username === username && user.password === password);
  if (!user) {
    return { success: false, message: 'Неверные данные' };
  }

  return { success: true, message: 'Вход выполнен успешно' };
}

module.exports = {
  registerUser,
  loginUser
};