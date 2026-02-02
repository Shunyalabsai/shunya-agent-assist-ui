import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { KnowledgeArticle } from '@/features/knowledge/types';
import type { Version } from '@/components/layout/VersionHistoryPanel';
import type { AuditTrailEntry } from '@/components/layout/AuditTrailViewer';

interface KnowledgeState {
    documents: KnowledgeArticle[];
    versions: Version[];
    auditEntries: AuditTrailEntry[];
    setDocuments: (documents: KnowledgeArticle[]) => void;
    setVersions: (versions: Version[]) => void;
    setAuditEntries: (entries: AuditTrailEntry[]) => void;
    addDocument: (document: KnowledgeArticle) => void;
    updateDocument: (id: string, document: Partial<KnowledgeArticle>) => void;
    deleteDocument: (id: string) => void;
    getDocumentsByCategory: (category: string) => KnowledgeArticle[];
    getDocumentsByTag: (tag: string) => KnowledgeArticle[];
    searchDocuments: (query: string) => KnowledgeArticle[];
}

export const useKnowledge = create<KnowledgeState>()(
    persist(
        (set, get) => ({
            documents: [],
            versions: [],
            auditEntries: [],
            setDocuments: (documents) => set({ documents }),
            setVersions: (versions) => set({ versions }),
            setAuditEntries: (entries) => set({ auditEntries: entries }),
            addDocument: (document) =>
                set((state) => ({ documents: [...state.documents, document] })),
            updateDocument: (id, document) =>
                set((state) => ({
                    documents: state.documents.map((d) =>
                        d.id === id ? { ...d, ...document } : d
                    ),
                })),
            deleteDocument: (id) =>
                set((state) => ({
                    documents: state.documents.filter((d) => d.id !== id),
                })),
            getDocumentsByCategory: (category) =>
                get().documents.filter((d) => d.category === category),
            getDocumentsByTag: (tag) =>
                get().documents.filter((d) => d.tags?.includes(tag) ?? false),
            searchDocuments: (query) => {
                const lowerQuery = query.toLowerCase();
                return get().documents.filter(
                    (d) =>
                        d.title.toLowerCase().includes(lowerQuery) ||
                        (d.content?.toLowerCase().includes(lowerQuery) ?? false) ||
                        (d.tags?.some((t) => t.toLowerCase().includes(lowerQuery)) ?? false)
                );
            },
        }),
        {
            name: 'knowledge-storage',
        }
    )
);
