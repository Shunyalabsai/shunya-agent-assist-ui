import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Play, Edit, Trash2 } from 'lucide-react';
import { Automation } from '../types';

interface AutomationListProps {
    automations: Automation[];
    onEdit: (automation: Automation) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string, active: boolean) => void;
}

export function AutomationList({
    automations,
    onEdit,
    onDelete,
    onToggleStatus
}: AutomationListProps) {

    const getTriggerLabel = (automation: Automation) => {
        const { type, config } = automation.trigger;
        switch (type) {
            case 'SOP_STEP':
                return `SOP Step: ${config.label || config.value}`;
            case 'CALL_OUTCOME':
                return `Call Outcome: ${config.label || config.value}`;
            case 'COMPLIANCE_EVENT':
                return `Compliance: ${config.label || config.value}`;
            default:
                return type;
        }
    };

    const getActionSummary = (automation: Automation) => {
        if (automation.actions.length === 0) return 'No actions';
        if (automation.actions.length === 1) {
            const action = automation.actions[0];
            return action.type === 'WEBHOOK'
                ? 'Webhook Trigger'
                : action.type === 'CRM_UPDATE'
                    ? 'Update CRM'
                    : 'Create Ticket';
        }
        return `${automation.actions.length} Actions`;
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Trigger</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Run</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {automations.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No automations configured. Create one to get started.
                            </TableCell>
                        </TableRow>
                    ) : (
                        automations.map((automation) => (
                            <TableRow key={automation.id}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span>{automation.name}</span>
                                        {automation.description && (
                                            <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                {automation.description}
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal">
                                        {getTriggerLabel(automation)}
                                    </Badge>
                                </TableCell>
                                <TableCell>{getActionSummary(automation)}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={automation.active}
                                        onCheckedChange={(checked) => onToggleStatus(automation.id, checked)}
                                    />
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {automation.lastRun
                                        ? new Date(automation.lastRun).toLocaleString()
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(automation)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-600"
                                                onClick={() => onDelete(automation.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
