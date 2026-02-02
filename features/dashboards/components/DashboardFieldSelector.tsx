'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { VersionHistoryPanel, type Version } from '@/components/layout/VersionHistoryPanel';
import { AuditTrailViewer, type AuditTrailEntry } from '@/components/layout/AuditTrailViewer';
import type { AvailableWidget, Widget } from '../types';

export interface DashboardFieldSelectorProps {
  availableWidgets?: AvailableWidget[];
  selectedWidgets?: Widget[];
  versions?: Version[];
  auditEntries?: AuditTrailEntry[];
  onWidgetToggle?: (widgetId: string, enabled: boolean) => void;
}

export function DashboardFieldSelector({
  availableWidgets = [],
  selectedWidgets = [],
  versions = [],
  auditEntries = [],
  onWidgetToggle,
}: DashboardFieldSelectorProps) {
  const [localSelected, setLocalSelected] = useState<Set<string>>(
    new Set(selectedWidgets.filter(w => w.enabled).map(w => w.id))
  );

  const handleToggle = (widgetId: string, enabled: boolean) => {
    const newSelected = new Set(localSelected);
    if (enabled) {
      newSelected.add(widgetId);
    } else {
      newSelected.delete(widgetId);
    }
    setLocalSelected(newSelected);

    if (onWidgetToggle) {
      onWidgetToggle(widgetId, enabled);
    } else {
      console.log('Toggle widget:', widgetId, enabled);
      // TODO: Implement toggle functionality
    }
  };

  const handleSave = () => {
    console.log('Save dashboard configuration:', Array.from(localSelected));
    // TODO: Implement save functionality
  };

  const groupedWidgets = availableWidgets.reduce(
    (acc, widget) => {
      const category = widget.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(widget);
      return acc;
    },
    {} as Record<string, AvailableWidget[]>
  );

  const categoryLabels: Record<string, string> = {
    metrics: 'Metrics & KPIs',
    charts: 'Charts & Visualizations',
    tables: 'Tables & Lists',
    other: 'Other Widgets',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Dashboard Widgets ({localSelected.size} selected)</CardTitle>
                <CardDescription>
                  Select which widgets to display on your dashboards
                </CardDescription>
              </div>
              <Button onClick={handleSave} size="sm">
                <Save className="size-4" />
                Save Configuration
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availableWidgets.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No widgets available.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedWidgets).map(([category, categoryWidgets]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {categoryLabels[category] || category}
                    </h3>
                    <div className="space-y-3">
                      {categoryWidgets.map((widget) => {
                        const isSelected = localSelected.has(widget.id);
                        return (
                          <div
                            key={widget.id}
                            className={`flex items-start justify-between p-4 border rounded-lg transition-colors border-border/50 hover:bg-muted/50`}
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{widget.name}</h4>
                                {isSelected && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{widget.description}</p>
                              <span className="text-xs text-muted-foreground font-mono">
                                {widget.type}
                              </span>
                            </div>
                            <div className="flex items-center ml-4">
                              <Switch
                                checked={isSelected}
                                onCheckedChange={(checked) => handleToggle(widget.id, checked)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {localSelected.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Widgets Preview</CardTitle>
              <CardDescription>
                Preview of your dashboard configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from(localSelected).map((widgetId) => {
                  const widget = availableWidgets.find(w => w.id === widgetId);
                  return widget ? (
                    <div
                      key={widgetId}
                      className="flex items-center justify-between p-2 border border-border/50 rounded"
                    >
                      <span className="text-sm font-medium">{widget.name}</span>
                      <span className="text-xs text-muted-foreground">{widget.type}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <VersionHistoryPanel
          resourceId="dashboard-config"
          resourceType="dashboard configuration"
          versions={versions}
          onRollback={(versionId) => {
            console.log('Rollback to version:', versionId);
            // TODO: Implement rollback
          }}
        />
        <AuditTrailViewer
          resourceId="dashboard-config"
          resourceType="dashboard configuration"
          entries={auditEntries}
          limit={5}
        />
      </div>
    </div>
  );
}
