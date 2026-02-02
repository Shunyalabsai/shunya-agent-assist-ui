import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FeatureFlagConfig } from '@/features/configuration/types';
import type { Version } from '@/components/layout/VersionHistoryPanel';
import type { AuditTrailEntry } from '@/components/layout/AuditTrailViewer';

interface FeatureFlagsState {
    features: FeatureFlagConfig[];
    versions: Version[];
    auditEntries: AuditTrailEntry[];
    setFeatures: (features: FeatureFlagConfig[]) => void;
    setVersions: (versions: Version[]) => void;
    setAuditEntries: (entries: AuditTrailEntry[]) => void;
    toggleFeature: (id: string, enabled: boolean) => void;
    updateFeature: (id: string, feature: Partial<FeatureFlagConfig>) => void;
    getEnabledFeatures: () => FeatureFlagConfig[];
    getFeaturesByCategory: (category: string) => FeatureFlagConfig[];
    isFeatureEnabled: (key: string) => boolean;
    resetToDefaults: () => void;
}

export const useFeatureFlags = create<FeatureFlagsState>()(
    persist(
        (set, get) => ({
            features: [],
            versions: [],
            auditEntries: [],
            setFeatures: (features) => set({ features }),
            setVersions: (versions) => set({ versions }),
            setAuditEntries: (entries) => set({ auditEntries: entries }),
            toggleFeature: (id, enabled) =>
                set((state) => ({
                    features: state.features.map((f) =>
                        f.id === id ? { ...f, enabled } : f
                    ),
                })),
            updateFeature: (id, feature) =>
                set((state) => ({
                    features: state.features.map((f) =>
                        f.id === id ? { ...f, ...feature } : f
                    ),
                })),
            getEnabledFeatures: () => get().features.filter((f) => f.enabled),
            getFeaturesByCategory: (category) =>
                get().features.filter((f) => f.category === category),
            isFeatureEnabled: (key) => {
                const feature = get().features.find((f) => f.key === key);
                return feature?.enabled ?? false;
            },
            resetToDefaults: () =>
                set((state) => ({
                    features: state.features.map((f) => ({
                        ...f,
                        enabled: f.defaultValue ?? false,
                    })),
                })),
        }),
        {
            name: 'feature-flags-storage',
        }
    )
);
