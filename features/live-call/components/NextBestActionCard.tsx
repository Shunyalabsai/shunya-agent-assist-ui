"use client";

import * as React from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLiveCallStore } from "@/stores/live-call.store";
import { cn } from "@/lib/utils";

export interface NextBestActionCardProps {
  className?: string;
  onActionSelect?: (actionId: string) => void;
}

interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category?: string;
}

export function NextBestActionCard({
  className,
  onActionSelect,
}: NextBestActionCardProps) {
  const callData = useLiveCallStore((state) => state.callData);
  const actions = (callData?.suggestedActions as SuggestedAction[]) || [];

  const getPriorityVariant = (
    priority: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
      default:
        return "secondary";
    }
  };

  if (actions.length === 0) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Next Best Action
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No actions suggested at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show the highest priority action first
  const sortedActions = [...actions].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const primaryAction = sortedActions[0];

  return (
    <Card className={cn("border-primary/20 p-4", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recommended Action
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-medium text-sm">{primaryAction.title}</h4>
          <Badge
            variant={getPriorityVariant(primaryAction.priority)}
            className="text-xs shrink-0"
          >
            {primaryAction.priority}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {primaryAction.description}
        </p>

        {onActionSelect && (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 text-xs"
            onClick={() => onActionSelect(primaryAction.id)}
          >
            Apply Action
            <ArrowRight className="h-3 w-3 ml-2" />
          </Button>
        )}

        {sortedActions.length > 1 && (
          <div className="pt-2 border-t mt-3">
            <p className="text-xs text-muted-foreground mb-2">
              Other suggestions
            </p>
            <div className="space-y-1">
              {sortedActions.slice(1, 4).map((action) => (
                <button
                  key={action.id}
                  onClick={() => onActionSelect?.(action.id)}
                  className="w-full text-left text-xs p-1.5 rounded-md hover:bg-muted transition-colors flex items-center justify-between"
                >
                  <span className="truncate mr-2">{action.title}</span>
                  <Badge
                    variant={getPriorityVariant(action.priority)}
                    className="text-[10px] h-5 px-1.5"
                  >
                    {action.priority}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
