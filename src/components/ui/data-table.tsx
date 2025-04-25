
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settings2, Filter, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  data: T[];
  columns: {
    id: string;
    header: string;
    cell: (item: T) => React.ReactNode;
    align?: 'left' | 'right' | 'center';
  }[];
  showCheckbox?: boolean;
  showControls?: boolean;
}

export function DataTable<T>({ data, columns, showCheckbox = true, showControls = true }: DataTableProps<T>) {
  return (
    <div className="w-full">
      {showControls && (
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" size="sm" className="rounded-full">
            <Settings2 className="h-4 w-4 mr-2" />
            Customize
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      )}
      
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {showCheckbox && (
                  <TableHead className="w-[40px]">
                    <Checkbox />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead 
                    key={column.id}
                    className={cn(
                      "bg-gray-50/50 font-medium text-gray-700",
                      column.align === 'right' && "text-right",
                      column.align === 'center' && "text-center"
                    )}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow 
                  key={index}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {showCheckbox && (
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn(
                        "truncate max-w-[200px]",
                        column.align === 'right' && "text-right",
                        column.align === 'center' && "text-center"
                      )}
                    >
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
