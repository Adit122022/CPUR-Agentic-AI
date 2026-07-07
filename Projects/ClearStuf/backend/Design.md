# ClearShelf Retail Forecasting — Backend Architectural Design

This document details the backend architecture, data flow, database schemas, and multi-agent deliberation framework for the ClearShelf Retail Forecasting API.

---

## 1. High-Level Architecture Overview

ClearShelf is structured as a single-node, service-oriented FastAPI application. It coordinates database operations, data ingestion workflows, automated ML forecasting, and LLM-powered multi-agent evaluations.

```
                  ┌───────────────────────┐
                  │      Vite React       │
                  │       Frontend        │
                  └───────────┬───────────┘
                              │
                     HTTP REST│WebSockets
                              ▼
┌──────────────────────────────────────────────────────────┐
│                     FastAPI Backend                      │
│                                                          │
│  ┌─────────────────┐ ┌─────────────────┐ ┌────────────┐  │
│  │   Auth / JWT    │ │   Connection    │ │    CORS    │  │
│  │   Middleware    │ │   Manager (WS)  │ │ Middleware │  │
│  │    (Clerk)      │ │                 │ │            │  │
│  └────────┬────────┘ └────────┬────────┘ └────────────┘  │
│           │                   │                          │
│           ▼                   ▼                          │
│  ┌─────────────────┐ ┌────────────────────────────────┐  │
│  │   APIs Routers  │ │       Services layer           │  │
│  │  (Products,     │ │                                │  │
│  │   Forecasts,    │ │  ┌──────────────────────────┐  │  │
│  │   Uploads,      │ │  │ Preprocessing / Hashing  │  │  │
│  │   History)      │ │  └──────────────────────────┘  │  │
│  └────────┬────────┘ │  ┌──────────────────────────┐  │  │
│           │          │  │ Forecast Engine (LR)     │  │  │
│           │          │  └──────────────────────────┘  │  │
│           │          │  ┌──────────────────────────┐  │  │
│           │          │  │ CrewAI Agents council    │  │  │
│           │          │  └──────────────────────────┘  │  │
│           │          └────────────────────────────────┘  │
└───────────┼──────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│     PostgreSQL DB       │
│    (Neon Replica /      │
│     SQLite Fallback)    │
└─────────────────────────┘
```

---

## 2. Ingestion & Preprocessing Pipeline

The data ingestion process takes a CSV transaction log, calculates its SHA-256 hash, cleans the formatting, maps required fields, handles missing variables, and writes to the DB.

### 2.1 Unique Ingestion Verification
To prevent duplicate data imports, a SHA-256 hash is computed on the raw file content bytes before processing:
1. The frontend uploads a file to the `/validate` or `/import` endpoint.
2. The backend computes the file hash using Python's `hashlib.sha256(content).hexdigest()`.
3. It queries the `upload_history` table:
   - If the hash already exists, it aborts execution and throws a `400 Bad Request` duplicate error.
   - If it is unique, it proceeds to the preprocessing steps.
4. After successful insertion, it stores a log record in the `upload_history` table containing the filename, file hash, processed rows count, and status.

### 2.2 Pandas EDA and Preprocessing
The `preprocessing_service` prepares the uploaded files using `pandas` to clean nulls and parse formats:
1. **Smart Column Alignment**: Maps variations of required column names (case-insensitive, alternate terms like `mrp`/`unit_price`/`price`) to standardized column tags (`date`, `product_name`, `sku`, `category`, `price`, `quantity_sold`, `current_stock`).
2. **Missing Key Mitigation**: Rows missing critical parameters (`date` or `sku`) are dropped. For optional missing fields, default values are set (e.g. `brand` default to `"Generic"`, `discounted_price` default to `price`).
3. **Date Harmonization**: Parses string dates in formats like `YYYY-MM-DD`, `DD/MM/YYYY`, or `MM/DD/YYYY` and normalizes them to `YYYY-MM-DD`. Non-date strings are dropped.
4. **Numeric Cleansing**: Strips commas, currency markers (₹, $), and converts string columns to floats/integers safely.
5. **Redundancy Scrubbing**: De-duplicates rows sharing the same SKU and Date in a single sheet to ensure transaction indexes are clean.

