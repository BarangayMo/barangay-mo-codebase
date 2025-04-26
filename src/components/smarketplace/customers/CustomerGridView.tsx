
import { CustomerCard } from "@/components/dashboard/CustomerCard";

interface CustomerData {
  id: number;
  name: string;
  email: string;
  status: string;
  orderCount: number;
  totalSpent: string;
  lastSeen: string;
}

interface CustomerGridViewProps {
  customers: CustomerData[];
}

export const CustomerGridView = ({ customers }: CustomerGridViewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          name={customer.name}
          email={customer.email}
          status={customer.status as any}
          orderCount={customer.orderCount}
          totalSpent={customer.totalSpent}
          lastSeen={customer.lastSeen}
        />
      ))}
    </div>
  );
};
