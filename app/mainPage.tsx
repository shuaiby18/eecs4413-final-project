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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';

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

// Navigation Bar Component
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="flex justify-between items-center p-3">
        <div className="flex items-center space-x-10 flex-grow">
          <div className="text-xl font-semibold">EECS 4413 PROJECT</div>
          <div className="flex-grow flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search for your product"
              className="p-2 border border-gray-300 rounded w-3/4"
            />
            <button className="p-2 rounded">
              <FontAwesomeIcon icon={faSearch} className="text-gray-500 h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <button className="p-2 rounded">
              <FontAwesomeIcon icon={faShoppingCart} className="text-gray-500 h-7 w-7" />
            </button>
            <span className="text-xs text-gray-600">Cart</span>
          </div>
          <div className="flex flex-col items-center">
            <button className="p-2 rounded">
              <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 h-7 w-7" />
            </button>
            <span className="text-xs text-gray-600">Sign-In</span>
          </div>
        </div>
      </div>
      <div className="flex justify-start items-center space-x-8 bg-gray-100 p-2 pl-4">
        <button className="text-gray-600 hover:text-gray-900">Category1</button>
        <button className="text-gray-600 hover:text-gray-900">Category2</button>
        <button className="text-gray-600 hover:text-gray-900">Category3</button>
        <button className="text-gray-600 hover:text-gray-900">Category4</button>
        <button className="text-gray-600 hover:text-gray-900">Category5</button>
        <button className="text-gray-600 hover:text-gray-900">Category6</button>
        <button className="text-gray-600 hover:text-gray-900">Category7</button>
        <button className="text-gray-600 hover:text-gray-900">Category8</button>
      </div>
    </nav>
  );
}


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
        <img
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
    <main className="flex min-h-screen flex-col items-center justify-between pt-32">
      {/* Navigation Bar */}
      <Navbar />

      {/* Products Table */}
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
