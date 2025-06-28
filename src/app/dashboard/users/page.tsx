import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateUserForm } from "@/components/dashboard/user-management/create-user-form";
import { UsersTable } from "@/components/dashboard/user-management/users-table";

const users = [
    { fullName: "John Doe", email: "john.d@example.com", phone: "123-456-7890", role: "Employee" },
    { fullName: "Jane Smith", email: "jane.s@example.com", phone: "098-765-4321", role: "Employee" },
    { fullName: "Admin User", email: "admin@example.com", phone: "555-555-5555", role: "Admin" },
]

export default function UserManagementPage() {
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
            <UsersTable data={users} />
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
            <CreateUserForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
