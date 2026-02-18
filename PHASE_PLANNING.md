# CommerceBrain AI - Detailed Phase Planning

## 🎯 Executive Summary

This document breaks down the implementation into **8 detailed phases** with specific tasks, timelines, and deliverables. Designed for hackathon execution but scalable to production.

---

## Phase 1: Foundation Setup (Hours 0-4)

### Objectives
- Set up development environment
- Initialize project structure
- Configure dependencies
- Prepare data pipeline

### Tasks

#### 1.1 Environment Setup
```bash
# Create virtual environment
cd d:/Commercebrain-ai
python -m venv venv
venv\Scripts\activate

# Install core dependencies
pip install -r requirements.txt

# Verify installations
python -c "import torch; print(torch.__version__)"
python -c "import transformers; print('✓')"
```

#### 1.2 Qdrant Setup
```bash
# Run Qdrant via Docker
docker pull qdrant/qdrant
docker run -p 6333:6333 qdrant/qdrant

# OR install locally
pip install qdrant-client

# Initialize collections
python scripts/setup_qdrant.py
```

#### 1.3 Data Acquisition
**Option A: Kaggle Datasets (Recommended)**
```bash
# Install Kaggle CLI
pip install kaggle

# Configure API credentials
# Download kaggle.json from https://www.kaggle.com/settings
# Place in: C:\Users\HP\.kaggle\kaggle.json

# Download datasets
kaggle datasets download -d datafiniti/consumer-reviews-of-amazon-products
kaggle datasets download -d PromptCloudHQ/flipkart-products

# Extract
unzip -q consumer-reviews-of-amazon-products.zip -d data/raw/
unzip -q flipkart-products.zip -d data/raw/
```

**Option B: Mock Dataset (Fast) **
```python
# Generate synthetic dataset for testing
python scripts/generate_mock_data.py --reviews 10000 --products 100
```

#### 1.4 Data Preprocessing
```bash
# Run preprocessing pipeline
python scripts/preprocess_data.py

# Expected output:
# ✓ Loaded 10,000 reviews
# ✓ Cleaned 9,847 reviews (removed 153 nulls)
# ✓ Extracted features from 2,341 products
# ✓ Saved to data/processed/
```

### Deliverables
- ✅ Working Python environment
- ✅ Qdrant instance running
- ✅ Processed dataset in `data/processed/`
- ✅ Git repository initialized

### Time Estimate: 3-4 hours

---

## Phase 2: ML Model Development (Hours 4-8)

### Objectives
- Build sentiment analysis model
- Implement complaint extraction
- Create feature request detector
- Generate embeddings

### Tasks

#### 2.1 Sentiment Analysis Model
**File**: `backend/models/sentiment_analyzer.py`

```python
from transformers import pipeline

class SentimentAnalyzer:
    def __init__(self):
        self.model = pipeline(
            "sentiment-analysis",
            model="cardiffnlp/twitter-roberta-base-sentiment-latest"
        )
    
    def analyze(self, text: str) -> dict:
        result = self.model(text)[0]
        return {
            "label": result["label"],  # positive/negative/neutral
            "score": result["score"],
            "confidence": self._calculate_confidence(result)
        }
    
    def analyze_batch(self, texts: list) -> dict:
        # Batch processing for efficiency
        results = self.model(texts)
        return self._aggregate_sentiments(results)
```

**Test in Jupyter**:
```bash
jupyter notebook notebooks/01_sentiment_analysis.ipynb
```

#### 2.2 Complaint Extraction (BERTopic)
**File**: `backend/models/complaint_extractor.py`

