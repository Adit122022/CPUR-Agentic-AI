# Retail Demand Forecasting System

A premium forecasting platform combining traditional machine learning algorithms with a collaborative multi-agent overlay powered by **CrewAI**.
[liveLink]("https://clearstuff.vercel.app/")

## Architecture Overview

```mermaid
graph TD
    A[Vite React + TS Frontend] <-->|HTTP / WS| B[FastAPI Backend]
    B --> C[(SQLAlchemy / SQLite or Neon DB)]
    B --> D[ML Models]
    B --> E[CrewAI Agents]
    
    subgraph "Mathematical Baseline"
        D --> D1[Linear Regression]
        D --> D2[Decision Tree]
        D --> D3[Neural Network MLP]
    end

    subgraph "Qualitative Consensus"
        E --> E1[Data Analyst]
        E --> E2[Market Scout]
        E --> E3[Weather Analyst]
        E --> E4[Synthesizer]
    end
    
    E2 --> F[Social Buzz Service]
    E3 --> G[Weather Service]
```

The forecasting workflow works as follows:
1. **Mathematical Baseline**: The user selects a product and a mathematical model. The backend trains the model using 30 days of historical transactions and projects tomorrow's volume.
2. **Consensus Adjustment**: If CrewAI is enabled, three specialized agents (Data, Market, Weather) ingest external data streams (mocked or live weather and social media trends) to propose qualitative adjustments.
3. **Consensus Synthesis**: A Synthesizer agent evaluates both the statistical ML projection and the agents' qualitative adjustments to produce a final, adjusted forecast quantity along with a markdown consensus report.
4. **Live Stream**: The internal execution steps of the CrewAI agents are captured and piped to the frontend in real-time over WebSockets.

---

## Folder Structure

```
retail-demand-forecasting/
├── 📁 frontend/                    # React + TypeScript (Vite)
│   ├── src/
│   │   ├── components/             # Dashboard, Chart, Log Stream, cards
│   │   ├── services/               # api.ts (Backend HTTP Client)
│   │   └── App.tsx                 # Base entry
│
├── 📁 backend/                     # Python + FastAPI
│   ├── app/
│   │   ├── main.py                 # FastAPI application root
│   │   ├── core/config.py          # Settings & Environment configs
│   │   ├── api/                    # Routers (Forecast, Products, WebSocket)
│   │   ├── database/               # Neon DB / SQLite connection, schema models, & seeds
│   │   ├── agents/                 # CrewAI agent configurations & orchestrator
│   │   ├── models/                 # ML Models (Linear Regression, Decision Tree, Neural Network)
│   │   └── services/               # Data fetching (Weather, Social Media) & forecasting orchestrator
│   ├── requirements.txt
│   └── Dockerfile
│
├── 📁 data/                        # Sample datasets
└── README.md
```

---

## Setup & Running Locally

### Backend Setup

1. **Navigate to backend and create a virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   source venv/Scripts/activate  # On Windows
   # or venv/bin/activate on Mac/Linux
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment variables** (Optional):
   Create a `.env` file in the `backend/` directory:
   ```env
   # Leave blank to use fallback local SQLite DB
   DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
   
   # CrewAI LLM connection keys (Fallback simulator mode runs if blank or mock-key)
   OPENAI_API_KEY=your-openai-api-key
   OPENAI_MODEL_NAME=gpt-4o
   ```

4. **Start the backend server**:
   ```bash
   uvicorn app.main:app --reload
   ```
   On first start, the database tables will be created automatically and seeded with mock inventory products and 30-day transactional records.
   The API docs will be accessible at: `http://localhost:8000/docs`

---

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install node packages**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will launch on: `http://localhost:5173`

---

## Simulation / Demo Mode

If no valid `OPENAI_API_KEY` is provided, the platform automatically enters a **High-Fidelity Simulation Mode**.
In this mode, the agents simulate their analysis step-by-step, streaming realistic calculations to the live logs dashboard via WebSockets so you can fully explore the platform's visual capability without setting up API keys.