---

## 3. Database Schema

ClearShelf uses SQLAlchemy ORM to manage tables. Below is the Entity Relationship Diagram:

### 3.1 ERD Description
- **`products`**: Maintains individual SKU details (pricing, current stock levels, categories).
  - One-to-many relationship with `historical_sales`.
  - One-to-many relationship with `forecasts`.
- **`historical_sales`**: Stores daily quantity sold records for each product.
- **`forecasts`**: Logs mathematical baseline predictions, agent deliberation rationales, and consensus adjusted quantities.
- **`upload_history`**: Tracks file hashes and audit details of loaded files.

```
  ┌───────────────────────┐             ┌───────────────────────┐
  │       products        │             │   historical_sales    │
  ├───────────────────────┤             ├───────────────────────┤
  │ id (PK)         INT   ├─┐           │ id (PK)         INT   │
  │ name            VARCHAR │ │           │ product_id (FK) INT   │
  │ sku (Unique)    VARCHAR │ └──────────►│ date            VARCHAR │
  │ brand           VARCHAR │             │ quantity        INT   │
  │ price           FLOAT   │             └───────────────────────┘
  │ discounted_price FLOAT  │
  │ category        VARCHAR │             ┌───────────────────────┐
  │ current_stock   INT   ├─┐           │       forecasts       │
  │ description     VARCHAR │ │           ├───────────────────────┤
  └───────────────────────┘ └──────────►│ id (PK)         INT   │
                                        │ product_id (FK) INT   │
  ┌───────────────────────┐             │ forecast_date   VARCHAR │
  │    upload_history     │             │ predicted_qty   FLOAT   │
  ├───────────────────────┤             │ model_used      VARCHAR │
  │ id (PK)         INT   │             │ agent_adjusts   TEXT    │
  │ filename        VARCHAR │             │ adjusted_qty    FLOAT   │
  │ file_hash       VARCHAR │             │ created_at      DATETIME│
  │ total_rows      INT     │             └───────────────────────┘
  │ unique_products INT     │
  │ uploaded_at     DATETIME│
  │ status          VARCHAR │
  └───────────────────────┘
```

---

## 4. Forecasting & Multi-Agent Deliberation

ClearShelf provides mathematical baseline forecasts combined with a context-aware AI Council adjustment overlay.

### 4.1 ML Forecasting
The forecasting engine fits a rolling weekly baseline demand curve using the product's daily sales history. By default, it computes predictions using a Linear Regression model (`scikit-learn` framework) over historical sales points.

### 4.2 AI Council Deliberation (CrewAI)
When AI Enrichment is requested, the backend kicks off a hierarchical, sequential multi-agent panel:
- **Data Analyst**: Reviews 30-day transaction trends to identify weekend seasonality and baseline sales volume.
- **Market Scout**: Evaluates social media mentions and active promotion context to calculate a marketing adjustment factor.
- **Weather Analyst**: Matches tomorrow's local meteorological predictions (weather conditions, temperature) to determine categories impacted by rain, snow, or heat.
- **Synthesizer**: Consolidates reports from all agents, calculates the consensus percentage adjustment, and produces a final adjusted forecast quantity.

### 4.3 WebSocket Streaming Log Delivery
During agent execution, logs are captured in real-time and piped back to the client:
1. The backend intercepts standard output streams (`sys.stdout`) using a custom `WebSocketStream` wrapper.
2. When the CrewAI agents output logs during execution, the stream callback triggers the `ConnectionManager.broadcast` function.
3. The logs are broadcast asynchronously as JSON packets over active WebSockets (`ws://localhost:8000/api/ws/logs`), displaying live deliberative steps in the frontend console.
