'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { FeatureToggleMatrix } from '@/features/configuration/components/FeatureToggleMatrix';
import { Button } from '@/components/ui/button';
import type { FeatureFlagConfig } from '@/features/configuration/types';
import type { Version } from '@/components/layout/VersionHistoryPanel';
import type { AuditTrailEntry } from '@/components/layout/AuditTrailViewer';
import { FEATURE_FLAGS } from '@/lib/feature-flags/flags';


// Mock data for demonstration
const initialFeatures: FeatureFlagConfig[] = [
  {
    id: 'feat1',
    key: FEATURE_FLAGS.LIVE_SENTIMENT,
    name: 'Live Sentiment Analysis',
    description: 'Real-time sentiment analysis during live calls',
    category: 'real-time',
    enabled: true,
    defaultValue: true,
  },
  {
    id: 'feat2',
    key: FEATURE_FLAGS.UPSELL_PROMPTS,
    name: 'Upsell Prompts',
    description: 'AI-powered upsell suggestions during calls',
    category: 'ai',
    enabled: true,
    defaultValue: true,
  },
  {
    id: 'feat3',
    key: FEATURE_FLAGS.AI_CHAT_ASSISTANT,
    name: 'AI Chat Assistant',
    description: 'AI-powered chat assistant for agents',
    category: 'ai',
    enabled: false,
    defaultValue: false,
  },
  {
    id: 'feat4',
    key: FEATURE_FLAGS.LIVE_MONITORING,
    name: 'Live Call Monitoring',
    description: 'Real-time monitoring dashboard for managers',
    category: 'real-time',
    enabled: true,
    defaultValue: true,
  },
  {
    id: 'feat5',
    key: FEATURE_FLAGS.ADVANCED_ANALYTICS,
    name: 'Advanced Analytics',
    description: 'Advanced analytics and reporting features',
    category: 'analytics',
    enabled: false,
    defaultValue: false,
  },
  {
    id: 'feat6',
    key: FEATURE_FLAGS.POST_CALL_TRANSCRIPTION,
    name: 'Post-call Transcription',
    description: 'Automated transcription after call completion',
    category: 'analytics',
    enabled: true,
    defaultValue: true,
  },
  {
    id: 'feat7',
    key: FEATURE_FLAGS.LIVE_INTENT_DETECTION,
    name: 'Live Intent Detection',
    description: 'Real-time detection of customer intent',
    category: 'real-time',
    enabled: false,
    defaultValue: false,
  },
  {
    id: 'feat8',
    key: FEATURE_FLAGS.COMPLIANCE_MONITORING,
    name: 'Compliance Monitoring',
    description: 'Automated compliance checks',
    category: 'other',
    enabled: true,
    defaultValue: true,
  },
  {
    id: 'feat9',
    key: FEATURE_FLAGS.MANAGER_DASHBOARDS,
    name: 'Manager Dashboards',
    description: 'Specialized dashboards for managers',
    category: 'analytics',
    enabled: true,
    defaultValue: true,
  },
];

const mockVersions: Version[] = [
  {
    id: 'v1',
    version: '1.0',
    createdAt: new Date().toISOString(),
    createdBy: 'admin@example.com',
    changes: ['Initial feature flag configuration'],
    isCurrent: true,
  },
];

const mockAuditEntries: AuditTrailEntry[] = [
  {
    id: 'audit1',
    action: 'enabled',
    userId: 'user1',
    userName: 'admin@example.com',
    timestamp: new Date().toISOString(),
    details: 'Enabled feature: Live Sentiment Analysis',
    metadata: { featureId: 'feat1', featureKey: FEATURE_FLAGS.LIVE_SENTIMENT },
  },
  {
    id: 'audit2',
    action: 'disabled',
    userId: 'user1',
    userName: 'admin@example.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Disabled feature: Advanced Analytics',
    metadata: { featureId: 'feat5', featureKey: FEATURE_FLAGS.ADVANCED_ANALYTICS },
  },
];

export default function FeaturesPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [features, setFeatures] = useState(initialFeatures);

  const handleToggle = (featureId: string, enabled: boolean) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled } : f))
    );
  };

  const handleSave = async () => {
    setIsProcessing(true);
    // Simulate backend validation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    // In a real app, show a toast here
    console.log('Changes saved!', features);
  };

  return (
    <div className="space-y-6">
      <ConfigHeader
        title="Feature Enablement"
        description="Enable or disable features for your organization. Changes take effect after ingest/validation cycle."
        actions={
          <Button variant="outline" size="sm">
            <RotateCcw className="size-4" />
            Reset to Defaults
          </Button>
        }
      />

      <FeatureToggleMatrix
        features={features}
        versions={mockVersions}
        auditEntries={mockAuditEntries}
        onToggle={handleToggle}
        onSave={handleSave}
        isProcessing={isProcessing}
      />
    </div>
  );
}
