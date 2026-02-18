"""
API request/response models
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class QuickInsightRequest(BaseModel):
    """Request model for quick insights"""
    product_id: str = Field(..., description="Product identifier")
    query_type: str = Field(
        ..., 
        description="Type of insight: 'complaints', 'sentiment', 'price', 'features'"
    )


class QuickInsightResponse(BaseModel):
    """Response model for quick insights"""
    insights: Dict[str, Any] = Field(..., description="Generated insights")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    cost: float = Field(..., description="API cost in USD")
    tokens: int = Field(..., description="Tokens used")
    processing_time_ms: int = Field(..., description="Processing time in milliseconds")


class DeepAnalysisRequest(BaseModel):
    """Request model for deep analysis"""
    product_id: str = Field(..., description="Product identifier")
    analysis_type: str = Field(
        ...,
        description="Type of analysis: 'underperformance', 'opportunity', 'competitive'"
    )


class AnalysisReport(BaseModel):
    """Structured analysis report"""
    problems: List[str] = Field(default=[], description="Identified problems")
    root_causes: List[str] = Field(default=[], description="Root cause analysis")
    recommendations: List[Dict[str, Any]] = Field(default=[], description="Actionable recommendations")
    opportunities: List[Dict[str, Any]] = Field(default=[], description="Market opportunities")


class DeepAnalysisResponse(BaseModel):
    """Response model for deep analysis"""
    report: AnalysisReport = Field(..., description="Comprehensive analysis report")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")
    cost: float = Field(..., description="API cost in USD")
    tokens: int = Field(..., description="Tokens used")
    processing_time_ms: int = Field(..., description="Processing time in milliseconds")


class UserPreference(BaseModel):
    """User preference for personalization"""
    focus: str = Field(..., description="Business focus: 'margins' or 'growth'")
    marketplace: Optional[str] = Field(None, description="Preferred marketplace")
    category: Optional[str] = Field(None, description="Product category focus")


class MemoryPreferenceRequest(BaseModel):
    """Request to store user preferences"""
    user_id: str = Field(..., description="User identifier")
    preference: UserPreference = Field(..., description="User preferences")


class MemoryPreferenceResponse(BaseModel):
    """Response after storing preferences"""
    success: bool = Field(..., description="Whether storage was successful")
    message: str = Field(..., description="Status message")


class Opportunity(BaseModel):
    """Market opportunity model"""
    type: str = Field(..., description="Opportunity type")
    title: str = Field(..., description="Opportunity title")
    insights: List[str] = Field(..., description="Key insights")
    business_impact: Dict[str, str] = Field(..., description="Business impact metrics")
    recommendation: str = Field(..., description="Recommended action")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")


class OpportunitiesResponse(BaseModel):
    """Response with detected opportunities"""
    opportunities: List[Opportunity] = Field(..., description="List of opportunities")
    total_count: int = Field(..., description="Total opportunities found")
