'use client';

import * as React from 'react';
import {
  AgentSelector,
  PerformanceSummary,
  TrendCharts,
  QAComplianceTable,
  UpsellPerformanceChart,
  useAgentPerformance,
} from '@/features/dashboards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentsPage() {
  const [selectedAgentId, setSelectedAgentId] = React.useState<string>('');
  const [agents, setAgents] = React.useState<Array<{ id: string; name: string; email: string }>>([]);
  const { data: performance, loading } = useAgentPerformance(selectedAgentId);

  React.useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch('/api/manager/agents');
        if (response.ok) {
          const data = await response.json();
          setAgents(data.agents || []);
          if (data.agents && data.agents.length > 0 && !selectedAgentId) {
            setSelectedAgentId(data.agents[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      }
    }
    fetchAgents();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agent Performance</h1>
        <p className="text-muted-foreground mt-1">
          Analyze individual agent performance metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Agent</CardTitle>
          <CardDescription>Choose an agent to view detailed performance</CardDescription>
        </CardHeader>
        <CardContent>
          <AgentSelector
            agents={agents}
            value={selectedAgentId}
            onValueChange={setSelectedAgentId}
            placeholder="Select an agent..."
            className="w-full max-w-lg"
          />
        </CardContent>
      </Card>

      {selectedAgentId && (
        <>
          {loading ? (
            <div className="space-y-6">
              <PerformanceSummary />
              <TrendCharts />
              <QAComplianceTable />
              <UpsellPerformanceChart />
            </div>
          ) : performance ? (
            <div className="space-y-6">
              <PerformanceSummary data={performance.summary} />
              <TrendCharts data={performance.trends} />
              <QAComplianceTable data={performance.qaCompliance} />
              <UpsellPerformanceChart data={performance.upsellPerformance} />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
