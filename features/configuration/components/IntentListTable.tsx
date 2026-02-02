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
    Search,
    Filter,
    X,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
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
import { Intent } from '../types';

interface IntentListTableProps {
    data: Intent[];
}

const createColumns = (): ColumnDef<Intent>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Intent Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue('description')}</div>,
    },
    {
        accessorKey: 'enabled',
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const isEnabled = row.original.enabled;
            return (
                <Badge
                    variant={isEnabled ? 'outline' : 'secondary'}
                    className={isEnabled ? "border-transparent bg-green-500/10 text-green-600 hover:bg-green-500/20" : ""}
                >
                    {isEnabled ? 'Active' : 'Draft'}
                </Badge>
            );
        },
        filterFn: (row, id, value) => {
            if (!value || value.length === 0) return true;
            const status = row.original.enabled ? 'Active' : 'Draft';
            return value.includes(status);
        },
    },
];

export function IntentListTable({ data }: IntentListTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const columns = React.useMemo(() => createColumns(), []);

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
                    <div className="relative w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search intents..."
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(event) =>
                                table.getColumn('name')?.setFilterValue(event.target.value)
                            }
                            className="pl-8"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!!table.getColumn('status')?.getFilterValue() && (
                        <div className="flex flex-wrap gap-2 items-center mr-2">
                            {(table.getColumn('status')?.getFilterValue() as string[] || []).map((status) => (
                                <Badge
                                    key={status}
                                    variant="outline"
                                    className="gap-1 pl-2 pr-1 py-1 h-7 bg-secondary/50 hover:bg-secondary border-none text-xs font-medium"
                                >
                                    <span className="capitalize">{status}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 rounded-full p-0 hover:bg-muted-foreground/20"
                                        onClick={() => {
                                            const currentFilter = (table.getColumn('status')?.getFilterValue() as string[]) || [];
                                            const newFilter = currentFilter.filter((r) => r !== status);
                                            table.getColumn('status')?.setFilterValue(newFilter.length ? newFilter : undefined);
                                        }}
                                    >
                                        <X className="h-3 w-3" />
                                        <span className="sr-only">Remove {status} filter</span>
                                    </Button>
                                </Badge>
                            ))}
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => table.getColumn('status')?.setFilterValue(undefined)}
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
                                Filter by Status
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {['Active', 'Draft'].map((status) => (
                                <DropdownMenuCheckboxItem
                                    key={status}
                                    className="capitalize"
                                    checked={(table.getColumn('status')?.getFilterValue() as string[])?.includes(status)}
                                    onCheckedChange={(value) => {
                                        const currentFilter = (table.getColumn('status')?.getFilterValue() as string[]) || [];
                                        const newFilter = value
                                            ? [...currentFilter, status]
                                            : currentFilter.filter((s) => s !== status);
                                        table.getColumn('status')?.setFilterValue(newFilter.length ? newFilter : undefined);
                                    }}
                                >
                                    {status}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="rounded-md border">
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
            <div className="flex items-center justify-end space-x-2 py-4">
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
        </div>
    );
}
