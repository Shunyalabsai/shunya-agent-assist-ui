import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Plus, Trash2, Save } from 'lucide-react';
import { Automation, TriggerType, ActionType } from '../types';

interface AutomationFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    automation?: Automation | null;
    onSave: (automation: Omit<Automation, 'id' | 'createdAt' | 'lastRun'> | Automation) => void;
}

const TRIGGER_TYPES: { value: TriggerType; label: string }[] = [
    { value: 'SOP_STEP', label: 'SOP Step Completed' },
    { value: 'CALL_OUTCOME', label: 'Call Outcome' },
    { value: 'COMPLIANCE_EVENT', label: 'Compliance Event' },
];

const ACTION_TYPES: { value: ActionType; label: string }[] = [
    { value: 'TICKET_CREATION', label: 'Create Ticket' },
    { value: 'CRM_UPDATE', label: 'Update CRM' },
    { value: 'WEBHOOK', label: 'Trigger Webhook' },
];

export function AutomationForm({
    open,
    onOpenChange,
    automation,
    onSave
}: AutomationFormProps) {
    const [formData, setFormData] = useState<Partial<Automation>>({
        name: '',
        description: '',
        active: true,
        trigger: { type: 'CALL_OUTCOME', config: { value: '' } },
        actions: []
    });

    useEffect(() => {
        if (automation) {
            setFormData(JSON.parse(JSON.stringify(automation))); // Deep copy
        } else {
            setFormData({
                name: '',
                description: '',
                active: true,
                trigger: { type: 'CALL_OUTCOME', config: { value: '' } },
                actions: []
            });
        }
    }, [automation, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.trigger && formData.actions) {
            // @ts-ignore - TS doesn't know active is definitely there but it is initialized
            onSave(formData as Automation);
            onOpenChange(false);
        }
    };

    const addAction = () => {
        const newAction = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'WEBHOOK' as ActionType,
            config: {}
        };
        setFormData(prev => ({
            ...prev,
            actions: [...(prev.actions || []), newAction]
        }));
    };

    const updateAction = (index: number, updates: any) => {
        const newActions = [...(formData.actions || [])];
        newActions[index] = { ...newActions[index], ...updates };
        setFormData(prev => ({ ...prev, actions: newActions }));
    };

    const removeAction = (index: number) => {
        const newActions = [...(formData.actions || [])];
        newActions.splice(index, 1);
        setFormData(prev => ({ ...prev, actions: newActions }));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{automation ? 'Edit Automation' : 'Create Automation'}</DialogTitle>
                    <DialogDescription>
                        Configure automation triggers and actions
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    {/* Unchanged Base Details */}
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Post-Call Survey"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what this automation does..."
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={formData.active}
                                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                            />
                            <Label htmlFor="active">Active</Label>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-lg font-medium mb-4">Trigger</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Trigger Event</Label>
                                <Select
                                    value={formData.trigger?.type}
                                    onValueChange={(value: TriggerType) =>
                                        setFormData({
                                            ...formData,
                                            trigger: { type: value, config: { value: '' } }
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TRIGGER_TYPES.map(t => (
                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>
                                    {formData.trigger?.type === 'SOP_STEP' ? 'Step Name/ID' :
                                        formData.trigger?.type === 'CALL_OUTCOME' ? 'Outcome Value' :
                                            'Event Name'}
                                </Label>
                                <Input
                                    value={formData.trigger?.config.value}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            trigger: {
                                                ...formData.trigger!,
                                                config: { ...formData.trigger!.config, value: e.target.value }
                                            }
                                        })
                                    }
                                    placeholder={
                                        formData.trigger?.type === 'SOP_STEP' ? 'e.g., verification_complete' :
                                            formData.trigger?.type === 'CALL_OUTCOME' ? 'e.g., sale_made' :
                                                'e.g., credit_card_detected'
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Actions</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addAction}>
                                <Plus className="size-4 mr-2" /> Add Action
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {formData.actions?.length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground">
                                    No actions configured. Add an action to perform when the trigger fires.
                                </div>
                            )}

                            {formData.actions?.map((action, index) => (
                                <div key={action.id || index} className="p-4 border rounded-lg bg-muted/40 relative">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                                        onClick={() => removeAction(index)}
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>

                                    <div className="grid gap-4 pr-8">
                                        <div className="grid gap-2">
                                            <Label>Action Type</Label>
                                            <Select
                                                value={action.type}
                                                onValueChange={(value: ActionType) => updateAction(index, { type: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ACTION_TYPES.map(t => (
                                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Dynamic Action Config Fields */}
                                        {action.type === 'WEBHOOK' && (
                                            <div className="grid gap-2">
                                                <Label>Webhook URL</Label>
                                                <Input
                                                    value={action.config.webhookUrl || ''}
                                                    onChange={(e) =>
                                                        updateAction(index, {
                                                            config: { ...action.config, webhookUrl: e.target.value }
                                                        })
                                                    }
                                                    placeholder="https://api.example.com/webhook"
                                                />
                                            </div>
                                        )}

                                        {action.type === 'TICKET_CREATION' && (
                                            <div className="grid gap-2">
                                                <Label>Target System (Optional)</Label>
                                                <Input
                                                    value={action.config.targetSystem || ''}
                                                    onChange={(e) =>
                                                        updateAction(index, {
                                                            config: { ...action.config, targetSystem: e.target.value }
                                                        })
                                                    }
                                                    placeholder="e.g., Zendesk, Jira"
                                                />
                                            </div>
                                        )}

                                        {action.type === 'CRM_UPDATE' && (
                                            <div className="grid gap-2">
                                                <Label>Target CRM (Optional)</Label>
                                                <Input
                                                    value={action.config.targetSystem || ''}
                                                    onChange={(e) =>
                                                        updateAction(index, {
                                                            config: { ...action.config, targetSystem: e.target.value }
                                                        })
                                                    }
                                                    placeholder="e.g., Salesforce, HubSpot"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="size-4 mr-2" />
                            Save Automation
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
