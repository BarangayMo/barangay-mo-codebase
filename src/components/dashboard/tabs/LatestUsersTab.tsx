
import { useLatestUsers } from "@/hooks/use-dashboard-data";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyStateWithIcon } from "@/components/dashboard/EmptyStateWithIcon";
import { Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const LatestUsersTab = () => {
  const { data: users, isLoading, error } = useLatestUsers();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyStateWithIcon
        icon={<Users className="h-8 w-8 text-gray-400" />}
        title="Unable to Load Users"
        description="There was an error loading the latest users. Please try again later."
      />
    );
  }

  if (!users || users.length === 0) {
    return (
      <EmptyStateWithIcon
        icon={<Users className="h-8 w-8 text-gray-400" />}
        title="No Users Yet"
        description="No users have registered yet. Users will appear here once they start signing up."
      />
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'resident': return 'bg-blue-100 text-blue-800';
      case 'official': return 'bg-green-100 text-green-800';
      case 'vendor': return 'bg-purple-100 text-purple-800';
      case 'superadmin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {user.first_name || user.last_name 
                      ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                      : 'Unknown User'
                    }
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
