# CommerceBrain AI - Quick Start Guide

This guide will get you up and running in minutes using **mock data** (no Kaggle account needed).

## Prerequisites

- Python 3.9+ installed
- Basic terminal/command prompt knowledge
- (Optional) Docker for Qdrant

---

## Step 1: Setup Environment

```bash
# Navigate to project
cd d:\Commercebrain-ai

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies (this may take 5-10 minutes)
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm
```

---

## Step 2: Configure Environment Variables

```bash
# Copy template
copy .env.example .env

# Edit .env file and add your OpenAI API key
# You can use Notepad or any text editor
notepad .env
```

**Minimum required in `.env`:**
```env
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

> **Don't have an OpenAI key?** Get one at: https://platform.openai.com/api-keys

---

## Step 3: Generate Mock Data (Fast!)

```bash
# Generate 1,000 reviews and 20 products
python scripts/generate_mock_data.py --reviews 1000 --products 20

# Output will be in data/raw/mock_reviews.csv and data/raw/mock_products.csv
```

**Expected output:**
```
✓ Generated 1,000 reviews
  - Avg rating: 3.85
  - Positive: 700
  - Negative: 150
✓ Generated 20 products
✅ Mock data generated successfully!
```

---

## Step 4: Preprocess Data

```bash
# Clean and prepare data
python scripts/preprocess_data.py

# This will create data/processed/processed_mock_reviews.csv
```

**Expected output:**
```
✓ Preprocessed reviews saved
  Total reviews: 987
  Removed: 13 (1.3%)
  Avg rating: 3.87
```

---

## Step 5: Start Qdrant (Vector Database)

### Option A: Using Docker (Recommended)

```bash
# Pull and run Qdrant
docker pull qdrant/qdrant
docker run -d -p 6333:6333 -p 6334:6334 --name qdrant qdrant/qdrant

# Verify it's running
curl http://localhost:6333
```

### Option B: Local Installation

```bash
# Qdrant will use in-memory mode if Docker not available
# Just proceed to next step
```

---

## Step 6: Initialize Qdrant Collections

```bash
python scripts/setup_qdrant.py
```

**Expected output:**
```
✓ Created collection: reviews
✓ Created collection: insights
✓ Created collection: user_preferences
✓ Created collection: products
✅ Qdrant setup complete!
```

---

## Step 7: Start Backend API

```bash
cd backend
python -m uvicorn api.main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Test it:**
Open your browser to: http://localhost:8000

You should see:
```json
{
  "message": "CommerceBrain AI API is running",
  "version": "1.0.0",
  "status": "healthy"
}
```

**API Docs:** http://localhost:8000/docs

---

## Step 8: (Optional) Frontend Setup

### Option A: Generate with Lovable (Recommended)

1. Go to https://lovable.dev
2. Open `LOVABLE_FRONTEND_PROMPT.md`
3. Copy and paste the entire content
4. Download the generated project
5. Extract to `d:\Commercebrain-ai\frontend\`
6. Follow Lovable's instructions to run

### Option B: Manual Frontend (Later)

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🎉 You're Ready!

Your CommerceBrain AI backend is now running!

### What You Can Do Now:

#### 1. Test Quick Insight API

```bash
# Using curl (Windows - use command prompt):
curl -X POST "http://localhost:8000/api/v1/quick-insight" ^
  -H "Content-Type: application/json" ^
  -d "{\"product_id\": \"PROD1001\", \"query_type\": \"complaints\"}"

# Using PowerShell:
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/quick-insight" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"product_id": "PROD1001", "query_type": "complaints"}'
```

#### 2. Explore API Documentation

Visit: http://localhost:8000/docs

Try out endpoints interactively!

#### 3. Next Steps

Follow the **PHASE_PLANNING.md** for:
- Phase 2: ML Models (sentiment analysis, complaint extraction)
- Phase 3: RAG & Vector DB integration
- Phase 4: LangGraph agents
- Phase 5: Advanced features

---

## Common Issues & Solutions

### Issue: `ModuleNotFoundError: No module named 'X'`
**Solution:** Make sure virtual environment is activated and run:
```bash
pip install -r requirements.txt
```

### Issue: Qdrant connection failed
**Solution:** 
1. Check if Docker is running: `docker ps`
2. Restart Qdrant: `docker restart qdrant`
3. Or use in-memory mode (edit backend/config.py)

### Issue: OpenAI API key not working
**Solution:**
1. Verify key is correct in `.env` file
2. Check your OpenAI account has credits
3. Ensure `.env` file is in project root

### Issue: Port 8000 already in use
**Solution:**
```bash
# Use different port
uvicorn api.main:app --reload --port 8001
```

---

## Project Structure Overview

```
d:\Commercebrain-ai/
├── backend/           # FastAPI application
│   ├── api/          # API endpoints
│   ├── agents/       # LangGraph agents (to be created)
│   ├── models/       # ML models (to be created)
│   ├── core/         # Core logic (to be created)
│   └── config.py     # Configuration
├── data/
│   ├── raw/          # Original datasets
│   └── processed/    # Cleaned datasets
├── scripts/          # Setup scripts
│   ├── generate_mock_data.py
│   ├── preprocess_data.py
│   └── setup_qdrant.py
├── requirements.txt  # Python dependencies
├── .env             # Environment variables (YOU CREATE THIS)
└── README.md        # Full documentation
```

---

## Development Workflow

### Daily Startup:
```bash
# 1. Activate environment
venv\Scripts\activate

# 2. Start Qdrant (if using Docker)
docker start qdrant

# 3. Start backend
cd backend
python -m uvicorn api.main:app --reload
```

### Testing Changes:
```bash
# Run tests (when available)
pytest tests/ -v

# Check code style
black backend/ --check
flake8 backend/
```

---

## Getting Help

- **Full Documentation:** See `README.md`
- **Implementation Plan:** See `implementation_plan.md` (in brain folder)
- **Phase Guide:** See `PHASE_PLANNING.md`
- **API Docs:** http://localhost:8000/docs (when server running)

---

## Next: Building ML Models

Once your backend is running, proceed to **Phase 2** in `PHASE_PLANNING.md`:

1. Sentiment Analysis (BERT/RoBERTa)
2. Complaint Extraction (BERTopic)
3. Feature Detection
4. Embeddings Generation

**Happy Building! 🚀🧠🛒**
