'use client';

import * as React from 'react';
import {
  ChatHistory,
  ChatInput,
  SuggestedPrompts,
  SafetyNotice,
} from '@/features/chat-assistant';
import type { ChatMessage } from '@/features/chat-assistant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API call - in production, call actual API
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: 'This is a mock response. In production, this would come from your AI assistant API.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handlePromptSelect = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">AI Chat Assistant</h1>
        <p className="text-muted-foreground">
          Get real-time assistance during customer interactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
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
        <div className="space-y-6">
          <SuggestedPrompts onPromptSelect={handlePromptSelect} />
          <SafetyNotice />
        </div>
      </div>
    </div>
  );
}
