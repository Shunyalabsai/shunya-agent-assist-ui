'use client';

import * as React from 'react';
import { Phone, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLiveCallStore } from '@/stores/live-call.store';

export function IncomingCallOverlay() {
    const callData = useLiveCallStore((state) => state.callData);

    // If no call data (shouldn't happen in this state usually), show generic
    const customerName = (callData?.['customerName'] as string) || 'Unknown Caller';
    const queueName = (callData?.['queueName'] as string) || 'General Support';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-2xl border-primary/20 animate-in fade-in zoom-in duration-300">
                <CardContent className="flex flex-col items-center p-8 space-y-6">
                    <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                        <div className="relative rounded-full bg-primary/10 p-6">
                            <Phone className="h-12 w-12 text-primary animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">Incoming Call...</h2>
                        <p className="text-muted-foreground">{queueName}</p>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50 w-full justify-center">
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-lg">{customerName}</p>
                            <p className="text-sm text-muted-foreground">Connecting...</p>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground text-center max-w-[250px]">
                        Please answer using your softphone or desk phone.
                        Agent Assist will activate automatically.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
