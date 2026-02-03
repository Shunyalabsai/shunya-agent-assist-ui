"use client";

import * as React from "react";
import { TrendingUp, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLiveCallStore } from "@/stores/live-call.store";
import { useFeature } from "@/hooks/useFeature";
import { cn } from "@/lib/utils";

export interface UpsellPromptProps {
  className?: string;
  onDismiss?: () => void;
  onApply?: (productId: string) => void;
}

interface UpsellOpportunity {
  id: string;
  productName: string;
  description: string;
  confidence: number;
  estimatedValue?: number;
  reason: string;
}

export function UpsellPrompt({
  className,
  onDismiss,
  onApply,
}: UpsellPromptProps) {
  const callData = useLiveCallStore((state) => state.callData);
  const hasUpsell = useFeature("upsell_prompts");

  if (!hasUpsell) {
    return null;
  }

  const opportunity = callData?.upsellOpportunity as
    | UpsellOpportunity
    | undefined;

  if (!opportunity) {
    return null;
  }

  // Only show if confidence is high enough
  if (opportunity.confidence < 0.7) {
    return null;
  }

  return (
    <Card className={cn("border-primary/50 bg-primary/5 p-4", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Upsell Opportunity
          </span>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 -mr-2 -mt-2"
            onClick={onDismiss}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-medium text-sm">{opportunity.productName}</h4>
            <Badge variant="default" className="text-xs shrink-0">
              {Math.round(opportunity.confidence * 100)}% match
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {opportunity.description}
          </p>
        </div>

        <div className="flex items-center gap-2 justify-between">
          {opportunity.estimatedValue && (
            <Badge variant="secondary" className="text-xs bg-background/50">
              +${opportunity.estimatedValue}
            </Badge>
          )}
          {onApply && (
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={() => onApply(opportunity.id)}
            >
              Present Offer
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
