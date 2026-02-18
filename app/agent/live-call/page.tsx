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


import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation"
import { Message, MessageContent } from "@/components/ui/message"
import { Orb } from "@/components/ui/orb"
import { Response } from "@/components/ui/response"
import { useEffect, useState } from "react";

const allMessages = [
  {
    id: "1",
    role: "user" as const,
    parts: [
      {
        type: "text",
        text: "Hey, I need help with my order",
      },
    ],
  },
  {
    id: "2",
    role: "assistant" as const,
    parts: [
      {
        type: "text",
        tokens: [
          "Hi!",
          " I'd",
          " be",
          " happy",
          " to",
          " help",
          " you",
          " with",
          " your",
          " order.",
          " Could",
          " you",
          " please",
          " provide",
          " your",
          " order",
          " number?",
        ],
        text: "Hi! I'd be happy to help you with your order. Could you please provide your order number?",
      },
    ],
  },
  {
    id: "3",
    role: "user" as const,
    parts: [
      {
        type: "text",
        text: "It's ORDER-12345",
      },
    ],
  },
  {
    id: "4",
    role: "assistant" as const,
    parts: [
      {
        type: "text",
        tokens: [
          "Thank",
          " you!",
          " Let",
          " me",
          " pull",
          " up",
          " your",
          " order",
          " details.",
          " I",
          " can",
          " see",
          " that",
          " your",
          " order",
          " was",
          " placed",
          " on",
          " March",
          " 15th",
          " and",
          " is",
          " currently",
          " being",
          " processed.",
          " It",
          " should",
          " ship",
          " within",
          " the",
          " next",
          " 1-2",
          " business",
          " days.",
          " Is",
          " there",
          " anything",
          " specific",
          " you'd",
          " like",
          " to",
          " know",
          " about",
          " this",
          " order?",
        ],
        text: "Thank you! Let me pull up your order details. I can see that your order was placed on March 15th and is currently being processed. It should ship within the next 1-2 business days. Is there anything specific you'd like to know about this order?",
      },
    ],
  },
  {
    id: "5",
    role: "user" as const,
    parts: [
      {
        type: "text",
        text: "Can I change the shipping address?",
      },
    ],
  },
  {
    id: "6",
    role: "assistant" as const,
    parts: [
      {
        type: "text",
        tokens: [
          "Absolutely!",
          " Since",
          " the",
          " order",
          " hasn't",
          " shipped",
          " yet,",
          " I",
          " can",
          " update",
          " the",
          " shipping",
          " address",
          " for",
          " you.",
          " What",
          " would",
          " you",
          " like",
          " the",
          " new",
          " address",
          " to",
          " be?",
        ],
        text: "Absolutely! Since the order hasn't shipped yet, I can update the shipping address for you. What would you like the new address to be?",
      },
    ],
  },
]

