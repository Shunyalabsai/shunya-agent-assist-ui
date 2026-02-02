'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


export interface AuditTrailEntry {
  id: string;
  action: string;
  userId: string;
  userName?: string;
  timestamp: string;
  details?: string;
  metadata?: Record<string, unknown>;
}

export interface AuditTrailViewerProps {
  resourceId: string;
  resourceType: string;
  entries?: AuditTrailEntry[];
  limit?: number;
  className?: string;
}

export function AuditTrailViewer({
  resourceId,
  resourceType,
  entries = [],
  limit = 10,
  className,
}: AuditTrailViewerProps) {
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredEntries = actionFilter === 'all'
    ? entries
    : entries.filter((entry) => entry.action === actionFilter);

  const displayedEntries = showAll ? filteredEntries : filteredEntries.slice(0, limit);
  const uniqueActions = Array.from(new Set(entries.map((e) => e.action)));

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (entries.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No audit trail entries found for this {resourceType}.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audit Trail</CardTitle>
          {uniqueActions.length > 1 && (
            <div className="flex items-center gap-2">
              <Select
                value={actionFilter}
                onValueChange={setActionFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedEntries.map((entry) => {
            const isExpanded = expandedEntries.has(entry.id);
            return (
              <div
                key={entry.id}
                className="border-l-2 border-border/50 pl-4 pb-4 last:pb-0 relative"
              >
                <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{entry.action}</Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>by</span>
                          <div className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarFallback className="text-[10px]">
                                {getInitials(entry.userName || entry.userId)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{entry.userName || entry.userId}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </p>
                      {entry.details && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {entry.details}
                        </p>
                      )}
                    </div>
                    {entry.metadata && Object.keys(entry.metadata).length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(entry.id)}
                        className="text-xs"
                      >
                        {isExpanded ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                        {isExpanded ? 'Hide' : 'Show'} Details
                      </Button>
                    )}
                  </div>
                  {isExpanded && entry.metadata && (
                    <div className="mt-2 p-3 bg-muted rounded-md">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(entry.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {filteredEntries.length > limit && !showAll && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(true)}
              className="w-full"
            >
              <ChevronDown className="size-4" />
              Show All ({filteredEntries.length} entries)
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
