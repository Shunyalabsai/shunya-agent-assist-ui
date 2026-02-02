export type DocumentStatus = 'Processing' | 'Active' | 'Failed' | 'Archived';

export interface KnowledgeArticle {
  id: string;
  title: string;
  type: 'pdf' | 'doc' | 'docx' | 'txt';
  process: string;
  queue: string;
  language: string;
  version: string;
  status: DocumentStatus;
  updatedAt: string;
  content?: string; // Optional for list view
  category?: string;
  tags?: string[];
}
