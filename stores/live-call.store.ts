import { create } from "zustand";

// Types
export interface SOPStep {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'pending';
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface UpsellOpportunity {
  id: string;
  productName: string;
  description: string;
  confidence: number;
  estimatedValue?: number;
  reason: string;
}

export interface CallData {
  id: string;
  duration: number;
  customerName?: string;
  customerId?: string;
  customerPhone?: string;
  customerDOB?: string;
  isRepeatCaller?: boolean;
  intent?: string;
  confidence?: number;
  sentiment?: "positive" | "neutral" | "negative" | "warning";
  agentSentiment?: "positive" | "neutral" | "negative" | "warning";
  customerSentimentValue?: number;
  agentSentimentValue?: number;
  // Compliance
  complianceStatus?: 'compliant' | 'non-compliant' | 'monitoring';
  complianceIssues?: string[];
  // Features
  sopSteps?: SOPStep[];
  currentStepId?: string;
  suggestedActions?: SuggestedAction[];
  upsellOpportunity?: UpsellOpportunity;
  
  [key: string]: unknown;
}

export const SAMPLE_CALL_DATA: CallData = {
  id: "call-123",
  duration: 45,
  customerName: "Sarah Jenkins",
  customerId: "CUST-8842",
  customerPhone: "+1 (555) 123-4567",
  customerDOB: "1985-04-12",
  isRepeatCaller: true,
  intent: "Billing Dispute",
  confidence: 0.92,
  sentiment: "negative",
  agentSentiment: "neutral",
  customerSentimentValue: 0.3,
  agentSentimentValue: 0.6,
  complianceStatus: "non-compliant",
  complianceIssues: [
    'Missed required disclosure: "Call recording"',
    "Did not verify customer identity with partial DOB",
  ],
  sopSteps: [
    {
      id: "step-1",
      title: "Greet & authenticate",
      description: "Welcome customer and verify identity",
      status: "completed",
    },
    {
      id: "step-2",
      title: "Analyze Bill",
      description: "Review current and previous billing statements",
      status: "current",
    },
    {
      id: "step-3",
      title: "Propose Adjustment",
      description: "Calculate and offer credit if applicable",
      status: "pending",
    },
    {
        id: "step-4",
        title: "Closing",
        description: "Summarize resolution and end call",
        status: "pending",
    }
  ],
  currentStepId: "step-2",
  upsellOpportunity: {
    id: "upsell-1",
    productName: "Premium Fiber Internet",
    description: "Upgrade to 1Gbps speed for only $10 more/month",
    confidence: 0.85,
    estimatedValue: 120,
    reason: "Customer mentioned slow internet and high data usage",
  },
  suggestedActions: [
    {
      id: "action-1",
      title: "Offer Late Fee Waiver",
      description: "Customer eligible for one-time waiver of $15.00",
      priority: "high",
    },
    {
      id: "action-2",
      title: "Check Usage Details",
      description: "Review data usage for the billing period",
      priority: "medium",
    },
  ],
};

export type CallStatus = 'idle' | 'incoming' | 'active' | 'post-call';

interface LiveCallState {
  callData: CallData | null;
  isConnected: boolean;
  callStatus: CallStatus;

  // Actions
  setCallData: (data: CallData) => void;
  setConnected: (connected: boolean) => void;
  setCallStatus: (status: CallStatus) => void;
  incomingCall: (data: Partial<CallData>) => void;
  startCall: () => void;
  endCall: () => void;
  completeCall: () => void;
  reset: () => void;
  loadSampleData: () => void;
}

export const useLiveCallStore = create<LiveCallState>((set) => ({
  callData: null,
  isConnected: false,
  callStatus: 'idle',

  setCallData: (data) => set({ callData: data }),
  setConnected: (connected) => set({ isConnected: connected }),
  setCallStatus: (status) => set({ callStatus: status }),

  incomingCall: (data) => set((state) => ({
    callStatus: 'incoming',
    callData: { ...state.callData, ...data } as CallData
  })),

  startCall: () => set({
    callStatus: 'active',
    // In a real app, we might reset some per-call transient state here
  }),

  endCall: () => set({
    callStatus: 'post-call'
  }),

  completeCall: () => set({
    callStatus: 'idle',
    callData: null
  }),

  reset: () => set({
    callData: null,
    isConnected: false,
    callStatus: 'idle'
  }),
  
  loadSampleData: () => set({
      callStatus: 'active',
      callData: SAMPLE_CALL_DATA
  })
}));
