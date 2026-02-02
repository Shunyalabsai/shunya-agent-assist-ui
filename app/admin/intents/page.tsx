'use client';

import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { IntentListTable } from '@/features/configuration/components/IntentListTable';
import { Button } from '@/components/ui/button';
import type { Intent } from '@/features/configuration/types';

// Mock data for demonstration
const mockIntents: Intent[] = [
  {
    id: 'intent1',
    name: 'Customer Support Request',
    description: 'Customer needs help with a product or service issue',
    keywords: ['help', 'support', 'issue', 'problem', 'assistance'],
    confidenceThreshold: 0.75,
    enabled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'intent2',
    name: 'Product Inquiry',
    description: 'Customer is asking about product features or pricing',
    keywords: ['product', 'feature', 'price', 'cost', 'information'],
    confidenceThreshold: 0.7,
    enabled: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'intent3',
    name: 'Billing Question',
    description: 'Customer has questions about billing or payment',
    keywords: ['billing', 'payment', 'invoice', 'charge', 'bill'],
    confidenceThreshold: 0.8,
    enabled: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];



export default function IntentsPage() {
  const handleImport = () => {
    // TODO: Implement file upload/import logic
    console.log('Import intents clicked');
  };

  const handleApproveAndActivate = () => {
    // TODO: Implement approval logic
    console.log('Approve & Activate clicked');
  };

  return (
    <div className="space-y-6">
      <ConfigHeader
        title="Intent Configuration"
        description="Configure call intents and their detection parameters for better call routing and analysis"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleImport}>
              Import Intents
            </Button>
            <Button size="sm" onClick={handleApproveAndActivate}>
              Approve & Activate
            </Button>
          </div>
        }
      />

      <IntentListTable data={mockIntents} />
    </div>
  );
}
