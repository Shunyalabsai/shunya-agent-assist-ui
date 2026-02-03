export interface MonitoredCall {
  id: string;
  agentId: string;
  startTime: string;
  status: "active" | "ended";
  metrics?: CallMetrics;
}

export interface CallMetrics {
  sentiment?: "positive" | "neutral" | "negative" | "warning";
  intent?: string;
  duration: number;
}
