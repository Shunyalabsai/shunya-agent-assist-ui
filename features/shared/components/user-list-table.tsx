'use client';

import * as React from 'react';
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ArrowUpDown,
    ChevronDown,
    MoreHorizontal,
    Search,
    Filter,
    User as UserIcon,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUsers, UserWithRelations } from '../data/mock-users-data';

// Using standard dropdown components from shadcn/ui if available, 
// otherwise I'll need to check if they exist or use basic versions.
// Based on my previous list_dir, dropdown-menu.tsx was not in components/ui.
// I should check if I need to add it or use Select instead.

const createColumns = (
    onDisable: (id: string) => void,
    onReinvite: (id: string, email: string) => void
): ColumnDef<UserWithRelations>[] => [
        {
            accessorKey: 'name',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    >
                        User
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                );
            },
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                return (
                    <Badge variant={role === 'admin' ? 'default' : role === 'manager' ? 'secondary' : 'outline'} className="capitalize">
                        {role}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => {
                if (!value || value.length === 0) return true;
                return value.includes(row.getValue(id));
            },
        },
        {
            id: 'relationship',
            header: 'Relationship / Team',
            cell: ({ row }) => {
                const user = row.original;
                if (user.role === 'manager') {
                    return (
                        <div className="text-sm">
                            <span className="font-medium text-primary">{user.teamSize}</span> Agents Managed
                        </div>
                    );
                }
                if (user.role === 'agent' && user.managerName) {
                    return (
                        <div className="text-sm">
                            Reports to <span className="font-medium">{user.managerName}</span>
                        </div>
                    );
                }
                return <span className="text-muted-foreground text-sm">-</span>;
            },
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: ({ row }) => {
                const status = row.getValue('status') as string;
                const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
                    active: "default",
                    inactive: "destructive",
                    pending: "outline",
                };

                return (
                    <Badge variant={variants[status] || "outline"} className="capitalize">
                        {status}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel className="text-xs text-slate-300">Actions</DropdownMenuLabel>
                            {user.status === 'pending' && (
                                <DropdownMenuItem onClick={() => onReinvite(user.id, user.email)}>
                                    Re-invite
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => onDisable(user.id)}
                            >
                                Disable User
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

export function UserListTable() {
    const [data, setData] = React.useState<UserWithRelations[]>(mockUsers);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const handleDisableUser = (id: string) => {
        setData((prev) => prev.map(u => u.id === id ? { ...u, status: 'inactive' } : u));
    };

    const handleReinvite = (id: string, email: string) => {
        // In a real app, this would trigger an API call
        window.alert(`Invitation resent to ${email}`);
    };

    const columns = React.useMemo(() => createColumns(handleDisableUser, handleReinvite), []);

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center flex-1 gap-2 max-w-sm">
                    <div className="relative max-w-lg flex items-center">
                        <Search className="h-4 w-4 text-muted-foreground absolute top-[0.5rem] left-3" />
                        <Input
                            placeholder="Search users..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('name')?.setFilterValue(event.target.value)
                            }
                            className="pl-9 w-full"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    {!!table.getColumn('role')?.getFilterValue() && (
                        <div className="flex flex-wrap gap-2 items-center mr-2">
                            {(table.getColumn('role')?.getFilterValue() as string[] || []).map((role) => (
                                <Badge
                                    key={role}
                                    variant="outline"
                                    className="gap-1 pl-2 pr-1 py-1 h-7 bg-secondary/50 hover:bg-secondary border-none text-xs font-medium"
                                >
                                    <span className="capitalize">{role}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 rounded-full p-0 hover:bg-muted-foreground/20"
                                        onClick={() => {
                                            const currentFilter = (table.getColumn('role')?.getFilterValue() as string[]) || [];
                                            const newFilter = currentFilter.filter((r) => r !== role);
                                            table.getColumn('role')?.setFilterValue(newFilter.length ? newFilter : undefined);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                        <span className="sr-only">Remove {role} filter</span>
                                    </Button>
                                </Badge>
                            ))}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => table.getColumn('role')?.setFilterValue(undefined)}
                                className="h-7 px-2 text-xs"
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto">
                                <Filter className="mr-2 h-4 w-4" />
                                Filter by Role
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[150px]">
                            {['admin', 'manager', 'agent'].map((role) => (
                                <DropdownMenuCheckboxItem
                                    key={role}
                                    className="capitalize"
                                    checked={(table.getColumn('role')?.getFilterValue() as string[])?.includes(role)}
                                    onCheckedChange={(value) => {
                                        const currentFilter = (table.getColumn('role')?.getFilterValue() as string[]) || [];
                                        const newFilter = value
                                            ? [...currentFilter, role]
                                            : currentFilter.filter((r) => r !== role);
                                        table.getColumn('role')?.setFilterValue(newFilter.length ? newFilter : undefined);
                                    }}
                                >
                                    {role}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2">
                <div className="flex-1 text-sm text-muted-foreground">
                    Showing {table.getFilteredRowModel().rows.length} users
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div >
    );
}
