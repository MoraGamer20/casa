# 🏠 Casa: Advanced Household Gamification System

**Casa** is a high-fidelity, gamified task management platform engineered to optimize household productivity through interactive mechanics and real-time data synchronization. It transforms mundane domestic chores into a collaborative, competitive, and rewarding experience for family environments.

---

## 🌟 Strategic Features

### 🎮 Dynamic Gamification Engine
- **Algorithmic Scoring**: Points are calculated based on task complexity (Difficulty Rating) and completion efficiency.
- **Efficiency Bonuses**: Strategic 1.5x multipliers for tasks completed within the estimated timeframe.
- **Time-Based Decay**: Adaptive point reduction for overdue tasks to encourage consistent productivity.

### 🎡 Automated Distribution (Roulette)
- **Fair Allocation Algorithm**: A randomized assignment system that ensures equitable distribution of domestic responsibilities among active members.
- **Batch Processing**: Simultaneous multi-task assignment with instant database persistence.

### 📊 Performance Analytics
- **Live Leaderboard**: Real-time visualization of family performance and point standings.
- **Interactive Data Visualization**: Integrated charting systems (Recharts) for historical performance analysis.
- **Detailed Breakdowns**: Granular insight into individual contributions and task completion history.

### 🎨 Premium User Experience
- **Responsive Architecture**: Seamless operation across desktop, tablet, and mobile devices.
- **Adaptive Aesthetics**: Full-spectrum Dark and Light mode support with a modern Glassmorphism UI.
- **Micro-interactions**: Fluid animations and feedback mechanisms (Confetti, Transitions) to enhance user engagement.

---

## 🛠 Technical Architecture

| Layer | Technology | Implementation |
| :--- | :--- | :--- |
| **Frontend** | React 19 | Component-driven architecture with Functional Hooks. |
| **State Management** | Custom Hooks | Optimized data fetching and state synchronization. |
| **Database** | Firebase Firestore | Real-time NoSQL persistence for multi-device sync. |
| **Styling** | Vanilla CSS | Custom design system using HSL color tokens and CSS Variables. |
| **Visualization** | Recharts | SVG-based responsive data representation. |
| **Icons** | Lucide React | Consistent, scalable vector iconography. |

---

## 📂 Project Structure

```text
src/
├── assets/             # Static visual resources
├── components/         # Atomic and Molecular UI components
│   ├── Dashboard/      # Analytics and Leaderboard
│   ├── Roulette/       # Task distribution engine
│   └── TaskCard/       # Individual task representation
├── hooks/              # Business logic and Firebase integration
├── firebase.js         # Backend infrastructure configuration
└── App.jsx             # Application core orchestrator
```

---

## 🚀 Deployment & Installation

### Prerequisites
- **Node.js**: Environment version 18.0.0 or higher.
- **Firebase**: A configured Firestore project instance.

### Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/MoraGamer20/casa.git
   cd casa
   ```

2. **Dependency Installation**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Ensure `src/firebase.js` reflects your unique project credentials to establish a secure backend connection.

4. **Development Execution**
   ```bash
   npm run dev
   ```

---

## 📄 License & Attribution

This project is designed for private domestic use and educational demonstration.

**Author:** [Kevin Alejandro Morado Ortega](https://github.com/MoraGamer20)
**Project Title:** Casa - Household Management v1.0.0

---

*Transforming household dynamics through technology and engagement.*
