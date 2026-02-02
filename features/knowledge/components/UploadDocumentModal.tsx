'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Upload } from 'lucide-react';

interface UploadDocumentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpload: (data: UploadData) => void;
}

export interface UploadData {
    file: File | null;
    process: string;
    queue: string;
    language: string;
}

export function UploadDocumentModal({ open, onOpenChange, onUpload }: UploadDocumentModalProps) {
    const [file, setFile] = React.useState<File | null>(null);
    const [process, setProcess] = React.useState('');
    const [queue, setQueue] = React.useState('');
    const [language, setLanguage] = React.useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpload({ file, process, queue, language });
        onOpenChange(false);
        // Reset form
        setFile(null);
        setProcess('');
        setQueue('');
        setLanguage('');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogDescription>
                        Upload a new document to the knowledge base. Supported formats: PDF, DOC, DOCX, TXT.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="file">File</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={handleFileChange}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="process">Process</Label>
                        <Select value={process} onValueChange={setProcess}>
                            <SelectTrigger id="process">
                                <SelectValue placeholder="Select process" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer-support">Customer Support</SelectItem>
                                <SelectItem value="sales">Sales</SelectItem>
                                <SelectItem value="technical-support">Technical Support</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="queue">Queue / Campaign</Label>
                        <Select value={queue} onValueChange={setQueue}>
                            <SelectTrigger id="queue">
                                <SelectValue placeholder="Select queue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="general-inquiries">General Inquiries</SelectItem>
                                <SelectItem value="premium-support">Premium Support</SelectItem>
                                <SelectItem value="outbound-sales">Outbound Sales</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="language">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={!file || !process || !queue || !language}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
