# 🏠 Casa - Household Task Management

**Casa** is a modern, gamified web application designed to streamline household chores and family collaboration. By turning daily tasks into a rewarding experience, it helps families stay organized and motivated.

---

## ✨ Key Features

-   **🎯 Task Gamification**: Earn points based on task difficulty and speed.
-   **🎡 Task Roulette**: Randomly assign tasks to family members for a fun, fair distribution of work.
-   **📊 Real-time Dashboard**: Track progress, see the family leaderboard, and analyze performance with interactive charts.
-   **🌓 Dark/Light Mode**: Premium design with full support for both light and dark themes.
-   **💾 Persistence**: Seamless synchronization across devices using Firebase Firestore.
-   **🕒 Smart Points**: Points are dynamically calculated. Finish tasks early for a bonus, or take too long and see a small penalty!

## 🛠️ Tech Stack

-   **Frontend**: React (Hooks, Context)
-   **Build Tool**: Vite
-   **Styling**: Vanilla CSS with HSL variables and Glassmorphism.
-   **Icons**: Lucide React
-   **Charts**: Recharts
-   **Backend**: Firebase Firestore (Real-time updates)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+)
-   A Firebase project

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/MoraGamer20/casa.git
    cd casa
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Firebase Configuration**:
    Create a `.env` file or update `src/firebase.js` with your project's credentials.

4.  **Run locally**:
    ```bash
    npm run dev
    ```

## 📈 Point System Logic

The system rewards efficiency:
-   **Base Points**: Each task has a difficulty rating (points).
-   **Bonus**: If completed within the estimated time, you earn **1.5x points**.
-   **Penalty**: If completed late, points are reduced for every extra hour elapsed.

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

*Made with ❤️ by **Kevin Alejandro Morado Ortega (MoraGamer20)** for more organized homes.*
