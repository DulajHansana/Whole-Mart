"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateUserForm } from "@/components/dashboard/user-management/create-user-form";
import { UsersTable, type User } from "@/components/dashboard/user-management/users-table";
import { getUsers } from "@/app/actions/user.actions";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers();
      if (result.success && result.data) {
        // The user type from the table expects `id`, but mongoose uses `_id`. Let's map it.
        const userList = result.data.map((user: any) => ({ ...user, id: user._id }));
        setUsers(userList);
      } else {
        toast({
          title: "Error fetching users",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error fetching users: ", error);
       toast({
          title: "Error fetching users",
          description: "An unexpected error occurred.",
          variant: "destructive"
        })
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="grid gap-6 auto-rows-min lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              A list of all the users in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
               <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <UsersTable data={users} onUserDeleted={fetchUsers} />
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
            <CardDescription>
              Add a new user to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateUserForm onUserCreated={fetchUsers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
