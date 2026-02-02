'use client';

import * as React from 'react';
import {
  LiveCallHeader,
  IntentBadge,
  SentimentIndicator,
  SOPFlowPanel,
  NextBestActionCard,
  ComplianceStatus,
  UpsellPrompt,
  AgentChatDock,
  IncomingCallOverlay,
  PostCallScreen,
} from '@/features/live-call';
import { useLiveCallStore } from '@/stores/live-call.store';

export default function LiveCallPage() {
  const { callData, callStatus, setCallStatus, incomingCall, startCall, endCall } = useLiveCallStore();

  // Mock data initialization - can be removed when real integration is ready
  React.useEffect(() => {
    // Ensuring we have some default data for testing if needed
    if (!callData && callStatus === 'active') {
      useLiveCallStore.getState().setCallData({
        id: 'call-123',
        duration: 0,
        intent: 'Product Inquiry',
        confidence: 0.85,
        sentiment: 'positive',
        agentSentiment: 'neutral',
        customerSentimentValue: 0.8,
        agentSentimentValue: 0.6,
        complianceStatus: 'non-compliant',
        complianceIssues: [
          'Missed required disclosure: "Call recording"',
          'Did not verify customer identity with partial DOB'
        ],
        sopSteps: [
          {
            id: 'step-1',
            title: 'Greet Customer',
            description: 'Welcome the customer and introduce yourself',
            status: 'completed',
          },
          {
            id: 'step-2',
            title: 'Identify Need',
            description: 'Understand the customer requirement',
            status: 'current',
          },
          {
            id: 'step-3',
            title: 'Provide Solution',
            description: 'Offer appropriate product or service',
            status: 'pending',
          },
        ],
        currentStepId: 'step-2',
        suggestedActions: [
          {
            id: 'action-1',
            title: 'Offer Product Demo',
            description: 'Schedule a product demonstration for the customer',
            priority: 'high',
          },
        ],
      });
    }
  }, [callData, callStatus]);

  const handleActionSelect = (actionId: string) => {
    console.log('Action selected:', actionId);
    // Handle action selection
  };

  const handleSendMessage = (message: string) => {
    console.log('Sending message:', message);
    // Handle message sending
  };

  // DEBUG CONTROLS (Top right for testing)
  const DebugControls = () => (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 p-2 bg-muted/80 rounded border text-xs">
      <button className="px-2 py-1 bg-blue-500 text-white rounded" onClick={() => incomingCall({ customerName: 'Alice Smith', queueName: 'Premium Support' })}>Sim: Incoming</button>
      <button className="px-2 py-1 bg-green-500 text-white rounded" onClick={startCall}>Sim: Answer/Start</button>
      <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={endCall}>Sim: End Call</button>
      <button className="px-2 py-1 bg-gray-500 text-white rounded" onClick={() => setCallStatus('idle')}>Sim: Idle</button>
    </div>
  );

  if (callStatus === 'incoming') {
    return (
      <>
        <DebugControls />
        <IncomingCallOverlay />
        {/* We render the background active screen faintly or just the overlay? 
                 Design doc says "Agent Assist UI auto-opens". 
                 Let's keep the main layout hidden or blurred if we wanted context, 
                 but for now overlay is full screen focus. 
                 Actually, usually agents want to see the main dashboard behind.
                 Let's render the IDLE state behind it for now.
             */}
        <div className="opacity-20 pointer-events-none filter blur-sm h-screen overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-2">Agent Assist</h1>
            <p className="text-muted-foreground">Waiting for call...</p>
          </div>
        </div>
      </>
    );
  }

  if (callStatus === 'post-call') {
    return (
      <>
        <DebugControls />
        <PostCallScreen />
      </>
    )
  }

  if (callStatus === 'idle') {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <DebugControls />
        <div className="p-6 rounded-full bg-muted/30">
          <div className="animate-pulse h-4 w-4 bg-green-500 rounded-full" />
        </div>
        <h2 className="text-xl font-medium text-muted-foreground">Ready for calls</h2>
        <p className="text-sm text-muted-foreground">Status: Online</p>
      </div>
    )
  }

  // ACTIVE STATE
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DebugControls />
      <div>
        <h1 className="text-2xl font-bold mb-2">Live Call</h1>
        <p className="text-muted-foreground">
          Real-time decision support during active calls
        </p>
      </div>

      <LiveCallHeader
        customerId={callData?.id || "CUST-???"} // Fallback if data missing
        customerName={callData?.['customerName'] as string || "Unknown Customer"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntentBadge />
            <SentimentIndicator />
            <ComplianceStatus />
            <UpsellPrompt
              onDismiss={() => console.log('Dismissed')}
              onApply={(id) => console.log('Applied:', id)}
            />
          </div>
          <SOPFlowPanel />
          <NextBestActionCard onActionSelect={handleActionSelect} />
        </div>
        <div className="space-y-6">
          {/* Additional sidebar content can go here */}
        </div>
      </div>

      <AgentChatDock
        messages={[]}
        onSendMessage={handleSendMessage}
        position="bottom-right"
      />
    </div>
  );
}
