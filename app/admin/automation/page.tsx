'use client';

import { useState } from 'react';
import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { WebhookConfigForm } from '@/features/configuration/components/WebhookConfigForm';
import { AutomationList } from '@/features/automation/components/AutomationList';
import { AutomationForm } from '@/features/automation/components/AutomationForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import type { WebhookConfig } from '@/features/configuration/types';
import type { Version } from '@/components/layout/VersionHistoryPanel';
import type { AuditTrailEntry } from '@/components/layout/AuditTrailViewer';
import type { Automation } from '@/features/automation/types';

// Mock data for Webhooks
const mockWebhooks: WebhookConfig[] = [
  {
    id: 'webhook1',
    name: 'Production Webhook',
    url: 'https://api.example.com/webhooks/calls',
    events: ['call.started', 'call.ended', 'call.transcribed'],
    headers: {
      'Authorization': 'Bearer token123',
      'X-Custom-Header': 'value',
    },
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'webhook2',
    name: 'Analytics Webhook',
    url: 'https://analytics.example.com/events',
    events: ['intent.detected', 'sentiment.changed', 'session.completed'],
    headers: {
      'X-API-Key': 'analytics-key-456',
    },
    active: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'webhook3',
    name: 'Compliance Alert Webhook',
    url: 'https://compliance.example.com/alerts',
    events: ['compliance.alert'],
    headers: {},
    active: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

const mockVersions: Version[] = [
  {
    id: 'v1',
    version: '1.0',
    createdAt: new Date().toISOString(),
    createdBy: 'admin@example.com',
    changes: ['Initial webhook configuration', 'Added 3 webhooks'],
    isCurrent: true,
  },
];

const mockAuditEntries: AuditTrailEntry[] = [
  {
    id: 'audit1',
    action: 'created',
    userId: 'user1',
    userName: 'admin@example.com',
    timestamp: new Date().toISOString(),
    details: 'Created webhook: Production Webhook',
    metadata: { webhookId: 'webhook1', url: 'https://api.example.com/webhooks/calls' },
  },
  {
    id: 'audit2',
    action: 'updated',
    userId: 'user1',
    userName: 'admin@example.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Updated webhook: Analytics Webhook',
    metadata: { webhookId: 'webhook2', changes: ['Added new event'] },
  },
];

// Mock data for Automations
const initialAutomations: Automation[] = [
  {
    id: 'auto1',
    name: 'Post-Call Survey',
    description: 'Send survey when call result is "Sale"',
    active: true,
    trigger: {
      type: 'CALL_OUTCOME',
      config: { value: 'sale', label: 'Sale Made' }
    },
    actions: [
      {
        id: 'act1',
        type: 'WEBHOOK',
        config: { webhookUrl: 'https://surveys.example.com/send' }
      }
    ],
    lastRun: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'auto2',
    name: 'Compliance Alert Ticket',
    description: 'Create Jira ticket on compliance violation',
    active: true,
    trigger: {
      type: 'COMPLIANCE_EVENT',
      config: { value: 'violation', label: 'Violation' }
    },
    actions: [
      {
        id: 'act2',
        type: 'TICKET_CREATION',
        config: { targetSystem: 'Jira' }
      }
    ],
    createdAt: new Date().toISOString(),
  }
];

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState('automations');
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
  const [isAutomationFormOpen, setIsAutomationFormOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);

  const handleCreateAutomation = () => {
    setEditingAutomation(null);
    setIsAutomationFormOpen(true);
  };

  const handleEditAutomation = (automation: Automation) => {
    setEditingAutomation(automation);
    setIsAutomationFormOpen(true);
  };

  const handleSaveAutomation = (automationData: any) => {
    if (editingAutomation) {
      setAutomations(prev => prev.map(a =>
        a.id === editingAutomation.id ? { ...a, ...automationData } : a
      ));
    } else {
      const newAutomation = {
        ...automationData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };
      setAutomations(prev => [...prev, newAutomation]);
    }
  };

  const handleDeleteAutomation = (id: string) => {
    if (confirm('Are you sure you want to delete this automation?')) {
      setAutomations(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleToggleStatus = (id: string, active: boolean) => {
    setAutomations(prev => prev.map(a =>
      a.id === id ? { ...a, active } : a
    ));
  };

  return (
    <div className="space-y-6">
      <ConfigHeader
        title="Automation & Webhooks"
        description="Configure automated workflows and webhook integrations"
        actions={
          activeTab === 'automations' ? (
            <Button onClick={handleCreateAutomation} className="gap-2">
              <Plus className="size-4" />
              Create Automation
            </Button>
          ) : (
            <Button variant="outline" size="sm">
              View Documentation
            </Button>
          )
        }
      />

      <Tabs
        defaultValue="automations"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="automations" className="space-y-4">
          <AutomationList
            automations={automations}
            onEdit={handleEditAutomation}
            onDelete={handleDeleteAutomation}
            onToggleStatus={handleToggleStatus}
          />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhookConfigForm
            webhooks={mockWebhooks}
            versions={mockVersions}
            auditEntries={mockAuditEntries}
          />
        </TabsContent>
      </Tabs>

      <AutomationForm
        open={isAutomationFormOpen}
        onOpenChange={setIsAutomationFormOpen}
        automation={editingAutomation}
        onSave={handleSaveAutomation}
      />
    </div>
  );
}