```python
from bertopic import BERTopic
from sklearn.feature_extraction.text import CountVectorizer

class ComplaintExtractor:
    def __init__(self):
        self.vectorizer = CountVectorizer(
            stop_words=self._get_ecommerce_stopwords()
        )
        self.topic_model = BERTopic(
            embedding_model="all-MiniLM-L6-v2",
            vectorizer_model=self.vectorizer,
            min_topic_size=10
        )
    
    def extract_complaints(self, reviews: list, ratings: list) -> dict:
        # Filter negative reviews
        negative_reviews = [
            r for r, rating in zip(reviews, ratings) 
            if rating < 3.0
        ]
        
        # Fit topic model
        topics, probs = self.topic_model.fit_transform(negative_reviews)
        
        # Get top complaint themes
        top_complaints = self._rank_complaints(topics, probs)
        
        return {
            "top_complaints": top_complaints,
            "total_analyzed": len(negative_reviews),
            "num_themes": len(set(topics))
        }
```

#### 2.3 Feature Request Detector
**File**: `backend/models/feature_detector.py`

```python
import spacy

class FeatureDetector:
    def __init__(self):
        self.nlp = spacy.load("en_core_web_sm")
        self.request_patterns = [
            "wish", "should have", "would be better if",
            "missing", "need", "want", "hope", "expect"
        ]
    
    def detect_requests(self, reviews: list) -> list:
        requests = []
        for review in reviews:
            if self._contains_request_pattern(review):
                features = self._extract_features(review)
                requests.extend(features)
        
        # Cluster and rank
        return self._rank_by_frequency(requests)
```

#### 2.4 Embeddings Generation
**File**: `backend/models/embeddings.py`

```python
from sentence_transformers import SentenceTransformer

class EmbeddingGenerator:
    def __init__(self):
        self.model = SentenceTransformer('all-mpnet-base-v2')
    
    def generate(self, texts: list) -> np.ndarray:
        return self.model.encode(
            texts,
            show_progress_bar=True,
            batch_size=32
        )
    
    def generate_and_store(self, product_id: str, reviews: list):
        embeddings = self.generate(reviews)
        self._store_in_qdrant(product_id, embeddings, reviews)
```

**Run Embedding Pipeline**:
```bash
python scripts/generate_embeddings.py --input data/processed/reviews.csv
```

### Deliverables
- ✅ Sentiment analyzer achieving >80% accuracy
- ✅ Complaint themes extraction working
- ✅ Feature request detection functional
- ✅ Embeddings generated and stored in Qdrant

### Time Estimate: 4 hours

---

## Phase 3: RAG & Vector Database (Hours 8-10)

### Objectives
- Set up Qdrant collections
- Implement RAG pipeline
- Build semantic search

### Tasks

#### 3.1 Qdrant Collections Setup
**File**: `backend/core/vector_store.py`

```python
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(host="localhost", port=6333)
        self._initialize_collections()
    
    def _initialize_collections(self):
        # Reviews collection
        self.client.recreate_collection(
            collection_name="reviews",
            vectors_config=VectorParams(size=768, distance=Distance.COSINE)
        )
        
        # Insights collection (for memory)
        self.client.recreate_collection(
            collection_name="insights",
            vectors_config=VectorParams(size=768, distance=Distance.COSINE)
        )
        
        # User preferences collection
        self.client.recreate_collection(
            collection_name="user_preferences",
            vectors_config=VectorParams(size=768, distance=Distance.COSINE)
        )
```

#### 3.2 RAG Engine
**File**: `backend/core/rag_engine.py`

```python
class RAGEngine:
    def __init__(self, vector_store, llm_client):
        self.vector_store = vector_store
        self.llm = llm_client
        self.embedding_model = SentenceTransformer('all-mpnet-base-v2')
    
    def query(self, question: str, top_k: int = 10) -> dict:
        # 1. Generate query embedding
        query_embedding = self.embedding_model.encode(question)
        
        # 2. Retrieve relevant reviews
        results = self.vector_store.search(
            collection_name="reviews",
            query_vector=query_embedding,
            limit=top_k
        )
        
        # 3. Construct context
        context = self._build_context(results)
        
        # 4. Generate response with LLM
        response = self.llm.generate(
            prompt=self._build_prompt(question, context)
        )
        
        return {
            "answer": response,
            "sources": results,
            "confidence": self._calculate_confidence(results)
        }
```

