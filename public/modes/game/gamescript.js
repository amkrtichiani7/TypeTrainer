// Расширенный список слов
const words = [
  "hi", "go", "up", "do", "an", "it",
  "dog", "cat", "sun", "sky", "hat", "pen",
  "home", "ball", "code", "lamp", "fork", "milk",
  "apple", "chair", "table", "grape", "plant", "mouse",
  "banana", "monkey", "rocket", "school", "window", "pencil",
  "speaker", "glasses", "picture", "battery", "holiday", "machine",
  "elephant", "mountain", "umbrella", "treasure", "hospital",
  "developer", "algorithm", "education", "technology", "framework"
];

words.sort((a, b) => a.length - b.length);
const lengthIndexMap = new Map();
for (let i = 0; i < words.length; i++) {
  const len = words[i].length;
  if (!lengthIndexMap.has(len)) {
    lengthIndexMap.set(len, { start: i, end: i });
  } else {
    lengthIndexMap.get(len).end = i;
  }
}

let currentWord = "";
let score = 0;
let wave = 1;
let wordTimer = null;
let timeLimit = 5000;
let wordsThisWave = 0;
let wordsRequired = 5;
let inARow = 0;
let lastBonusLevel = 1;
let gameTime = 10; // 3 минуты в секундах
let gameDuration = 10 * 1000; // 3 минуты
let gameTimeout;
let gameInterval;

const wordElement = document.getElementById("word");
const input = document.getElementById("input");
const scoreElement = document.getElementById("score");
const waveElement = document.getElementById("wave");
const waveSound = new Audio('sounds/next-wave.mp3');
const timerBar = document.getElementById("timer-bar");
const progressBar = document.getElementById("progress-bar");
const bonusIndicator = document.getElementById("bonus-indicator");
const failSound = new Audio('sounds/fail.mp3');
const succesSound = new Audio('sounds/succes.mp3');
const flash = document.getElementById("flash");
const gameTimerDisplay = document.getElementById("game-timer");

function startGameTimer() {
  // Сначала очищаем старый интервал, если он есть
  clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    gameTime--;
    const minutes = Math.floor(gameTime / 60);
    const seconds = gameTime % 60;
    gameTimerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    if (gameTime <= 0) {
      clearInterval(gameInterval);
      clearTimeout(gameTimeout);
      endGame();
    }
  }, 1000);
}
function getRandomWord() {
  const { minLen, maxLen } = getLengthRangeByWave(wave);
  const targetLengths = Array.from(lengthIndexMap.keys()).filter(len => len >= minLen && len <= maxLen);
  if (targetLengths.length === 0) return "default";
  const randomLen = targetLengths[Math.floor(Math.random() * targetLengths.length)];
  const { start, end } = lengthIndexMap.get(randomLen);
  const randomIndex = Math.floor(Math.random() * (end - start + 1)) + start;
  return words[randomIndex];
}

function getLengthRangeByWave(wave) {
  const minLen = Math.min(2 + wave, 7);
  const maxLen = Math.min(5 + wave, 12);
  return { minLen, maxLen };
}

function showNewWord() {
  if (!gameTimeout) {
    gameTimeout = setTimeout(endGame, gameDuration);
  }
  currentWord = getRandomWord();
  wordElement.textContent = currentWord;
  input.value = "";
  timerBar.style.transition = "none";
  timerBar.style.width = "100%";
  void timerBar.offsetWidth;
  timerBar.style.transition = `width ${timeLimit}ms linear`;
  timerBar.style.width = "0%";
  if (wordTimer) clearTimeout(wordTimer);
  wordTimer = setTimeout(() => {
    score = Math.max(0, score - 1);
    inARow = 0;
    updateBonusIndicator();
    failSound.play();
    scoreElement.textContent = score;
    showNewWord();
  }, timeLimit);
}

