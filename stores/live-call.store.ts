import { create } from "zustand";

interface CallData {
  id: string;
  duration: number;
  intent?: string;
  sentiment?: "positive" | "neutral" | "negative";
  [key: string]: unknown;
}

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
}));
