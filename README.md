# Sojourner 🌍
**Your Premium AI Travel Companion**

Sojourner is a sophisticated travel planning platform that combines the power of AI with real-world travel context. It doesn't just "guess" itineraries; it ranks and optimizes real options based on your personal style and budget.

---

## 🛠 Features

- **Context-Aware AI**: An assistant that knows your trip status, fatigue levels, and preferences.
- **Smart Itineraries**: Daily plans generated with precision, using INR (₹) and Indian travel patterns.
- **Reasoning Inspector**: Peek into the AI's "brain" to see why it made certain recommendations.
- **Multi-Step Wizard**: Seamlessly transition from a vague idea to a concrete plan.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **OpenAI API Key**

### 1. Backend Setup (FastAPI)
The backend handles AI reasoning, database management, and travel data simulation.

1. **Navigate to backend**:
   ```bash
   cd backend
   ```
2. **Setup Virtual Environment**:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
4. **Environment Config**:
   Create a `.env` file in the `backend` directory:
   ```env
   OPENAI_API_KEY=your_key_here
   ```
5. **Start the API**:
   ```bash
   python main.py
   ```

### 2. Frontend Setup (React + Vite)
The frontend provides a sleek, modern interface for trip planning.

1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```
2. **Install Packages**:
   ```bash
   npm install
   ```
3. **Launch Development Server**:
   ```bash
   npm run dev
   ```

---

## 🏗 Project Structure

- `/frontend`: React application built with Vite and TailwindCSS.
- `/backend`: FastAPI server with SQLite/SQLAlchemy.
- `/backend/services`: The "intelligence" layer (AI, Recommendation, Decision engines).

---
