export type TriggerType = 'SOP_STEP' | 'CALL_OUTCOME' | 'COMPLIANCE_EVENT';
export type ActionType = 'TICKET_CREATION' | 'CRM_UPDATE' | 'WEBHOOK';

export interface AutomationTrigger {
    type: TriggerType;
    config: {
        // For SOP_STEP: specific step ID or 'any'
        // For CALL_OUTCOME: specific outcome (e.g., 'sale', 'follow_up')
        // For COMPLIANCE_EVENT: specific event
        value: string;
        label?: string; // Human readable label
    };
}

export interface AutomationAction {
    id: string;
    type: ActionType;
    config: {
        // Generic config storage
        targetSystem?: string; // For CRM/Ticket
        webhookUrl?: string;   // For Webhook
        templateId?: string;   // For Ticket/CRM
        headers?: Record<string, string>; // For Webhook
    };
}

export interface Automation {
    id: string;
    name: string;
    description?: string;
    active: boolean;
    trigger: AutomationTrigger;
    actions: AutomationAction[];
    lastRun?: string; // ISO date
    createdAt: string;
}
