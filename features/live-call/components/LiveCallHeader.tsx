"use client";

import * as React from "react";
import {
  Clock,
  Mic,
  MicOff,
  PhoneOff,
  Pause,
  PhoneForwarded,
  LifeBuoy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useLiveCallStore } from "@/stores/live-call.store";
import { cn } from "@/lib/utils";
import { LiveWaveform } from "@/components/ui/live-waveform";

export interface LiveCallHeaderProps {
  className?: string;
  onEndCall?: () => void;
}

export function LiveCallHeader({ className, onEndCall }: LiveCallHeaderProps) {
  const callData = useLiveCallStore((state) => state.callData);
  const [duration, setDuration] = React.useState(0);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isHeld, setIsHeld] = React.useState(false);

  React.useEffect(() => {
    if (!callData) return;

    const startTime = Date.now() - (callData.duration || 0) * 1000;
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [callData]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "border-primary/20 flex items-center justify-between p-4",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-6 w-full">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className=" text-green-100 border-green-400/40 bg-green-400/10"
            >
              Active Call
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono font-medium">
              {formatDuration(duration)}
            </span>
          </div>
        </div>
        <LiveWaveform
          active={false}
          processing={true}
          height={20}
          barWidth={2.5}
          barGap={1.5}
          mode="scrolling"
          fadeEdges={true}
          barColor="gray"
          historySize={30}
        />

        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isMuted ? "destructive" : "secondary"}
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMuted ? "Unmute" : "Mute"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={cn(
                  "h-9 w-9 rounded-full",
                  isHeld && "bg-amber-100 text-amber-700 hover:bg-amber-200",
                )}
                onClick={() => setIsHeld(!isHeld)}
              >
                <Pause
                  className="h-4 w-4"
                  fill={isHeld ? "currentColor" : "none"}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isHeld ? "Resume Call" : "Hold Call"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => console.log("Transfer clicked")}
              >
                <PhoneForwarded className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Transfer</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => console.log("Help clicked")}
              >
                <LifeBuoy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ask for Help</p>
            </TooltipContent>
          </Tooltip>

          <div className="h-4 w-px bg-border mx-2" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={onEndCall}
              >
                <PhoneOff className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>End Call</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </Card>
    </TooltipProvider>
  );
}
