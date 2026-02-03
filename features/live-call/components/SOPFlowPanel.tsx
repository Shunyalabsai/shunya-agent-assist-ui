"use client";

import * as React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLiveCallStore } from "@/stores/live-call.store";
import { cn } from "@/lib/utils";

export interface SOPFlowPanelProps {
  className?: string;
}

interface SOPStep {
  id: string;
  title: string;
  description?: string;
  status: "completed" | "current" | "pending";
}

export function SOPFlowPanel({ className }: SOPFlowPanelProps) {
  const callData = useLiveCallStore((state) => state.callData);
  const steps = (callData?.sopSteps as SOPStep[]) || [];
  const currentStepId = callData?.currentStepId as string | undefined;

  // If no steps provided, show default empty state
  if (steps.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">SOP Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No SOP steps available for this call.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Current SOP Flow
        </span>
      </div>

      <div className="space-y-4 px-1">
        {steps.map((step, index) => {
          const isCompleted = step.status === "completed";
          const isCurrent =
            step.status === "current" || step.id === currentStepId;
          const isPending = step.status === "pending" && !isCurrent;

          return (
            <div key={step.id} className="flex items-start gap-3 relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-[9px] top-6 w-0.5 h-[calc(100%+16px)] -ml-[1px]",
                    isCompleted ? "bg-green-600/20" : "bg-muted",
                  )}
                />
              )}

              <div className="flex flex-col items-center z-10 bg-card rounded-full">
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : isCurrent ? (
                  <div className="relative">
                    <Circle className="h-5 w-5 text-primary fill-primary" />
                    <div className="absolute inset-0 animate-ping">
                      <Circle className="h-5 w-5 text-primary opacity-75" />
                    </div>
                  </div>
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 space-y-1 -mt-0.5">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={cn(
                      "text-sm font-medium",
                      isCurrent && "text-primary",
                      isPending && "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </h4>
                  {isCurrent && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] h-5 px-1.5"
                    >
                      Current
                    </Badge>
                  )}
                </div>
                {step.description && (isCurrent || isCompleted) && (
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
