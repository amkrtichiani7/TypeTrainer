const texts = [
      "The quick brown fox jumps over the lazy dog.",
      "Typing practice helps improve your speed and accuracy.",
      "Consistency is the key to mastering any skill.",
      "Always challenge yourself to type better and faster."
    ];
    const text = texts[Math.floor(Math.random() * texts.length)];
    const display = document.getElementById("display-text");
    const input = document.getElementById("user-input");
    const stats = document.getElementById("stats");
    const popup = document.getElementById("popup");
    const result = document.getElementById("result");

    let startTime;
    let gameEnded = false;
    let timerInterval;
    let allowedIndex = 0;
    let timeLimit = 60;

    function updateDisplay() {
      display.innerHTML = "";
      const typed = input.value;
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.textContent = text[i];
        if (i < typed.length) {
          span.className = typed[i] === text[i] ? "correct" : "incorrect";
        }
        display.appendChild(span);
      }
    }

    function calculateStats() {
      const typed = input.value;
      const correctChars = typed.split('').filter((char, i) => char === text[i]).length;
      const errors = typed.length - correctChars;
      const accuracy = Math.round((correctChars / typed.length) * 100) || 0;
      const wpm = Math.round((typed.length / 5) / ((Date.now() - startTime) / 60000));
      return { errors, accuracy, wpm };
    }

    function showPopup() {
      const { errors, accuracy, wpm } = calculateStats();
      result.innerHTML = `✅ <b>WPM:</b> ${wpm} <br>❌ <b>Errors:</b> ${errors} <br>🎯 <b>Accuracy:</b> ${accuracy}%`;
      popup.style.display = "block";
    }

    function endGame() {
      if (gameEnded) return;
      gameEnded = true;
      clearInterval(timerInterval);
      input.disabled = true;
      showPopup();
    }

    input.addEventListener("keydown", (e) => {
      if (!startTime) {
        startTime = Date.now();
        timerInterval = setInterval(() => {
          const remaining = timeLimit - Math.floor((Date.now() - startTime) / 1000);
          stats.textContent = `⏱ Time left: ${remaining}s`;
          if (remaining <= 0) endGame();
        }, 1000);
      }

      const value = input.value;

      // Prevent editing previous words
      if (e.key === "Backspace" && value.lastIndexOf(" ") < allowedIndex - 1) {
        e.preventDefault();
      }

      // Update allowedIndex on space
      if (e.key === " " && value.length >= allowedIndex) {
        allowedIndex = value.length + 1;
      }

      // End game if all text has been typed
      if (value.length >= text.length && !gameEnded) {
        endGame();
      }
    });

    input.addEventListener("input", updateDisplay);

    display.textContent = text;