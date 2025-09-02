# TypeTrainer ⌨️

**TypeTrainer** is a web application for practicing typing speed and accuracy.  
The project includes several modes: word typing, text practice, Keyboard-game and a leaderboard.

---

## 🚀 Features
- 🎮 **Game mode** — type random words with increasing difficulty.  
- ✍️ **Text Practice** — type full texts with error highlighting.
- ⌨️ **Keyboard-game** — Learn to find any key blindly.  
- 🏆 **Leaderboard** — save and view the best results.  
- 👤 **User Profile** — track your personal stats and achievements.  
- 🔐 **Authentication** — register and log in (data stored in JSON).  

---

## 🛠️ Technologies
- **Frontend:** HTML, CSS (TailwindCSS), JavaScript  
- **Backend:** Node.js, Express  
- **Data storage:** JSON (no database)  

---

## 📂 Project Structure
backend/ # Backend part
├── routes/ # Routes (auth, history, records, stats)
├── data/ # db.json
└── server/ # Server entry point

frontend/ # Frontend part
├── index.html
├── profile.html
└── > modes

---

## ⚡ How to Run
1. Clone the repository:
   ```bash
   git clone https://github.com/amkrtichiani7/TypeTrainer.git
2. Install dependencies:
   ```bash
   cd backend
   npm install
3. Start the server:
   ```bash
   node backend/server/server.js
4. Open http://localhost:3000 in your browser.

## 📸 Screenshots
![alt text](image.png)
![alt text](image-1.png)
![alt text](image-2.png)
![alt text](image-3.png)
![alt text](image-4.png)
![alt text](image-5.png)
![alt text](image-6.png)
![alt text](image-7.png)

## 👨‍💻 Author

Aleks Mkrtichiani