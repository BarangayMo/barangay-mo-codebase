
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CustomerData {
  id: number;
  name: string;
  email: string;
  status: string;
  orderCount: number;
  totalSpent: string;
  lastSeen: string;
}

interface CustomerListViewProps {
  customers: CustomerData[];
  onSort: (column: string) => void;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc';
}

export const CustomerListView = ({ customers, onSort, sortColumn, sortDirection }: CustomerListViewProps) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px] cursor-pointer" onClick={() => onSort('name')}>
                Customer {sortColumn === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort('email')}>
                Email {sortColumn === 'email' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort('orderCount')}>
                Orders {sortColumn === 'orderCount' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort('totalSpent')}>
                Total Spent {sortColumn === 'totalSpent' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort('lastSeen')}>
                Last Seen {sortColumn === 'lastSeen' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.orderCount}</TableCell>
                <TableCell>{customer.totalSpent}</TableCell>
                <TableCell>{getStatusBadge(customer.status)}</TableCell>
                <TableCell>{customer.lastSeen}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View Profile</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
