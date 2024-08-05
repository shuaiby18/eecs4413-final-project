"use client"

import { trpc } from "@/server/client";
import { useMemo, useState } from "react";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
  SortingFn
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Image from 'next/image'

// Custom sorting function for numeric values
const numericSort: SortingFn<any> = (rowA, rowB, columnId) => {
  const valueA = parseFloat(rowA.getValue(columnId));
  const valueB = parseFloat(rowB.getValue(columnId));
  let result;

  if (valueA > valueB) {
    result = 1
  } else if (valueA < valueB) {
    result = -1
  } else {
    result = 0
  }

  return result
};

export default function Home() {
  // get all products
  let { data: dataAll } = trpc.product.getAll.useQuery();

  // sorting state
  const [sorting, setSorting] = useState<SortingState>([]);

  // Define columns
  const columns = useMemo(() => [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <Image
          src={row.original.image}
          alt={row.original.description}
          className="aspect-square rounded-md object-cover"
          height="64"
          width="64"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'category.name',
      header: 'Category',
    },
    {
      accessorKey: 'brand.name',
      header: 'Brand',
    },   
    {
      accessorKey: 'price',
      header: 'Price',
      enableSorting: true,
      sortingFn: numericSort,
    },
    {
      header: 'Actions',
      cell: ({ row }) => (
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => console.log(row.original)}
        >
          Add to Cart
        </button>
      ),
    },
  ], []);

  // Create table instance
  const table = useReactTable({
    data: dataAll || [],
    columns,
    state: { sorting },
    onSortingChange: setSorting, 
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSorting: true,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : (
                        <div
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer select-none"
                        >
                          {
                            flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                          }
                        </div>
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
