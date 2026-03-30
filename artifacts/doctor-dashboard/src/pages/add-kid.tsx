import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateKid, type CreateKidRequestPhase } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const createKidSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  gender: z.enum(["male", "female"]),
  parentName: z.string().min(2, "Parent name required"),
  parentContact: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  phase: z.coerce.number().min(1).max(4),
});

export default function AddKidPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const mutation = useCreateKid({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Patient Registered", description: `${data.name} has been added to the system.` });
        setLocation(`/kids/${data.id}`);
      },
      onError: (err: Error) => {
        toast({ variant: "destructive", title: "Error", description: err.message || "Failed to create patient record." });
      }
    }
  });

  const form = useForm<z.infer<typeof createKidSchema>>({
    resolver: zodResolver(createKidSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: "male",
      parentName: "",
      parentContact: "",
      phase: 1,
    }
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => window.history.back()} className="rounded-xl shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Register Patient</h1>
          <p className="text-slate-500 mt-1">Create a new child profile for the ketogenic program.</p>
        </div>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="h-2 w-full bg-gradient-to-r from-primary to-secondary" />
        <CardHeader className="pb-4 border-b border-slate-100 bg-slate-50/50">
          <CardTitle>Patient Details</CardTitle>
          <CardDescription>Enter demographic and contact information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => mutation.mutate({ data: { ...d, phase: d.phase as CreateKidRequestPhase } }))} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Child's Full Name</FormLabel>
                    <FormControl><Input className="rounded-xl bg-slate-50" placeholder="e.g. Alex Johnson" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl><Input type="date" className="rounded-xl bg-slate-50" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl bg-slate-50">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="parentName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Parent/Guardian Name</FormLabel>
                    <FormControl><Input className="rounded-xl bg-slate-50" placeholder="e.g. Sarah Johnson" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="parentContact" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl><Input className="rounded-xl bg-slate-50" placeholder="e.g. 07XXXXXXXX" maxLength={10} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="phase" render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Initial Protocol Phase</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl bg-slate-50 max-w-xs">
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Phase 1</SelectItem>
                        <SelectItem value="2">Phase 2</SelectItem>
                        <SelectItem value="3">Phase 3</SelectItem>
                        <SelectItem value="4">Phase 4</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-2">You can adjust specific macros later in the Medical Controls tab.</p>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <Button type="submit" disabled={mutation.isPending} className="rounded-xl px-8 shadow-lg shadow-primary/20 h-12 text-base">
                  {mutation.isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  Register Patient
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
