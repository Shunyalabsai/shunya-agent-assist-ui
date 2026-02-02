'use client';

import * as React from 'react';
import { CheckCircle2, FileText, Clock, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useLiveCallStore } from '@/stores/live-call.store';

export function PostCallScreen() {
    const { callData, completeCall } = useLiveCallStore();

    return (
        <div className="container max-w-4xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl font-bold">Call Ended</h1>
                <p className="text-muted-foreground">Review the summary and complete your tasks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Call Summary Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Call Summary
                        </CardTitle>
                        <CardDescription>Auto-generated from transcript</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Customer:</span>
                                <span className="font-medium">{(callData?.['customerName'] as string) || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Duration:</span>
                                <span className="font-medium font-mono">04:32</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Intent:</span>
                                <Badge variant="outline">{callData?.intent || 'General'}</Badge>
                            </div>
                        </div>
                        <Separator />
                        <div className="bg-muted/30 p-4 rounded-lg text-sm leading-relaxed">
                            <p>
                                Customer called regarding recent billing discrepancies.
                                Agent verified identity and reviewed the monthly statement.
                                Clarified that the extra charge was a pro-rated fee from the plan upgrade.
                                Customer accepted the explanation. Offered auto-pay setup but customer declined.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Items / Ticket */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Next Steps
                        </CardTitle>
                        <CardDescription>Required actions to close this case</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Ticket #INC-9942</h4>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                                    <span className="text-sm">Status</span>
                                    <Badge>Resolved</Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-md bg-background">
                                    <span className="text-sm">Category</span>
                                    <span className="text-sm">Billing / Disputes</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-sm font-medium">Sentiment Feedback</h4>
                            <div className="flex gap-4">
                                <Button variant="outline" className="flex-1 gap-2" size="sm">
                                    <ThumbsUp className="h-4 w-4" /> Good Call
                                </Button>
                                <Button variant="outline" className="flex-1 gap-2" size="sm">
                                    <ThumbsDown className="h-4 w-4" /> Issues
                                </Button>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="flex-col gap-3">
                        <Button className="w-full" size="lg" onClick={completeCall}>
                            Complete & Return to Queue
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
