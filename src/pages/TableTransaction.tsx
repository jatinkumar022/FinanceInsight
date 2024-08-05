import React from "react";
import ReactLoading from "react-loading";

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
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import ActionMenu from "@/components/custom/ActionMenu";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Navbar from "@/components/custom/Navbar";
import { ChevronsUpDownIcon } from "lucide-react";

export type Transaction = {
  id: string;
  type: "income" | "expense";
  name: string;
  amount: number;
  date: string;
  tag: string;
};

export function TableTransaction() {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [filterType, setFilterType] = React.useState<
    "all" | "income" | "expense"
  >("all");

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          currencyDisplay: "symbol", // Ensures the currency symbol is used
        }).format(amount);
        return <div>{formatted}</div>;
      },
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div>{new Date(row.getValue("date")).toLocaleDateString()}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "tag",
      header: "Tag",
      cell: ({ row }) => <div>{row.getValue("tag")}</div>,
      enableSorting: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <TableCell>
          <ActionMenu
            transaction={row.original}
            onUpdate={(id, updatedData) => {
              setTransactions((prev) =>
                prev.map((transaction) =>
                  transaction.id === id
                    ? { ...transaction, ...updatedData }
                    : transaction
                )
              );
            }}
            onDelete={(id) => {
              setTransactions((prev) =>
                prev.filter((transaction) => transaction.id !== id)
              );
            }}
          />
        </TableCell>
      ),
    },
  ];

  React.useEffect(() => {
    const fetchTransactions = async () => {
      const auth = getAuth();
      const db = getFirestore();
      const user = auth.currentUser;

      if (user) {
        try {
          const transactionsRef = collection(
            db,
            `users/${user.uid}/transactions`
          );
          const querySnapshot = await getDocs(transactionsRef);

          const transactionsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Transaction[];

          setTransactions(transactionsList);
        } catch (err) {
          console.error("Error fetching transactions:", err);
          setError("Error fetching transactions.");
        } finally {
          setLoading(false);
        }
      } else {
        console.log("User is not authenticated");
        setLoading(false);
      }
    };

    const checkAuth = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        fetchTransactions();
      } else {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            fetchTransactions();
          } else {
            setLoading(false);
          }
        });
        return () => unsubscribe();
      }
    };

    checkAuth();
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const filteredData = React.useMemo(() => {
    return transactions.filter(
      (transaction) => filterType === "all" || transaction.type === filterType
    );
  }, [transactions, filterType]);

  const table = useReactTable({
    data: filteredData,
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

  if (loading)
    return (
      <div className="flex h-screen  items-center justify-center">
        <ReactLoading type={"bars"} height={30} width={30} />
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="w-full mb-28 p-3">
      <div className="flex flex-col gap-5 place-items-center">
        <Navbar />
      </div>
      <div className="lg:px-56 md:px-20">
        <div className="flex flex-col md:flex-row gap-3 items-center py-4 ">
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          <div className="ml-4 flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="mx-2">
                  <ChevronsUpDownIcon
                    className=" items-center "
                    size={"1rem"}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              onClick={() => setFilterType("all")}
              className={`mr-2 ${
                filterType === "all" ? "bg-blue-500 text-white" : ""
              }`}
            >
              All
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterType("income")}
              className={`mr-2 ${
                filterType === "income" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Income
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterType("expense")}
              className={`mr-2 ${
                filterType === "expense" ? "bg-blue-500 text-white" : ""
              }`}
            >
              Expense
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
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
      </div>
    </div>
  );
}