input.addEventListener("input", () => {
  if (input.value === currentWord) {
    clearTimeout(wordTimer);
    inARow++;
    const bonus = getBonusMultiplier(inARow);
    score += bonus;
    updateBonusIndicator();
    wordsThisWave++;
    updateProgressBar();
    scoreElement.textContent = score;
    if (wordsThisWave >= wordsRequired) {
      nextWave();
    } else {
      showNewWord();
    }
    succesSound.play();
  }
});

function animateWaveBanner() {
  const banner = document.getElementById("wave-banner");
  banner.style.opacity = 1;
  banner.style.transform = "translate(-50%, -50%) scale(1.2)";
  typeOut(`🌊 Wave ${wave}!`, banner, 60);

  setTimeout(() => {
    banner.style.opacity = 0;
    banner.style.transform = "translate(-50%, -50%) scale(1)";
  }, 2000);
}

function updateProgressBar() {
  const percent = (wordsThisWave / wordsRequired) * 100;
  progressBar.style.width = `${Math.min(percent, 100)}%`;
}

function updateBonusIndicator() {
  const bonus = getBonusMultiplier(inARow);
  if (bonus > 1) {
    bonusIndicator.textContent = "🔥".repeat(bonus - 1) + ` x${bonus} Bonus!`;
    bonusIndicator.style.opacity = 1;
    if (bonus > lastBonusLevel) {
      triggerFlash();
      lastBonusLevel = bonus;
    }
    bonusIndicator.classList.add("bonus-pop");
    setTimeout(() => bonusIndicator.classList.remove("bonus-pop"), 200);
  } else {
    bonusIndicator.textContent = "";
    bonusIndicator.style.opacity = 0;
    lastBonusLevel = 1;
  }
}

function getBonusMultiplier(inARow) {
  if (inARow >= 15) return 4;
  if (inARow >= 10) return 3;
  if (inARow >= 5) return 2;
  return 1;
}

function triggerFlash() {
  flash.style.opacity = "1";
  setTimeout(() => {
    flash.style.opacity = "0";
  }, 400); // Увеличенная длительность вспышки
}

function typeOut(text, element, delay = 50) {
  element.textContent = "";
  let index = 0;
  element.classList.add("typing-text");

  const typingInterval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text[index];
      index++;
    } else {
      clearInterval(typingInterval);
      element.classList.remove("typing-text");
    }
  }, delay);
}

function nextWave() {
  wave++;
  wordsThisWave = 0;
  wordsRequired += 2;
  updateProgressBar();
  waveElement.textContent = `Wave: ${wave}`;
  animateWaveBanner();
  waveSound.play();
  if (wave % 3 === 0 && timeLimit > 1000) {
    timeLimit -= 500;
  }
  showNewWord();
}

function endGame() {
  clearTimeout(wordTimer);
  input.disabled = true;
  document.getElementById("final-score").textContent = score;
  document.getElementById("final-wave").textContent = wave;
  document.getElementById("end-screen").classList.remove("hidden");
}

function restartGame() {
  // Сброс значений
  score = 0;
  wave = 1;
  timeLimit = 5000;
  wordsThisWave = 0;
  wordsRequired = 5;
  inARow = 0;
  lastBonusLevel = 1;
  gameTime = 10; // или 180 для 3 минут

  clearTimeout(wordTimer);
  clearTimeout(gameTimeout);
  clearInterval(gameInterval); // 🧠 убиваем предыдущий таймер

  // Запускаем новый интервал
  startGameTimer();

  gameTimeout = setTimeout(endGame, gameDuration);

  input.disabled = false;
  input.value = "";
  input.focus();
  scoreElement.textContent = score;
  waveElement.textContent = `Wave: ${wave}`;
  bonusIndicator.textContent = "";
  bonusIndicator.style.opacity = 0;
  progressBar.style.width = "0%";
  document.getElementById("end-screen").classList.add("hidden");

  showNewWord();
}


function goToMain() {
  window.location.href = "../../index.html"; // или другой адрес вашей главной страницы
}

showNewWord();
startGameTimer();