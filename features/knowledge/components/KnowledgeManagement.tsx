'use client';

import { VersionHistoryPanel } from '@/components/layout/VersionHistoryPanel';
import { AuditTrailViewer } from '@/components/layout/AuditTrailViewer';
import { DocumentUploader } from './DocumentUploader'; // Keeping this for now if it's used elsewhere, otherwise should be removed or replaced
import { DocumentList } from './DocumentList';
import { UploadDocumentModal, type UploadData } from './UploadDocumentModal';
import type { KnowledgeArticle } from '../types';
import type { Version } from '@/components/layout/VersionHistoryPanel';
import type { AuditTrailEntry } from '@/components/layout/AuditTrailViewer';

export interface KnowledgeManagementProps {
  documents?: KnowledgeArticle[];
  versions?: Version[];
  auditEntries?: AuditTrailEntry[];
  isUploadModalOpen?: boolean;
  onUploadModalOpenChange?: (open: boolean) => void;
}

export function KnowledgeManagement({
  documents = [],
  versions = [],
  auditEntries = [],
  isUploadModalOpen = false,
  onUploadModalOpenChange,
}: KnowledgeManagementProps) {
  const handleUpload = (data: UploadData) => {
    console.log('Upload document:', data);
    // TODO: Implement actual upload logic here
    // For now we just log it. In a real app we'd call an API and then refresh the list.
  };
  const handleView = (id: string) => {
    console.log('View document:', id);
    // TODO: Implement navigation or modal
  };

  const handleEdit = (id: string) => {
    console.log('Edit document:', id);
    // TODO: Implement edit functionality
  };

  const handleDelete = (id: string) => {
    console.log('Delete document:', id);
    // TODO: Implement delete with confirmation
  };

  const handleRollback = (versionId: string) => {
    console.log('Rollback to version:', versionId);
    // TODO: Implement rollback functionality
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6 lg:col-span-2">
        <DocumentList
          documents={documents}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpload={() => onUploadModalOpenChange?.(true)}
        />
        <UploadDocumentModal
          open={!!isUploadModalOpen}
          onOpenChange={onUploadModalOpenChange || (() => { })}
          onUpload={handleUpload}
        />
      </div>
      <div className="space-y-6">
        <VersionHistoryPanel
          resourceId="knowledge-base"
          resourceType="knowledge base"
          versions={versions}
          onRollback={handleRollback}
        />
        <AuditTrailViewer
          resourceId="knowledge-base"
          resourceType="knowledge base"
          entries={auditEntries}
          limit={5}
        />
      </div>
    </div>
  );
}
