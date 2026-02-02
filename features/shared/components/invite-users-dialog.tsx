'use client';

import * as React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Mail, Loader2, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const inviteSchema = z.object({
    invites: z.array(
        z.object({
            email: z.string().email({ message: "Invalid email address" }),
            role: z.enum(['manager', 'agent']),
        })
    ).min(1, { message: "At least one invite is required" }),
});

type InviteFormValues = z.infer<typeof inviteSchema>;

interface InviteUsersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InviteUsersDialog({ open, onOpenChange }: InviteUsersDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const form = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: {
            invites: [{ email: '', role: 'agent' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        name: "invites",
        control: form.control,
    });

    const onSubmit = async (data: InviteFormValues) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Inviting user:", data);
        setIsSubmitting(false);
        onOpenChange(false);
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[60vh] overflow-y-auto p-0">
                <DialogHeader className="pb-3 pt-6 px-6">
                    <DialogTitle>Invite Users</DialogTitle>
                    <DialogDescription>
                        Invite new members to your organization. They will receive an email to join.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="px-6 pt-3 pb-8">
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3 items-start">
                                        <FormField
                                            control={form.control}
                                            name={`invites.${index}.email`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                            <Input
                                                                placeholder="Email address"
                                                                className="pl-9"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`invites.${index}.role`}
                                            render={({ field }) => (
                                                <FormItem className="w-[140px]">
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Role" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="agent">Agent</SelectItem>
                                                                <SelectItem value="manager">Manager</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="text-muted-foreground hover:text-destructive shrink-0"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-2 hidden">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => append({ email: '', role: 'agent' })}
                                    className="gap-2"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add another
                                </Button>
                            </div>
                        </div>
                        <DialogFooter className="sticky bottom-0 bg-slate-950 border-t border-slate-800 p-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Send Invite
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
