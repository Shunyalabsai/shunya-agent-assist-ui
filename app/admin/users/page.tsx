'use client';

import React, { useState } from 'react';
import { UserListTable } from '@/features/shared/components/user-list-table';
import { ConfigHeader } from '@/components/layout/ConfigHeader';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { InviteUsersDialog } from '@/features/shared/components/invite-users-dialog';

const UsersPage = () => {
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

    return (
        <div className="space-y-6 p-6">
            <ConfigHeader
                title="User Management"
                description="Manage all users, agents, and managers in the system."
                actions={
                    <Button
                        variant="default"
                        onClick={() => setIsInviteDialogOpen(true)}
                    >
                        <Mail className="h-4 w-4 mr-2" />
                        Invite User
                    </Button>
                }
            />
            <UserListTable />
            <InviteUsersDialog
                open={isInviteDialogOpen}
                onOpenChange={setIsInviteDialogOpen}
            />
        </div>
    )
}

export default UsersPage;