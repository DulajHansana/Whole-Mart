"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/hooks/use-auth";

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading) {
      if (user?.role !== 'Owner') {
        toast({
          title: "Access Denied",
          description: "You do not have permission to view this page.",
          variant: "destructive",
        });
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, router, toast]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUsers();
      if (result.success && result.data) {
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
    if (user?.role === 'Owner') {
      fetchUsers();
    }
  }, [fetchUsers, user]);
  
  if (authLoading || user?.role !== 'Owner') {
    return (
       <div className="grid gap-6 auto-rows-min lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-2/3 order-2 lg:order-1">
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
              <UsersTable data={users} onUserChange={fetchUsers} />
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:w-1/3 order-1 lg:order-2">
        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
            <CardDescription>
              Add a new user to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateUserForm onUserChange={fetchUsers} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
