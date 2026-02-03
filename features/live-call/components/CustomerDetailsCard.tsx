import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Calendar, Repeat } from "lucide-react";
import { useLiveCallStore } from "@/stores/live-call.store";

export function CustomerDetailsCard() {
  const callData = useLiveCallStore((state) => state.callData);

  if (!callData) return null;

  return (
    <Card className="p-4 bg-card/50">
      <div className="flex flex-col gap-4">
        {/* Header with Name and Badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-none">
                {callData.customerName || "Unknown Customer"}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {callData.customerId || "ID: N/A"}
              </p>
            </div>
          </div>
          {callData.isRepeatCaller && (
            <Badge variant="secondary" className="gap-1 text-xs">
              <Repeat className="h-3 w-3" />
              Repeat Caller
            </Badge>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          {callData.customerPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{callData.customerPhone}</span>
            </div>
          )}
          {callData.customerDOB && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{callData.customerDOB}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
