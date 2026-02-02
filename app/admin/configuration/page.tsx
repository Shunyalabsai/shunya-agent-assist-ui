'use client';

import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { DashboardFieldSelector } from '@/features/dashboards/components/DashboardFieldSelector';
import { Button } from '@/components/ui/button';
import { useDashboardConfig } from '@/stores/use-dashboard-config';
import type { AvailableWidget } from '@/features/dashboards/types';
import type { Version } from '@/components/layout/VersionHistoryPanel';
import type { AuditTrailEntry } from '@/components/layout/AuditTrailViewer';

import { mockAvailableWidgets } from '@/features/dashboards/data/mock-widgets';


const mockVersions: Version[] = [
  {
    id: 'v1',
    version: '1.0',
    createdAt: new Date().toISOString(),
    createdBy: 'admin@example.com',
    changes: ['Initial dashboard configuration', 'Selected widgets'],
    isCurrent: true,
  },
];

const mockAuditEntries: AuditTrailEntry[] = [
  {
    id: 'audit1',
    action: 'configured',
    userId: 'user1',
    userName: 'admin@example.com',
    timestamp: new Date().toISOString(),
    details: 'Updated dashboard widget configuration',
    metadata: { widgets: ['widget1', 'widget2', 'widget4'] },
  },
];

export default function ConfigurationPage() {
  const { selectedWidgets, toggleWidget } = useDashboardConfig();

  const handleReset = () => {
    // TODO: Implement reset to defaults
    console.log('Reset to defaults');
  };

  return (
    <div className="space-y-6">
      <ConfigHeader
        title="Dashboard Configuration"
        description="Configure which widgets and metrics appear on your dashboards"
        actions={
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset to Defaults
          </Button>
        }
      />

      <DashboardFieldSelector
        availableWidgets={mockAvailableWidgets}
        selectedWidgets={selectedWidgets}
        versions={mockVersions}
        auditEntries={mockAuditEntries}
        onWidgetToggle={toggleWidget}
      />
    </div>
  );
}