export default function LiveCallPage() {
  const {
    callData,
    callStatus,
    setCallStatus,
    incomingCall,
    startCall,
    endCall,
  } = useLiveCallStore();

  // const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);


  ///CHAT CONVERSATION START

  const [messages, setMessages] = useState<typeof allMessages>([])
  const [streamingMessageIndex, setStreamingMessageIndex] = useState<
    number | null
  >(null)
  const [streamingContent, setStreamingContent] = useState("")
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    const intervals: NodeJS.Timeout[] = []
    let currentMessageIndex = 0
    const addNextMessage = () => {
      if (currentMessageIndex >= allMessages.length) return
      const message = allMessages[currentMessageIndex]
      const part = message.parts[0]
      if (message.role === "assistant" && "tokens" in part && part.tokens) {
        setStreamingMessageIndex(currentMessageIndex)
        setStreamingContent("")
        let currentContent = ""
        let tokenIndex = 0
        const streamInterval = setInterval(() => {
          if (tokenIndex < part.tokens.length) {
            currentContent += part.tokens[tokenIndex]
            setStreamingContent(currentContent)
            tokenIndex++
          } else {
            clearInterval(streamInterval)
            setMessages((prev) => [...prev, message])
            setStreamingMessageIndex(null)
            setStreamingContent("")
            currentMessageIndex++
            // Add next message after a delay
            timeouts.push(setTimeout(addNextMessage, 500))
          }
        }, 100)
        intervals.push(streamInterval)
      } else {
        setMessages((prev) => [...prev, message])
        currentMessageIndex++
        timeouts.push(setTimeout(addNextMessage, 800))
      }
    }
    // Start after 1 second
    timeouts.push(setTimeout(addNextMessage, 1000))
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [])



  ///CHAT CONVERSATION END

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
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <CustomerDetailsCard className=" h-full min-h-[150px] min-w-[300px]" />
        <LiveCallHeader
          className="w-full md:w-auto rounded-2xl bg-blue-400/10 border-blue-200/20"
          onEndCall={endCall}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Unified Live Analysis Card */}
          <Card className="overflow-hidden pt-0">
            <CardHeader className="bg-muted/30 py-3 px-4 border-b">
              <CardTitle className="text-sm font-medium h-full pt-2 pb-0">
                Live Analysis
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="p-4">
                <IntentBadge variant="ghost" />
              </div>
              <div className="p-4">
                <SentimentIndicator variant="ghost" />
              </div>
              <div className="p-4">
                <ComplianceStatus variant="ghost" />
              </div>
            </div>
          </Card>

          {/* Guidance & Actions Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <SOPFlowPanel className="h-full" />
            </div>
            <div className="space-y-6">
              <NextBestActionCard onActionSelect={handleActionSelect} />
              <UpsellPrompt
                onDismiss={() => console.log("Dismissed")}
                onApply={(id) => console.log("Applied:", id)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <Card className="h-[600px] flex flex-col pb-0">
            <CardHeader>
              <CardTitle>Chat</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden mb-3 gap-3">
              <div className="flex-1 px-4 h-full  max-h-[calc(60dvh - 128px)] overflow-y-auto">
                <div className="flex h-full flex-col">
                  <Conversation>
                    <ConversationContent>
                      {messages.length === 0 && streamingMessageIndex === null ? (
                        <ConversationEmptyState
                          icon={<Orb className="size-12" />}
                          title="Start a conversation"
                          description="This is a simulated conversation"
                        />
                      ) : (
                        <>
                          {messages.map((message) => (
                            <Message from={message.role} key={message.id}>
                              <MessageContent>
                                {message.parts.map((part, i) => {
                                  switch (part.type) {
                                    case "text":
                                      return (
                                        <Response key={`${message.id}-${i}`}>
                                          {part.text}
                                        </Response>
                                      )
                                    default:
                                      return null
                                  }
                                })}
                              </MessageContent>
                              {message.role === "assistant" && (
                                <div className="ring-border size-8 overflow-hidden rounded-full ring-1">
                                  <Orb className="h-full w-full" agentState={null} />
                                </div>
                              )}
                            </Message>
                          ))}
                          {streamingMessageIndex !== null && (
                            <Message
                              from={allMessages[streamingMessageIndex].role}
                              key={`streaming-${streamingMessageIndex}`}
                            >
                              <MessageContent>
                                <Response>{streamingContent || "\u200B"}</Response>
                              </MessageContent>
                              {allMessages[streamingMessageIndex].role ===
                                "assistant" && (
                                  <div className="ring-border size-8 overflow-hidden rounded-full ring-1">
                                    <Orb className="h-full w-full" agentState="talking" />
                                  </div>
                                )}
                            </Message>
                          )}
                        </>
                      )}
                    </ConversationContent>
                    <ConversationScrollButton />
                  </Conversation>
                </div>
              </div>
              <div className="border rounded-lg p-2 mx-2 focus-within:ring-1 focus-within:ring-offset-1 focus-within:ring-[#bedbff] focus-within:ring-offset-[#bedbff] mb-2">
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
