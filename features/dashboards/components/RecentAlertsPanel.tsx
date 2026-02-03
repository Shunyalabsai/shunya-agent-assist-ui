'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ROUTES } from '@/constants/routes';
import { managerSocketClient } from '@/lib/realtime/manager-socket';
import type { Alert as AlertType } from '@/types/manager';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export interface RecentAlertsPanelProps {
  /** Initial alerts (e.g. from REST GET /api/manager/alerts). Real-time alerts append via WebSocket. */
  initialAlerts?: AlertType[];
  className?: string;
}

export function RecentAlertsPanel({ initialAlerts = [], className }: RecentAlertsPanelProps) {
  const router = useRouter();
  const [alerts, setAlerts] = React.useState<AlertType[]>(initialAlerts);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const hasWsUrl = Boolean(wsUrl);
    if (!hasWsUrl) {
      setConnected(false);
      return;
    }

    managerSocketClient.connect();
    setConnected(true);

    const unsubscribe = managerSocketClient.subscribeToAlerts((alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 50));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleAlertClick = (alert: AlertType) => {
    if (alert.sessionId) {
      router.push(ROUTES.MANAGER.SESSION_DETAIL(alert.sessionId));
    } else {
      router.push(ROUTES.MANAGER.FLOOR);
    }
  };

  const displayAlerts = alerts.length > 0 ? alerts : initialAlerts;

  const getAlertVariant = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  const getAlertIcon = (severity: AlertType['severity']) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>
          {connected
            ? 'Updates in real-time via WebSocket'
            : 'Real-time alerts when connected'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {displayAlerts.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6 text-center">
            No recent alerts
          </div>
        ) : (
          <ul className="space-y-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayAlerts.map((alert) => (
              <li key={alert.id}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleAlertClick(alert)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAlertClick(alert);
                    }
                  }}
                  className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg cursor-pointer"
                >
                  <Alert variant={getAlertVariant(alert.severity)}>
                    {getAlertIcon(alert.severity)}
                    <AlertTitle className="flex justify-between items-center gap-2">
                      <span>{alert.type}</span>
                      <span className="text-xs font-normal opacity-70">
                        {formatRelativeTime(alert.timestamp)}
                      </span>
                    </AlertTitle>
                    <AlertDescription>
                      {alert.agentName}
                    </AlertDescription>
                  </Alert>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
