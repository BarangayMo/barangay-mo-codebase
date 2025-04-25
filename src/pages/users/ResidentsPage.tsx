import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export default function ResidentsPage() {
  // Mock data for residents
  const residents = [
    {
      id: "1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      status: "Active"
    },
    {
      id: "2",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      status: "Active"
    },
    {
      id: "3",
      first_name: "Robert",
      last_name: "Johnson",
      email: "robert.johnson@example.com",
      status: "Inactive"
    }
  ];

  return (
    <AdminLayout title="Residents">
      <DashboardPageHeader
        title="Residents"
        description="Manage resident accounts"
        breadcrumbItems={[{ label: "Users" }, { label: "Residents" }]}
      />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {residents.map((resident) => (
            <TableRow key={resident.id}>
              <TableCell>
                <Link 
                  to={`/admin/users/${resident.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {resident.first_name} {resident.last_name}
                </Link>
              </TableCell>
              <TableCell>{resident.email}</TableCell>
              <TableCell>{resident.status}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </AdminLayout>
  );
}
