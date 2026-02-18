# 🧠 CommerceBrain AI
### Next-Gen E-Commerce Intelligence Platform

> **AI/ML Hackathon Submission** — Real-time competitor analysis, sentiment intelligence, and autonomous decision-making powered by advanced NLP models.

---

## 🚀 What is CommerceBrain AI?

CommerceBrain AI is an intelligent e-commerce analytics platform that transforms raw product and review data into **actionable business intelligence**. It combines multiple AI/ML models into a unified dashboard that helps sellers understand their market position, customer sentiment, and strategic opportunities — in real time.

**The Problem:** E-commerce sellers are drowning in data but starving for insights. Static reports are slow, manual analysis is expensive, and competitors move fast.

**The Solution:** An AI-native platform that automatically extracts insights, predicts trends, and generates structured recommendations — all from product URLs and review data.

---

## ✨ Feature Set

### 🔍 1. Hybrid Semantic Search Engine
- **Model:** `sentence-transformers/all-MiniLM-L6-v2`
- **Architecture:** RAG-lite (Retrieval-Augmented Generation) with pre-computed vector embeddings
- Finds semantically similar products even without keyword overlap
- Supports Amazon/Flipkart URL input for direct product lookup

### ⚡ 2. Dual Analysis Modes — Quick & Deep
- **Quick Mode:** Analyzes 20 reviews in seconds — ideal for rapid decision-making
- **Deep Mode:** Processes up to 50+ reviews with comprehensive report generation including key factors, competitor benchmarking, and strategic summaries
- Both modes return structured JSON with consistent schema for frontend rendering

### 😃 3. Sentiment Intelligence (RoBERTa)
- **Model:** Fine-tuned `cardiffnlp/twitter-roberta-base-sentiment`
- Computes sentiment score (0–100%) with confidence intervals
- Tracks positive/negative distribution across review batches
- Powers the **Cost & Confidence Widget** on the dashboard

### 🚨 4. Automated Complaint Extraction (BERTopic)
- **Model:** BERTopic (Unsupervised Topic Modeling)
- Clusters negative reviews into actionable themes (e.g., "Battery Life", "Shipping Delays")
- Auto-generates **prioritized recommendations** (e.g., "Fix battery issue → estimated +15% rating")
- Powers the **Risk Alerts Panel** on the dashboard

### 📊 5. Structured Decision Reports
- Every analysis returns a structured report with:
  - **Summary:** Natural language synthesis of review patterns
  - **Key Factors:** Top complaint themes + positive signals
  - **Recommendation:** Single highest-priority action item
  - **Competitor Benchmarks:** Side-by-side comparison with category peers
- Designed for product managers who need decisions, not raw data

### 🎯 6. Confidence Scoring System
- Every insight comes with a **confidence score** (0.0–1.0)
- Calculated from model certainty + review volume
- Displayed prominently in the UI so users know when to trust the AI
- Scales with data: more reviews = higher confidence

### 💰 7. Cost Tracking & Token Monitoring
- Tracks estimated inference cost per analysis run
- Reports token usage for each request
- Enables teams to monitor AI spend and optimize batch sizes
- Displayed in the **Cost & Confidence Widget**

### 📈 8. Demand vs. Supply Insights (Opportunities Engine)
- Analyzes category-level data to surface market gaps
- Detects **Quality Gaps** (low avg. rating = opportunity for better product)
- Identifies **Niche Markets** (low competition sub-categories)
- Surfaces **Expansion Opportunities** (high-demand categories)
- Powers the **Opportunities Page** with dynamic, data-driven cards

### 🧠 9. Domain Memory & KPI Preference Learning
- **Endpoint:** `POST /api/v1/memory/preference`
- Stores user preferences: optimize for `profit` or `growth`, preferred marketplaces, categories, and report style
- Persists across sessions (in-memory for demo, extensible to DB)
- Enables the platform to **learn your priorities** and tailor recommendations

### 💬 10. Context-Aware AI Assistant
- **Endpoint:** `POST /api/v1/chat`
- Retrieval-based chat that injects live product context into responses
- Answers questions like "Why is this rating low?" or "What are the top complaints?"
- Uses real sentiment + complaint data — not hallucinated answers

### 🌐 11. Real-Time Amazon Scraping (Apify)
- Paste any Amazon product URL → get live price, stock, and ratings
- Powered by **Apify Actor** `XVDTQc4a7MDTqSTMJ`
- Scraped data is dynamically added to the in-memory catalog for immediate analysis
- Enables analysis of products not in the static dataset

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | FastAPI (Python) |
| **ML / NLP** | PyTorch, SentenceTransformers, BERTopic, Scikit-learn |
| **Data** | Pandas, NumPy |
| **Real-Time** | Apify API |
| **Frontend** | React + Vite + TypeScript |
| **Styling** | TailwindCSS + Shadcn/UI |
| **Charts** | Recharts |
| **State** | React Context API |

---

## ⚡ Quick Start

### Prerequisites
- Python 3.9+, Node.js 16+

### 1. Clone
```bash
git clone https://github.com/Arjun006-coder/CommerceBrain.git
cd CommerceBrain
```

### 2. Backend
```bash
pip install -r requirements.txt
uvicorn backend.main:app --host 0.0.0.0 --port 8002 --reload
```

### 3. Frontend
```bash
cd frontend/commercebrain-dashboard
npm install
npm run dev -- --port 8080
```

Open `http://localhost:8080` 🚀

---

## 📂 Project Structure

```
CommerceBrain/
├── backend/
│   ├── main.py                    # FastAPI — all endpoints
│   ├── models/
│   │   ├── search_engine.py       # Semantic Search (SentenceTransformers)
│   │   ├── sentiment_analyzer.py  # RoBERTa Sentiment
│   │   └── complaint_extractor.py # BERTopic Topic Modeling
│   ├── services/
│   │   └── apify_service.py       # Real-Time Amazon Scraper
│   └── config.py
├── frontend/commercebrain-dashboard/
│   └── src/
│       ├── pages/                 # Dashboard, Analytics, Competitor, Opportunities
│       └── components/            # RiskAlerts, Chat, CostWidget, etc.
├── data/processed/                # Preprocessed CSVs + Embeddings
└── scripts/                       # ETL & Training Scripts
```

---

## 🔮 Roadmap
- [ ] LangGraph Agentic Workflow for autonomous competitor research
- [ ] LSTM-based Predictive Pricing
- [ ] Visual Product Search (image input)
- [ ] Production deployment (Render + Vercel)

---

*Built with ❤️ for the AI/ML Hackathon Community.*
