import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCouncilMembers, useCreateCouncilMember, useUpdateCouncilMember, useDeleteCouncilMember, CouncilMember } from "@/hooks/use-council-members";
import { useAuth } from "@/contexts/AuthContext";

const councilMemberSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  middle_name: z.string().optional(),
  last_name: z.string().min(1, "Last name is required"),
  suffix: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone_number: z.string().optional(),
  landline_number: z.string().optional(),
});

type CouncilMemberFormData = z.infer<typeof councilMemberSchema>;

interface CouncilMembersSectionProps {
  className?: string;
}

export function CouncilMembersSection({ className }: CouncilMembersSectionProps) {
  const { user } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<CouncilMember | null>(null);

  const { data: councilMembers, isLoading } = useCouncilMembers(user?.barangay);
  const createMutation = useCreateCouncilMember();
  const updateMutation = useUpdateCouncilMember();
  const deleteMutation = useDeleteCouncilMember();

  const form = useForm<CouncilMemberFormData>({
    resolver: zodResolver(councilMemberSchema),
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      position: "",
      email: "",
      phone_number: "",
      landline_number: "",
    },
  });

  const onSubmit = async (data: CouncilMemberFormData) => {
    if (!user?.barangay || !user?.municipality || !user?.province) {
      return;
    }

    const memberData: CouncilMember = {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name,
      suffix: data.suffix,
      position: data.position,
      email: data.email,
      phone_number: data.phone_number,
      landline_number: data.landline_number,
      barangay: user.barangay,
      municipality: user.municipality,
      province: user.province,
      region: "REGION 3", // fallback since user doesn't have region property
    };

    try {
      if (editingMember) {
        await updateMutation.mutateAsync({
          id: editingMember.id!,
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            middle_name: data.middle_name,
            suffix: data.suffix,
            position: data.position,
            email: data.email,
            phone_number: data.phone_number,
            landline_number: data.landline_number,
          },
        });
        setEditingMember(null);
      } else {
        await createMutation.mutateAsync(memberData);
        setIsAddDialogOpen(false);
      }
      form.reset();
    } catch (error) {
      console.error("Error saving council member:", error);
    }
  };

  const handleEdit = (member: CouncilMember) => {
    setEditingMember(member);
    form.reset({
      first_name: member.first_name,
      middle_name: member.middle_name || "",
      last_name: member.last_name,
      suffix: member.suffix || "",
      position: member.position,
      email: member.email || "",
      phone_number: member.phone_number || "",
      landline_number: member.landline_number || "",
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting council member:", error);
    }
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingMember(null);
    form.reset();
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Council Members
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Council Members</span>
          <Dialog open={isAddDialogOpen || !!editingMember} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Edit Council Member" : "Add Council Member"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="middle_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="suffix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Suffix</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Jr., Sr., III" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Kagawad, Secretary" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="landline_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Landline</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {editingMember ? "Update" : "Add"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {councilMembers && councilMembers.length > 0 ? (
          <div className="space-y-3">
            {councilMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-red-100 text-red-600">
                    {member.first_name[0]}{member.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {member.first_name} {member.middle_name} {member.last_name} {member.suffix}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {member.position}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    {member.phone_number && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone_number}</span>
                      </div>
                    )}
                    {member.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(member)}
                    className="h-8 w-8 p-0 hover:bg-blue-100"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove Council Member</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to remove {member.first_name} {member.last_name} from the council?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(member.id!)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="mb-2">No council members added yet</p>
            <p className="text-sm">Add your first council member to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}