
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/app/actions/user.actions";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { setTheme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await loginUser(values);
    
    if (result.success && result.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('loggedInUser', JSON.stringify(result.user));
      }
      setTheme('light');
      toast({
        title: "Login Successful",
        description: `Welcome back, ${result.user.fullName}!`,
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Login Failed",
        description: result.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
        <CardDescription>
          Enter your credentials to access your dashboard.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Logging In..." : "Log In"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
