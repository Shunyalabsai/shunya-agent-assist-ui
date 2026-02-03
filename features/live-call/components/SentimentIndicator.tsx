"use client";

import * as React from "react";
import { Smile, Frown, Meh, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLiveCallStore } from "@/stores/live-call.store";
import { useFeature } from "@/hooks/useFeature";
import { cn } from "@/lib/utils";

export interface SentimentIndicatorProps {
  className?: string;
}

type Sentiment = "positive" | "neutral" | "negative" | "warning";

interface SentimentDisplayProps {
  label: string;
  sentiment?: Sentiment;
  value?: number;
}

function SentimentDisplay({ label, sentiment, value }: SentimentDisplayProps) {
  const getSentimentIcon = (sent?: Sentiment) => {
    switch (sent) {
      case "positive":
        return <Smile className="h-4 w-4 text-green-600" />;
      case "negative":
        return <Frown className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "neutral":
      default:
        return <Meh className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex items-start gap-2">
      {getSentimentIcon(sentiment)}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">{label}&nbsp;</span>
          {value !== undefined && (
            <span className="text-xs font-medium">
              {Math.round(value * 100)}%
            </span>
          )}
        </div>
        <Badge
          variant="outline"
          className={cn(
            "text-xs capitalize",
            sentiment === "positive" &&
              "border-transparent bg-green-500/20 text-green-400 hover:bg-green-100 border-green-400/20",
            sentiment === "negative" &&
              "border-transparent bg-red-500/20 text-red-400 hover:bg-red-100 border-red-400/20",
            sentiment === "warning" &&
              "border-transparent bg-yellow-500/20 text-yellow-400 hover:bg-yellow-100 border-yellow-400/20",
            (!sentiment || sentiment === "neutral") &&
              "border-transparent bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100",
          )}
        >
          {sentiment || "Unknown"}
        </Badge>
      </div>
    </div>
  );
}

export function SentimentIndicator({ className }: SentimentIndicatorProps) {
  const callData = useLiveCallStore((state) => state.callData);
  const hasSentiment = useFeature("live_sentiment");

  if (!hasSentiment) {
    return null;
  }

  const customerSentiment = callData?.sentiment as Sentiment | undefined;
  const agentSentiment = callData?.agentSentiment as Sentiment | undefined;
  const customerSentimentValue = callData?.customerSentimentValue as
    | number
    | undefined;
  const agentSentimentValue = callData?.agentSentimentValue as
    | number
    | undefined;

  return (
    <Card
      className={cn(
        "w-full col-span-1 p-4 flex flex-col justify-center",
        className,
      )}
    >
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
        Sentiment
      </span>
      <div className="grid grid-cols-2 gap-4">
        <SentimentDisplay
          label="Customer"
          sentiment={customerSentiment}
          value={customerSentimentValue}
        />
        <SentimentDisplay
          label="Agent"
          sentiment={agentSentiment}
          value={agentSentimentValue}
        />
      </div>
    </Card>
  );
}
