import type { AvailableWidget } from '../types';

export const mockAvailableWidgets: AvailableWidget[] = [
    {
        id: 'widget1',
        type: 'kpi-card',
        name: 'Active Sessions',
        description: 'Total number of active sessions',
        category: 'metrics',
    },
    {
        id: 'widget2',
        type: 'kpi-card',
        name: 'CSAT Score',
        description: 'Customer satisfaction score',
        category: 'metrics',
    },
    {
        id: 'widget3',
        type: 'kpi-card',
        name: 'Avg Resolution',
        description: 'Average resolution time',
        category: 'metrics',
    },
    {
        id: 'widget4',
        type: 'line-chart',
        name: 'Sentiment Trend',
        description: 'Sentiment trends over time',
        category: 'charts',
    },
    {
        id: 'widget5',
        type: 'pie-chart',
        name: 'Intent Distribution',
        description: 'Distribution of call intents',
        category: 'charts',
    },
    {
        id: 'widget6',
        type: 'bar-chart',
        name: 'Agent Performance',
        description: 'Performance metrics by agent',
        category: 'charts',
    },
    {
        id: 'widget7',
        type: 'data-table',
        name: 'Top Automations',
        description: 'Top performing automations',
        category: 'tables',
    },
    {
        id: 'widget8',
        type: 'data-table',
        name: 'SOP Adherence',
        description: 'SOP adherence scores',
        category: 'tables',
    },
    {
        id: 'widget9',
        type: 'kpi-card',
        name: 'Automation Rate',
        description: 'Automation rate percentage',
        category: 'metrics',
    },
];
