'use client';

import { useState } from 'react';
import { Download, ChevronUp, ChevronDown, ArrowUpDown, Calendar as CalendarIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import type { AuditLog, AuditLogChange } from '../types';

export interface AuditLogTableProps {
  logs?: AuditLog[];
  onExport?: () => void;
  className?: string;
}

export function AuditLogTable({
  logs = [],
  onExport,
  className,
}: AuditLogTableProps) {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterResource, setFilterResource] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('');
  const [filterEntity, setFilterEntity] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined);
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined);

  const [sortBy, setSortBy] = useState<'timestamp' | 'action' | 'resource'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));
  const uniqueResources = Array.from(new Set(logs.map((log) => log.resource)));

  const filteredLogs = logs
    .filter((log) => {
      if (filterAction !== 'all' && log.action !== filterAction) return false;
      if (filterResource !== 'all' && log.resource !== filterResource) return false;

      if (filterUser && !log.userId.toLowerCase().includes(filterUser.toLowerCase())) return false;

      if (filterEntity) {
        // Search in resource name or any string value in metadata
        const resourceMatch = log.resource.toLowerCase().includes(filterEntity.toLowerCase());
        const metadataMatch = log.metadata
          ? JSON.stringify(log.metadata).toLowerCase().includes(filterEntity.toLowerCase())
          : false;

        if (!resourceMatch && !metadataMatch) return false;
      }

      if (filterStartDate) {
        const logDate = new Date(log.timestamp);
        if (logDate < filterStartDate) return false;
      }

      if (filterEndDate) {
        const logDate = new Date(log.timestamp);
        // Set end date to end of day for inclusive comparison if it's just a date without time
        const endDate = new Date(filterEndDate);
        endDate.setHours(23, 59, 59, 999);
        if (logDate > endDate) return false;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
        case 'action':
          comparison = a.action.localeCompare(b.action);
          break;
        case 'resource':
          comparison = a.resource.localeCompare(b.resource);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSort = (field: 'timestamp' | 'action' | 'resource') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setFilterAction('all');
    setFilterResource('all');
    setFilterUser('');
    setFilterEntity('');
    setFilterStartDate(undefined);
    setFilterEndDate(undefined);
  };

  const SortButton = ({ field, children }: { field: 'timestamp' | 'action' | 'resource'; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      {sortBy === field ? (
        sortOrder === 'asc' ? (
          <ChevronUp className="size-4 ml-1" />
        ) : (
          <ChevronDown className="size-4 ml-1" />
        )
      ) : (
        <ArrowUpDown className="size-4 ml-1 opacity-50" />
      )}
    </Button>
  );

  const renderChanges = (changes?: AuditLogChange[]) => {
    if (!changes || changes.length === 0) return null;

    return (
      <div className="text-xs space-y-1">
        {changes.map((change, idx) => (
          <div key={idx} className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center bg-muted/30 p-1.5 rounded">
            <span className="text-muted-foreground truncate max-w-[100px]" title={String(change.old)}>
              {change.old !== undefined ? String(change.old) : <span className="italic text-muted-foreground/50">empty</span>}
            </span>
            <span className="text-muted-foreground">→</span>
            <span className="font-medium truncate max-w-[100px]" title={String(change.new)}>
              {change.new !== undefined ? String(change.new) : <span className="italic text-muted-foreground/50">deleted</span>}
            </span>
            <span className="col-span-3 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
              {change.field}
            </span>
          </div>
        ))}
      </div>
    );
  };

  if (logs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No audit logs found.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="size-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Filter by User</label>
                <Input
                  placeholder="User ID..."
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Filter by Action</label>
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value)}
                  className="w-full h-9 text-sm border border-input rounded-md px-3 py-1 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="all">All Actions</option>
                  {uniqueActions.map((action) => (
                    <option key={action} value={action}>
                      {action}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Filter by Resource</label>
                <select
                  value={filterResource}
                  onChange={(e) => setFilterResource(e.target.value)}
                  className="w-full h-9 text-sm border border-input rounded-md px-3 py-1 bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="all">All Resources</option>
                  {uniqueResources.map((resource) => (
                    <option key={resource} value={resource}>
                      {resource}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Filter by Entity ID/Metadata</label>
                <Input
                  placeholder="Entity ID..."
                  value={filterEntity}
                  onChange={(e) => setFilterEntity(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-end w-full">
              <div className="flex-1 space-y-1 w-full">
                <label className="text-xs font-medium text-muted-foreground">Date Range</label>
                <div className="flex items-center gap-2 w-full">
                  <DatePicker
                    placeholder="Start Date"
                    value={filterStartDate}
                    onChange={setFilterStartDate}
                    max={filterEndDate || new Date()}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <DatePicker
                    placeholder="End Date"
                    value={filterEndDate}
                    onChange={setFilterEndDate}
                    min={filterStartDate}
                    max={new Date()}
                    className="flex-1"
                  />
                </div>
              </div>

              {(filterAction !== 'all' || filterResource !== 'all' || filterUser || filterEntity || filterStartDate || filterEndDate) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-9 px-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="mr-2 h-3 w-3" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium w-[180px]">
                      <SortButton field="timestamp">Timestamp</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium w-[120px]">
                      <SortButton field="action">Action</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium w-[140px]">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium w-[140px]">
                      <SortButton field="resource">Entity</SortButton>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      Changes (Old &rarr; New)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm whitespace-nowrap align-top">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm align-top">
                        <Badge
                          variant="outline"
                          className={`
                            capitalize font-medium border-0
                            ${log.action === 'created' ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' : ''}
                            ${log.action === 'updated' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20' : ''}
                            ${log.action === 'deleted' ? 'bg-red-50 text-red-700 ring-1 ring-red-600/20' : ''}
                            ${!['created', 'updated', 'deleted'].includes(log.action) ? 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20' : ''}
                          `}
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm align-top">
                        <div className="font-medium text-xs font-mono bg-muted/50 px-2 py-1 rounded inline-block">
                          {log.userId}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm align-top">
                        <div className="space-y-1">
                          <Badge variant="secondary" className="font-normal text-xs">
                            {log.resource}
                          </Badge>
                          {log.metadata?.title && (
                            <div className="text-xs font-medium truncate max-w-[150px]" title={log.metadata.title}>
                              {log.metadata.title}
                            </div>
                          )}
                          {!log.metadata?.title && (log.metadata as any)?.documentId && (
                            <div className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                              ID: {(log.metadata as any).documentId}
                            </div>
                          )}
                          {!log.metadata?.title && (log.metadata as any)?.intentId && (
                            <div className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
                              ID: {(log.metadata as any).intentId}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm align-top">
                        {log.metadata?.changes ? (
                          renderChanges(log.metadata.changes)
                        ) : (
                          <div className="text-xs text-muted-foreground max-w-[300px] overflow-hidden">
                            {/* Fallback for generic metadata display if no specific 'changes' structure */}
                            {log.metadata && Object.keys(log.metadata).length > 0 ? (
                              <details className="cursor-pointer group">
                                <summary className="text-primary hover:underline list-none flex items-center gap-1">
                                  <span className="group-open:hidden">View Details</span>
                                  <span className="hidden group-open:block">Hide Details</span>
                                </summary>
                                <pre className="mt-2 p-2 bg-muted rounded text-[10px] overflow-auto whitespace-pre-wrap font-mono">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </details>
                            ) : (
                              <span className="opacity-50">—</span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing {filteredLogs.length} results
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