### Deliverables
- ✅ Qdrant collections created
- ✅ RAG pipeline functional
- ✅ Semantic search working

### Time Estimate: 2 hours

---

## Phase 4: LangGraph Agents (Hours 10-14)

### Objectives
- Build agent workflow
- Implement Quick and Deep mode
- Create decision engine

### Tasks

#### 4.1 Agent Graph Structure
**File**: `backend/agents/agent_graph.py`

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class AgentState(TypedDict):
    query: str
    mode: str  # "quick" or "deep"
    product_id: str
    retrieved_data: dict
    analysis_results: dict
    recommendations: list
    confidence: float

def build_agent_graph():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("classifier", intent_classifier)
    workflow.add_node("retriever", data_retriever)
    workflow.add_node("analyzer", analyzer)
    workflow.add_node("decision_maker", decision_engine)
    workflow.add_node("response_builder", response_builder)
    
    # Add edges
    workflow.add_edge("classifier", "retriever")
    workflow.add_edge("retriever", "analyzer")
    workflow.add_edge("analyzer", "decision_maker")
    workflow.add_edge("decision_maker", "response_builder")
    workflow.add_edge("response_builder", END)
    
    workflow.set_entry_point("classifier")
    
    return workflow.compile()
```

#### 4.2 Quick Mode Agent
**File**: `backend/agents/quick_mode_agent.py`

```python
class QuickModeAgent:
    def __init__(self, sentiment_analyzer, complaint_extractor):
        self.sentiment_analyzer = sentiment_analyzer
        self.complaint_extractor = complaint_extractor
    
    def run(self, product_id: str, query_type: str) -> dict:
        # Fast execution path
        if query_type == "complaints":
            return self._get_top_complaints(product_id)
        elif query_type == "sentiment":
            return self._get_sentiment_summary(product_id)
        elif query_type == "price":
            return self._get_price_comparison(product_id)
        elif query_type == "features":
            return self._get_feature_requests(product_id)
```

#### 4.3 Deep Mode Agent
**File**: `backend/agents/deep_mode_agent.py`

```python
class DeepModeAgent:
    def __init__(self, rag_engine, opportunity_finder, decision_engine):
        self.rag = rag_engine
        self.opportunity_finder = opportunity_finder
        self.decision_engine = decision_engine
    
    def run(self, product_id: str, analysis_type: str) -> dict:
        # Comprehensive analysis
        if analysis_type == "underperformance":
            return self._diagnose_underperformance(product_id)
        elif analysis_type == "opportunity":
            return self._find_opportunities(product_id)
        elif analysis_type == "competitive":
            return self._competitive_analysis(product_id)
```

#### 4.4 Decision Engine
**File**: `backend/agents/decision_engine.py`

```python
class DecisionEngine:
    def make_recommendations(self, analysis: dict) -> list:
        recommendations = []
        
        # Rule-based decisions
        if analysis["price_gap"] > 0.15:
            recommendations.append({
                "action": "reduce_price",
                "reason": f"Priced {analysis['price_gap']*100:.0f}% above category average",
                "expected_impact": "15-20% sales increase",
                "confidence": 0.82
            })
        
        if analysis["negative_sentiment"] > 0.4:
            top_complaint = analysis["complaints"][0]
            recommendations.append({
                "action": "address_complaint",
                "issue": top_complaint["theme"],
                "reason": f"{top_complaint['percentage']}% of negative reviews",
                "suggested_fix": self._suggest_fix(top_complaint["theme"]),
                "confidence": 0.75
            })
        
        return recommendations
```

### Deliverables
- ✅ LangGraph workflow functional
- ✅ Quick mode (<30s response)
- ✅ Deep mode (<3min response)
- ✅ Decision engine generating recommendations

### Time Estimate: 4 hours

---

## Phase 5: Backend API (Hours 14-16)

### Objectives
- Build FastAPI application
- Create API endpoints
- Add authentication
- Implement cost tracking

### Tasks

#### 5.1 FastAPI Setup
**File**: `backend/api/main.py`

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="CommerceBrain AI API", version="1.0.0")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "CommerceBrain AI API is running"}
```

