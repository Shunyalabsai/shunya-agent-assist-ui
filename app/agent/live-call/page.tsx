"use client";

import * as React from "react";
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
  CustomerDetailsCard,
} from "@/features/live-call";
import { useLiveCallStore } from "@/stores/live-call.store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatHistory, ChatInput, ChatMessage } from "@/features/chat-assistant";
import { Button } from "@/components/ui/button";
import { PhoneIcon } from "lucide-react";

export default function LiveCallPage() {
  const {
    callData,
    callStatus,
    setCallStatus,
    incomingCall,
    startCall,
    endCall,
  } = useLiveCallStore();

  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API call - in production, call actual API
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "This is a mock response. In production, this would come from your AI assistant API.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  // Mock data initialization - can be removed when real integration is ready
  React.useEffect(() => {
    // Ensuring we have some default data for testing if needed
    if (!callData && callStatus === "active") {
      useLiveCallStore.getState().setCallData({
        id: "call-123",
        duration: 0,
        intent: "Product Inquiry",
        confidence: 0.85,
        sentiment: "positive",
        agentSentiment: "neutral",
        customerSentimentValue: 0.8,
        agentSentimentValue: 0.6,
        complianceStatus: "non-compliant",
        complianceIssues: [
          'Missed required disclosure: "Call recording"',
          "Did not verify customer identity with partial DOB",
        ],
        sopSteps: [
          {
            id: "step-1",
            title: "Greet Customer",
            description: "Welcome the customer and introduce yourself",
            status: "completed",
          },
          {
            id: "step-2",
            title: "Identify Need",
            description: "Understand the customer requirement",
            status: "current",
          },
          {
            id: "step-3",
            title: "Provide Solution",
            description: "Offer appropriate product or service",
            status: "pending",
          },
        ],
        currentStepId: "step-2",
        suggestedActions: [
          {
            id: "action-1",
            title: "Offer Product Demo",
            description: "Schedule a product demonstration for the customer",
            priority: "high",
          },
        ],
      });
    }
  }, [callData, callStatus]);

  const handleActionSelect = (actionId: string) => {
    console.log("Action selected:", actionId);
    // Handle action selection
  };

  console.log(callData, callStatus);
  // DEBUG CONTROLS (Top right for testing)
  const DebugControls = () => (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 p-2 bg-muted/80 rounded border text-xs">
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded"
        onClick={() =>
          incomingCall({
            customerName: "Alice Smith",
            queueName: "Premium Support",
          })
        }
      >
        Sim: Incoming
      </button>
      <button
        className="px-2 py-1 bg-green-500 text-white rounded"
        onClick={startCall}
      >
        Sim: Answer/Start
      </button>
      <button
        className="px-2 py-1 bg-red-500 text-white rounded"
        onClick={endCall}
      >
        Sim: End Call
      </button>
      <button
        className="px-2 py-1 bg-gray-500 text-white rounded"
        onClick={() => setCallStatus("idle")}
      >
        Sim: Idle
      </button>
    </div>
  );

  if (callStatus === "incoming") {
    return (
      <>
        <DebugControls />
        <IncomingCallOverlay onAnswer={startCall} onDecline={endCall} />
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

  if (callStatus === "post-call") {
    return (
      <>
        <DebugControls />
        <PostCallScreen />
      </>
    );
  }

  if (callStatus === "idle") {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <DebugControls />
        <div className="p-6 rounded-full bg-muted/30">
          <div className="animate-pulse h-4 w-4 bg-green-500 rounded-full" />
        </div>
        <h2 className="text-xl font-medium text-muted-foreground">
          Ready for calls
        </h2>
        <p className="text-sm text-muted-foreground">Status: Online</p>
      </div>
    );
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
      <div className="flex gap-3">
        <LiveCallHeader
          customerId={callData?.id || "CUST-???"} // Fallback if data missing
          customerName={
            (callData?.["customerName"] as string) || "Unknown Customer"
          }
          className="w-max rounded-2xl bg-blue-400/10 border-blue-200/20"
          onEndCall={endCall}
        />

        <CustomerDetailsCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 lg:col-span-2">
              <IntentBadge />
              <SentimentIndicator />
              <ComplianceStatus />
            </div>

            <UpsellPrompt
              onDismiss={() => console.log("Dismissed")}
              onApply={(id) => console.log("Applied:", id)}
            />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-3 lg:col-span-2">
            <SOPFlowPanel />
            <NextBestActionCard onActionSelect={handleActionSelect} />
          </div>
        </div>
        <div className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <div className="flex-1 p-4 h-full  max-h-[calc(60dvh - 128px)] overflow-y-auto">
                <ChatHistory messages={messages} />
              </div>
              <div className="border-t p-4">
                <ChatInput
                  onSendMessage={handleSendMessage}
                  disabled={isLoading}
                  isLoading={isLoading}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <AgentChatDock
        messages={[]}
        onSendMessage={handleSendMessage}
        position="bottom-right"
      /> */}
    </div>
  );
}
