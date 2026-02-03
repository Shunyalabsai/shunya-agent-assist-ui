// Manager-specific types

export interface KPIMetrics {
  sessions: {
    total: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  sentiment: {
    score: number;
    change?: number;
    trend: 'up' | 'down' | 'stable';
  };
  csat: {
    score: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
  sop: {
    percentage: number;
    change?: number;
    trend: 'up' | 'down' | 'stable';
  };
  /** Kept for agent detail and other views */
  fcr?: {
    rate: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface SentimentDataPoint {
  date: string;
  positive: number;
  neutral: number;
  negative: number;
}

/** Call volume per time bucket for trends chart (hourly or daily). */
export interface CallVolumeBucket {
  bucket: string;
  volume: number;
}

export interface IntentDistribution {
  intent: string;
  count: number;
  percentage: number;
}

export interface AgentLeaderboardEntry {
  agentId: string;
  agentName: string;
  sessions: number;
  csat: number;
  fcr: number;
  avgHandleTime: number;
  rank: number;
}

export interface SOPAdherenceMetrics {
  overall: number;
  byCategory: {
    category: string;
    score: number;
  }[];
  trend: number;
}

export interface UpsellMetrics {
  opportunities: number;
  conversions: number;
  revenue: number;
  conversionRate: number;
  avgValue: number;
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  email: string;
  avatar?: string;
  summary: {
    totalSessions: number;
    avgCSAT: number;
    avgFCR: number;
    avgHandleTime: number;
    totalUpsells: number;
  };
  trends: {
    date: string;
    csat: number;
    fcr: number;
    handleTime: number;
  }[];
  qaCompliance: {
    score: number;
    totalEvaluations: number;
    passed: number;
    failed: number;
    details: {
      date: string;
      score: number;
      evaluator: string;
      notes?: string;
    }[];
  };
  upsellPerformance: {
    date: string;
    opportunities: number;
    conversions: number;
    revenue: number;
  }[];
}

export interface SessionFilters {
  dateFrom?: string;
  dateTo?: string;
  agentId?: string;
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'warning';
  status?: 'active' | 'completed' | 'cancelled';
  search?: string;
}

export interface SessionDetail {
  id: string;
  agentId: string;
  agentName: string;
  customerId?: string;
  customerName?: string;
  startTime: string;
  endTime?: string;
  duration: number;
  status: 'active' | 'completed' | 'cancelled';
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'warning';
  summary?: string;
  transcript?: string;
  metadata: {
    channel: string;
    queue?: string;
    tags?: string[];
  };
  metrics: {
    csat?: number;
    fcr: boolean;
    handleTime: number;
    talkTime: number;
    holdTime: number;
  };
  sentimentTimeline: {
    timestamp: number;
    sentiment: 'positive' | 'neutral' | 'negative' | 'warning';
    confidence: number;
  }[];
  qaMetrics: {
    score: number;
    evaluator?: string;
    evaluatedAt?: string;
    criteria: {
      name: string;
      score: number;
      maxScore: number;
      notes?: string;
    }[];
  };
  coachingInsights: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
  upsellAnalysis: {
    opportunities: number;
    attempted: number;
    successful: number;
    revenue?: number;
    details: {
      timestamp: number;
      product: string;
      status: 'opportunity' | 'attempted' | 'successful' | 'declined';
      value?: number;
    }[];
  };
}

/** Recent alert for manager overview (WebSocket alert.* or REST from audit_logs). */
export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  type: string;
  agentName: string;
  agentId?: string;
  sessionId?: string;
  timestamp: number;
  message?: string;
}

export interface LiveCall {
  id: string;
  agentId: string;
  agentName: string;
  customerId?: string;
  customerName?: string;
  startTime: string;
  duration: number;
  intent?: string;
  sentiment?: 'positive' | 'neutral' | 'negative' | 'warning';
  riskFlags: {
    type: 'sentiment' | 'duration' | 'escalation' | 'compliance';
    severity: 'low' | 'medium' | 'high';
    message: string;
  }[];
  status: 'active' | 'on-hold' | 'transferring';
}

export interface IntelligenceInsights {
  rootCauses: {
    category: string;
    count: number;
    percentage: number;
    examples: string[];
  }[];
  failureReasons: {
    reason: string;
    frequency: number;
    impact: 'low' | 'medium' | 'high';
    affectedAgents: string[];
  }[];
  trainingRecommendations: {
    agentId?: string;
    agentName?: string;
    area: string;
    priority: 'low' | 'medium' | 'high';
    description: string;
    suggestedTraining: string[];
  }[];
}