#### 5.2 API Endpoints
**File**: `backend/api/routes/insights.py`

```python
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["insights"])

class QuickInsightRequest(BaseModel):
    product_id: str
    query_type: str  # "complaints" | "sentiment" | "price" | "features"

class QuickInsightResponse(BaseModel):
    insights: dict
    confidence: float
    cost: float
    tokens: int
    processing_time_ms: int

@router.post("/quick-insight", response_model=QuickInsightResponse)
async def get_quick_insight(request: QuickInsightRequest):
    # Track start time and tokens
    start_time = time.time()
    token_tracker = TokenTracker()
    
    # Execute Quick Mode Agent
    agent = QuickModeAgent()
    result = agent.run(request.product_id, request.query_type)
    
    # Calculate metrics
    processing_time = (time.time() - start_time) * 1000
    tokens_used = token_tracker.get_count()
    cost = calculate_cost(tokens_used)
    
    return QuickInsightResponse(
        insights=result,
        confidence=result.get("confidence", 0.85),
        cost=cost,
        tokens=tokens_used,
        processing_time_ms=int(processing_time)
    )
```

**File**: `backend/api/routes/analysis.py`

```python
@router.post("/deep-analysis", response_model=DeepAnalysisResponse)
async def get_deep_analysis(request: DeepAnalysisRequest):
    # Similar structure but with DeepModeAgent
    agent = DeepModeAgent()
    result = agent.run(request.product_id, request.analysis_type)
    
    return DeepAnalysisResponse(
        report=result,
        confidence=result.get("confidence", 0.83),
        cost=calculate_cost(token_tracker.get_count()),
        tokens=token_tracker.get_count(),
        processing_time_ms=int(processing_time)
    )
```

#### 5.3 Run Backend
```bash
cd backend
uvicorn api.main:app --reload --port 8000

# Test API
curl http://localhost:8000/
curl -X POST http://localhost:8000/api/v1/quick-insight \
  -H "Content-Type: application/json" \
  -d '{"product_id": "B08N5WRWNW", "query_type": "complaints"}'
```

### Deliverables
- ✅ FastAPI server running
- ✅ All endpoints functional
- ✅ Request/response validation
- ✅ Cost tracking implemented

### Time Estimate: 2 hours

---

## Phase 6: Frontend Development (Hours 16-20)

### Objectives
- Generate UI with Lovable
- Integrate with backend API
- Add visualizations
- Polish UX

### Tasks

#### 6.1 Generate Frontend with Lovable
```
1. Go to https://lovable.dev
2. Paste LOVABLE_FRONTEND_PROMPT.md content
3. Review generated code
4. Download project
5. Extract to d:/Commercebrain-ai/frontend/
```

#### 6.2 Setup Frontend
```bash
cd frontend
npm install
npm run dev

# Open http://localhost:3000
```

#### 6.3 API Integration
**File**: `frontend/src/lib/api.ts`

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getQuickInsight(
  productId: string,
  queryType: string
): Promise<QuickInsightResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/quick-insight`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, query_type: queryType })
  });
  
  if (!response.ok) throw new Error('Failed to fetch insight');
  return response.json();
}

export async function getDeepAnalysis(
  productId: string,
  analysisType: string
): Promise<DeepAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/deep-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, analysis_type: analysisType })
  });
  
  if (!response.ok) throw new Error('Failed to fetch analysis');
  return response.json();
}
```

#### 6.4 Polish UI
- Test all pages
- Fix responsive issues
- Add loading states
- Implement error handling
- Test animations

### Deliverables
- ✅ Frontend running on localhost:3000
- ✅ API integration working
- ✅ All pages functional
- ✅ Professional UI/UX

### Time Estimate: 4 hours

---

## Phase 7: Integration & Testing (Hours 20-22)

### Objectives
- Integration testing
- Bug fixes
- Performance optimization

### Tasks

