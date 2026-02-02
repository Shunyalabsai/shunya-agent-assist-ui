'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { VersionHistoryPanel, type Version } from '@/components/layout/VersionHistoryPanel';
import { AuditTrailViewer, type AuditTrailEntry } from '@/components/layout/AuditTrailViewer';
import type { FeatureFlagConfig } from '../types';

export interface FeatureToggleMatrixProps {
  features?: FeatureFlagConfig[];
  versions?: Version[];
  auditEntries?: AuditTrailEntry[];
  onToggle?: (featureId: string, enabled: boolean) => void;
  onSave?: () => void;
  isProcessing?: boolean;
}

export function FeatureToggleMatrix({
  features = [],
  versions = [],
  auditEntries = [],
  onToggle,
  onSave,
  isProcessing = false,
}: FeatureToggleMatrixProps) {
  const [localFeatures, setLocalFeatures] = useState<FeatureFlagConfig[]>(features);

  const handleToggle = (featureId: string, enabled: boolean) => {
    setLocalFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled } : f))
    );
    if (onToggle) {
      onToggle(featureId, enabled);
    } else {
      console.log('Toggle feature:', featureId, enabled);
      // TODO: Implement toggle functionality
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      console.log('Save feature flags:', localFeatures);
      // TODO: Implement save functionality
    }
  };

  const groupedFeatures = localFeatures.reduce(
    (acc, feature) => {
      const category = feature.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(feature);
      return acc;
    },
    {} as Record<string, FeatureFlagConfig[]>
  );

  const categoryLabels: Record<string, string> = {
    'real-time': 'Real-Time Features',
    analytics: 'Analytics & Reporting',
    ai: 'AI & Machine Learning',
    automation: 'Automation',
    other: 'Other Features',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Feature Flags ({localFeatures.length})</CardTitle>
                <CardDescription>
                  Enable or disable features for your organization
                </CardDescription>
              </div>
              <Button onClick={handleSave} size="sm" disabled={isProcessing}>
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <Save className="size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {localFeatures.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No feature flags configured.
              </p>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      {categoryLabels[category] || category}
                    </h3>
                    <div className="space-y-3">
                      {categoryFeatures.map((feature) => (
                        <div
                          key={feature.id}
                          className="flex items-start justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{feature.name}</h4>
                              {feature.enabled ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                  Enabled
                                </span>
                              ) : (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                  Disabled
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                            <span className="text-xs text-muted-foreground font-mono">
                              {feature.key}
                            </span>
                          </div>
                          <div className="flex items-center ml-4">
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={(checked) => handleToggle(feature.id, checked)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <VersionHistoryPanel
          resourceId="feature-flags"
          resourceType="feature flags"
          versions={versions}
          onRollback={(versionId) => {
            console.log('Rollback to version:', versionId);
            // TODO: Implement rollback
          }}
        />
        <AuditTrailViewer
          resourceId="feature-flags"
          resourceType="feature flags"
          entries={auditEntries}
          limit={5}
        />
      </div>
    </div>
  );
}
