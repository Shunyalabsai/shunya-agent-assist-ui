import { NextResponse } from 'next/server';
import type { Alert } from '@/types/manager';

/** Mock recent alerts. In production: PostgreSQL audit_logs, real-time via WebSocket. */
function getMockAlerts(): Alert[] {
  const now = Date.now();
  return [
    {
      id: '1',
      severity: 'critical',
      type: 'Escalation Detected',
      agentName: 'Mike P.',
      agentId: 'agent-1',
      sessionId: 'session-1',
      timestamp: now - 30 * 1000,
      message: 'Customer requested immediate supervision',
    },
    {
      id: '2',
      severity: 'warning',
      type: 'Negative Sentiment',
      agentName: 'John D.',
      agentId: 'agent-2',
      sessionId: 'session-2',
      timestamp: now - 5 * 60 * 1000,
      message: 'Sentiment analysis detected high frustration',
    },
    {
      id: '3',
      severity: 'info',
      type: 'Upskill Opportunity',
      agentName: 'Sarah L.',
      agentId: 'agent-3',
      sessionId: 'session-3',
      timestamp: now - 15 * 60 * 1000,
      message: 'Handling complex objection effectively',
    },
    {
      id: '4',
      severity: 'success',
      type: 'High Performance',
      agentName: 'Emma W.',
      agentId: 'agent-4',
      sessionId: 'session-4',
      timestamp: now - 45 * 60 * 1000,
      message: '100% CSAT on last 5 calls',
    },
    {
      id: '5',
      severity: 'info',
      type: 'Knowledge Gap',
      agentName: 'Mike P.',
      agentId: 'agent-1',
      sessionId: 'session-5',
      timestamp: now - 2 * 60 * 60 * 1000,
      message: 'Long pause detected during product explanation',
    },
    {
      id: '6',
      severity: 'warning',
      type: 'Compliance Risk',
      agentName: 'David K.',
      agentId: 'agent-5',
      sessionId: 'session-6',
      timestamp: now - 4 * 60 * 60 * 1000,
      message: 'Missed mandatory disclosure statement',
    },
  ];
}

export async function GET() {
  const alerts = getMockAlerts();
  return NextResponse.json({ alerts });
}