#### 7.1 End-to-End Testing
```python
# test_integration.py
import pytest
import requests

def test_quick_insight_flow():
    response = requests.post(
        "http://localhost:8000/api/v1/quick-insight",
        json={"product_id": "TEST123", "query_type": "complaints"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "insights" in data
    assert "confidence" in data
    assert data["confidence"] > 0

def test_deep_analysis_flow():
    response = requests.post(
        "http://localhost:8000/api/v1/deep-analysis",
        json={"product_id": "TEST123", "analysis_type": "underperformance"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "report" in data
    assert "recommendations" in data["report"]
```

#### 7.2 Performance Testing
```bash
# Load testing with Apache Bench
ab -n 100 -c 10 http://localhost:8000/api/v1/quick-insight

# Expected: <30s response time for 90% of requests
```

### Deliverables
- ✅ All tests passing
- ✅ No critical bugs
- ✅ Performance targets met

### Time Estimate: 2 hours

---

## Phase 8: Documentation & Demo (Hours 22-24)

### Objectives
- Create README
- Prepare demo
- Record video
- Deploy

### Tasks

#### 8.1 README Creation
```bash
# See README.md template in repository
```

#### 8.2 Demo Script
**5-Minute Demo Flow**:
```
1. [30s] Quick Insight Demo
   - "What are the top complaints for this product?"
   - Show fast response with breakdown

2. [2min] Deep Analysis Demo
   - "Why is this product underperforming?"
   - Display structured report with recommendations

3. [1min] Memory System Demo
   - "Optimize for margins"
   - Ask follow-up, show adapted response

4. [1min] Opportunity Detection
   - Show auto-detected market gaps
   - Display confidence scores

5. [30s] Cost & Transparency
   - Show cost tracker
   - Explain confidence breakdown
```

#### 8.3 Video Recording
```bash
# Use OBS Studio or Loom
# Record:
# 1. Full demo flow (5 min)
# 2. Code walkthrough (3 min)
# 3. Architecture explanation (2 min)
```

#### 8.4 Deployment (Optional)
```bash
# Backend: Railway/Render
railway login
railway init
railway up

# Frontend: Vercel
vercel login
vercel --prod
```

### Deliverables
- ✅ Complete README
- ✅ Demo video recorded
- ✅ PPT presentation ready
- ✅ GitHub repository polished

### Time Estimate: 2 hours

---

## Success Checklist

### Technical
- [ ] All ML models functional (sentiment, complaints, embeddings)
- [ ] Qdrant vector DB operational
- [ ] LangGraph agents working
- [ ] FastAPI endpoints responding
- [ ] Frontend UI complete
- [ ] Integration tests passing

### Features
- [ ] Quick Mode (<30s)
- [ ] Deep Mode (<3min)
- [ ] Memory system
- [ ] Confidence scoring
- [ ] Cost tracking
- [ ] Opportunity detection

### Deliverables
- [ ] GitHub repository
- [ ] README.md
- [ ] Demo video
- [ ] PPT presentation
- [ ] Deployment (bonus)

### Judge Appeal
- [ ] Production-ready architecture
- [ ] Clear business value
- [ ] Professional UI/UX
- [ ] Comprehensive documentation
- [ ] Working live demo

---

## Risk Mitigation

### Common Issues & Solutions

**Issue**: Dataset download fails
**Solution**: Use mock data generator

**Issue**: Qdrant setup complex
**Solution**: Use in-memory mode for demo

**Issue**: Frontend generation takes long
**Solution**: Build basic dashboard manually with Shadcn templates

**Issue**: LLM API rate limits
**Solution**: Implement caching, use smaller models for testing

**Issue**: Time running out
**Solution**: Prioritize Quick Mode + 1 Deep Analysis type, skip bonus features

---

## Post-Hackathon Enhancements

1. **Fine-tune models** on e-commerce data
2. **Add more data sources** (social media, search trends)
3. **Implement A/B testing** for recommendations
4. **Add voice interface**
5. **Build mobile app**
6. **Multi-language support**
7. **Real-time monitoring dashboard**
8. **Automated report scheduling**
