'use client';

import * as React from 'react';
import { Phone, PhoneIcon, PhoneOffIcon, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLiveCallStore } from '@/stores/live-call.store';
import { Button } from '@/components/ui/button';
import { Orb } from "@/components/ui/orb"
import { ShimmeringText } from '@/components/ui/shimmering-text';

const ORB_MOUNT_DELAY_MS = 350;

export function IncomingCallOverlay({ onAnswer, onDecline }: { onAnswer: () => void; onDecline: () => void }) {
    const callData = useLiveCallStore((state) => state.callData);
    const [orbMounted, setOrbMounted] = React.useState(false);

    React.useEffect(() => {
        const t = setTimeout(() => setOrbMounted(true), ORB_MOUNT_DELAY_MS);
        return () => clearTimeout(t);
    }, []);

    // If no call data (shouldn't happen in this state usually), show generic
    const customerName = (callData?.['customerName'] as string) || 'Unknown Caller';
    const queueName = (callData?.['queueName'] as string) || 'General Support';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
                <CardContent className="flex flex-col items-center p-8 space-y-6">
                    <div className="bg-muted relative h-32 w-32 rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                        <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                            {orbMounted ? (
                                <Orb colors={["#CADCFC", "#A0B9D1"]} agentState="listening" className="w-32 h-32" />
                            ) : null}
                        </div>
                    </div>

                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">Incoming Call...</h2>
                        <p className="text-muted-foreground">{queueName}</p>
                    </div>

                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/50 w-full justify-center">
                        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border">
                            <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-lg">{customerName}</p>
                            <ShimmeringText
                                text="Calling..."
                                duration={3}
                                color="#6B7280"

                                className="text-sm tracking-tight"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button onClick={onAnswer}>
                            <PhoneIcon />
                            Answer
                        </Button>
                        <Button onClick={onDecline} variant="outline">
                            <PhoneOffIcon />
                            Decline
                        </Button>

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
