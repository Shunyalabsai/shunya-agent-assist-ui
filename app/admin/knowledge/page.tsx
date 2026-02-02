'use client';

import { useState } from 'react';
import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { KnowledgeManagement } from '@/features/knowledge/components/KnowledgeManagement';
import { Button } from '@/components/ui/button';
import type { KnowledgeArticle } from '@/features/knowledge/types';
import type { Version } from '@/components/layout/VersionHistoryPanel';
import type { AuditTrailEntry } from '@/components/layout/AuditTrailViewer';

// Mock data for demonstration
const mockDocuments: KnowledgeArticle[] = [
  {
    id: '1',
    title: 'Customer Service SOP',
    content: 'Standard operating procedures for customer service interactions...',
    category: 'SOP',
    tags: ['customer-service', 'procedures'],
    type: 'pdf',
    process: 'Customer Support',
    queue: 'General Inquiries',
    language: 'en',
    version: '1.0',
    status: 'Active',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Product Knowledge Base',
    content: 'Comprehensive guide to our product offerings and features...',
    category: 'Knowledge Base',
    tags: ['products', 'features'],
    type: 'doc',
    process: 'Sales',
    queue: 'Outbound Sales',
    language: 'en',
    version: '2.1',
    status: 'Active',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Refund Policy',
    content: 'Detailed refund policy for all regions...',
    category: 'SOP',
    tags: ['refund', 'policy'],
    type: 'pdf',
    process: 'Customer Support',
    queue: 'Premium Support',
    language: 'es',
    version: '1.0',
    status: 'Archived',
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: '4',
    title: 'Compliance Guidelines',
    content: 'Regulatory compliance for financial products...',
    category: 'Governance',
    tags: ['compliance', 'legal'],
    type: 'docx',
    process: 'All',
    queue: 'All',
    language: 'en',
    version: '3.0',
    status: 'Processing',
    updatedAt: new Date().toISOString(),
  },
];

const mockVersions: Version[] = [
  {
    id: 'v1',
    version: '1.0',
    createdAt: new Date().toISOString(),
    createdBy: 'admin@example.com',
    changes: ['Initial version', 'Added customer service guidelines'],
    isCurrent: true,
  },
  {
    id: 'v2',
    version: '0.9',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'admin@example.com',
    changes: ['Draft version'],
  },
];

const mockAuditEntries: AuditTrailEntry[] = [
  {
    id: 'audit1',
    action: 'created',
    userId: 'user1',
    userName: 'admin@example.com',
    timestamp: new Date().toISOString(),
    details: 'Document created: Customer Service SOP',
    metadata: { documentId: '1', title: 'Customer Service SOP' },
  },
  {
    id: 'audit2',
    action: 'updated',
    userId: 'user1',
    userName: 'admin@example.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'Document updated: Product Knowledge Base',
    metadata: { documentId: '2', changes: ['Added new product section'] },
  },
];

export default function KnowledgePage() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <ConfigHeader
        title="Knowledge Management"
        description="Manage your knowledge base documents, SOPs, and version history"
        actions={
          <Button variant="default" onClick={() => setIsUploadModalOpen(true)}>
            Upload Document
          </Button>
        }
      />

      <KnowledgeManagement
        documents={mockDocuments}
        versions={mockVersions}
        auditEntries={mockAuditEntries}
        isUploadModalOpen={isUploadModalOpen}
        onUploadModalOpenChange={setIsUploadModalOpen}
      />
    </div>
  );
}
