
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addOtHours } from "@/app/actions/attendance.actions";

const formSchema = z.object({
  hours: z.coerce.number().min(0, { message: "Hours must be a positive number." }),
});

interface AddOtDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  attendanceId: string;
  onOtAdded: () => void;
}

export function AddOtDialog({ isOpen, setIsOpen, attendanceId, onOtAdded }: AddOtDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hours: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await addOtHours(attendanceId, values.hours);

    if (result.success) {
      toast({
        title: "Overtime Added",
        description: `Successfully added ${values.hours} OT hours.`,
      });
      onOtAdded();
      form.reset();
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to add overtime.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Overtime</DialogTitle>
          <DialogDescription>
            Enter the number of overtime hours worked for this day.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OT Hours</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.1" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save OT"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
