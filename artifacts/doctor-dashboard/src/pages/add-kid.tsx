import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateKid, type CreateKidRequestDietType } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const DIET_TYPE_OPTIONS = [
  { value: "classic", label: "Classic Ketogenic Diet" },
  { value: "mad", label: "Modified Atkins Diet" },
  { value: "mct", label: "MCT Diet" },
  { value: "lowgi", label: "Low GI Diet" },
];

const RATIO_OPTIONS = ["2:1", "2.5:1", "3:1", "3.5:1", "4:1"];

const createKidSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string().nonempty("Date of birth is required"),
  gender: z.enum(["male", "female"]),
  parentName: z.string().min(2, "Parent name required"),
  parentContact: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  dietType: z.enum(["classic", "mad", "mct", "lowgi"]),
  dietSubCategory: z.string().optional(),
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
      dietType: "classic",
      dietSubCategory: "4:1",
    }
  });

  const selectedDietType = useWatch({ control: form.control, name: "dietType" });

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
            <form onSubmit={form.handleSubmit((d) => mutation.mutate({ data: { ...d, dietType: d.dietType as CreateKidRequestDietType, dietSubCategory: d.dietType === "classic" ? d.dietSubCategory : undefined } }))} className="space-y-6">
              
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

                <FormField control={form.control} name="dietType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diet Type</FormLabel>
                    <Select onValueChange={(v) => { field.onChange(v); if (v !== "classic") form.setValue("dietSubCategory", undefined); else form.setValue("dietSubCategory", "4:1"); }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl bg-slate-50">
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DIET_TYPE_OPTIONS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                {selectedDietType === "classic" && (
                  <FormField control={form.control} name="dietSubCategory" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keto Ratio</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "4:1"}>
                        <FormControl>
                          <SelectTrigger className="rounded-xl bg-slate-50">
                            <SelectValue placeholder="Select ratio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RATIO_OPTIONS.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                )}
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-700">PHN No.</p>
                <div className="h-10 flex items-center px-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-sm font-mono">Auto-generated on registration</div>
                <p className="text-xs text-slate-500">A unique Patient Health Number (PHN) will be assigned automatically.</p>
              </div>

              <p className="text-xs text-slate-500">You can adjust specific macros later in the Medical Controls tab.</p>

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
