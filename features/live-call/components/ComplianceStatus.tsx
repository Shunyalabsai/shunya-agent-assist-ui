"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLiveCallStore } from "@/stores/live-call.store";
import { cn } from "@/lib/utils";

export interface ComplianceStatusProps {
  className?: string;
}

type ComplianceStatus = "compliant" | "non-compliant" | "pending";

export function ComplianceStatus({ className }: ComplianceStatusProps) {
  const callData = useLiveCallStore((state) => state.callData);
  const status = (callData?.complianceStatus as ComplianceStatus) || "pending";

  const getStatusConfig = (status: ComplianceStatus) => {
    switch (status) {
      case "compliant":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-950",
          borderColor: "border-green-200 dark:border-green-800",
          badgeVariant: "default" as const,
          label: "Compliant",
        };
      case "non-compliant":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-900/50",
          borderColor: "border-red-200 dark:border-red-800",
          badgeVariant: "destructive" as const,
          label: "Non-Compliant",
        };
      case "pending":
      default:
        return {
          icon: Clock,
          color: "text-yellow-600",
          bgColor: "bg-yellow-50 dark:bg-yellow-950",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          badgeVariant: "secondary" as const,
          label: "Pending Review",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const issues = (callData?.complianceIssues as string[]) || [];

  return (
    <Card
      className={cn(
        "border-2 p-4 flex flex-col justify-between",
        config.borderColor,
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={cn("h-4 w-4", config.color)} />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Compliance
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("font-semibold text-sm", config.color)}>
          {config.label}
        </span>
        {issues.length > 0 && (
          <Badge variant="outline" className="text-xs border-red-200">
            {issues.length} {issues.length === 1 ? "Issue" : "Issues"}
          </Badge>
        )}
      </div>
    </Card>
  );
}
