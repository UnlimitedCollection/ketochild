import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useGetKids, useGetKid, useGetKidKetoneReadings, useDeleteKid, useUpdateKid } from "@workspace/api-client-react";
import { Search, Filter, Loader2, User, ChevronRight, Flame, Clock, Trash2, Pencil, Scale, FlaskConical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCanWrite } from "@/hooks/useRole";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { UpdateKidRequest } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";

type KidRow = {
  id: number;
  name: string;
  dateOfBirth: string;
  gender?: string;
  parentName: string;
  parentContact: string;
  phase: number;
};

const editKidSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"]),
  parentName: z.string().min(1, "Parent name is required"),
  parentContact: z.string().min(1, "Contact is required"),
  phase: z.coerce.number().min(1).max(4),
});

function EditKidDialog({ kid, open, onOpenChange }: { kid: KidRow; open: boolean; onOpenChange: (v: boolean) => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof editKidSchema>>({
    resolver: zodResolver(editKidSchema),
    defaultValues: {
      name: kid.name,
      dateOfBirth: kid.dateOfBirth,
      gender: (kid.gender ?? "male") as "male" | "female",
      parentName: kid.parentName,
      parentContact: kid.parentContact,
      phase: kid.phase,
    },
  });

  useEffect(() => {
    form.reset({
      name: kid.name,
      dateOfBirth: kid.dateOfBirth,
      gender: (kid.gender ?? "male") as "male" | "female",
      parentName: kid.parentName,
      parentContact: kid.parentContact,
      phase: kid.phase,
    });
  }, [kid.id]);

  const mutation = useUpdateKid({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/kids"] });
        queryClient.invalidateQueries({ queryKey: [`/api/kids/${kid.id}`] });
        onOpenChange(false);
        toast({ title: "Patient updated", description: "Patient information has been saved." });
      },
      onError: () => toast({ title: "Failed to update patient", variant: "destructive" }),
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle>Edit Patient Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => mutation.mutate({ kidId: kid.id, data: d as UpdateKidRequest }))} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl><Input type="date" className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phase" render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[1, 2, 3, 4].map(p => <SelectItem key={p} value={p.toString()}>Phase {p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="parentName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="parentContact" render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Parent Contact</FormLabel>
                  <FormControl><Input className="rounded-xl" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" className="rounded-xl" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function KidViewDialog({ kidId, open, onOpenChange }: { kidId: number | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  const enabled = open && kidId !== null;
  const { data: profile, isLoading, isError } = useGetKid(kidId ?? 0, { query: { enabled } });
  const { data: ketoneReadings } = useGetKidKetoneReadings(
    kidId ?? 0,
    { limit: 1 },
    { query: { enabled } }
  );

  const kid = profile?.kid;
  const recentWeights = profile?.recentWeights ?? [];

  const latestWeight = recentWeights[0];
  const latestKetone = ketoneReadings?.[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Patient Overview
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : isError || !kid ? (
          <div className="h-40 flex flex-col items-center justify-center text-slate-500 gap-2">
            <p className="text-sm">Failed to load patient details.</p>
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="rounded-xl">Close</Button>
          </div>
        ) : (
          <div className="space-y-5 pt-1">
            {/* Name & IDs */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{kid.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{kid.kidCode}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">Phase {kid.phase}</Badge>
                </div>
              </div>
            </div>

            {/* Core info grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wide">Age</p>
                <p className="font-semibold text-slate-800">{kid.ageMonths} months</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wide">Gender</p>
                <p className="font-semibold text-slate-800 capitalize">{kid.gender ?? '—'}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wide">Date of Birth</p>
                <p className="font-semibold text-slate-800">{format(parseISO(kid.dateOfBirth), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wide">Health Status</p>
                {kid.isHighRisk ? (
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border border-destructive/20 text-xs mt-0.5">High Risk</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs mt-0.5">Stable</Badge>
                )}
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wide">Parent / Guardian</p>
                <p className="font-semibold text-slate-800">{kid.parentName}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium text-xs uppercase tracking-wide">Parent Contact</p>
                <p className="font-semibold text-slate-800">{kid.parentContact}</p>
              </div>
            </div>

            {/* Status & readings */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Flame className="h-3.5 w-3.5" /> Keto Status
                </div>
                {kid.inKetoStatus ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 w-fit gap-1 text-xs">In Keto</Badge>
                ) : (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 w-fit text-xs">Not in Keto</Badge>
                )}
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <Scale className="h-3.5 w-3.5" /> Latest Weight
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {latestWeight ? `${latestWeight.weight} kg` : kid.currentWeight ? `${kid.currentWeight} kg` : '—'}
                </p>
                {latestWeight && (
                  <p className="text-xs text-slate-400">{format(parseISO(latestWeight.date), 'MMM d')}</p>
                )}
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <FlaskConical className="h-3.5 w-3.5" /> Last Ketone
                </div>
                <p className="font-bold text-slate-800 text-sm">
                  {latestKetone ? `${latestKetone.value} ${latestKetone.unit}` : '—'}
                </p>
                {latestKetone && (
                  <p className="text-xs text-slate-400">{format(parseISO(latestKetone.date), 'MMM d')}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function KidsListPage() {
  const searchQuery = useSearch();
  const urlParams = new URLSearchParams(searchQuery);
  const initialSearch = urlParams.get("search") ?? "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingKid, setDeletingKid] = useState<{ id: number; name: string } | null>(null);
  const [editingKid, setEditingKid] = useState<KidRow | null>(null);
  const [viewingKidId, setViewingKidId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    setSearchTerm(urlParams.get("search") ?? "");
  }, [searchQuery]);

  const canWrite = useCanWrite();
  const [activePhase, setActivePhase] = useState<number | undefined>(undefined);

  const { data: kids, isLoading } = useGetKids(
    { search: debouncedSearch || undefined, phase: activePhase as 1 | 2 | 3 | 4 | undefined },
    { query: { queryKey: ["/api/kids", debouncedSearch, activePhase] } }
  );

  const deleteKidMutation = useDeleteKid({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/kids"] });
        toast({ title: "Patient removed", description: `${deletingKid?.name} has been deleted.` });
        setDeleteDialogOpen(false);
        setDeletingKid(null);
      },
      onError: () => toast({ title: "Failed to delete patient", variant: "destructive" }),
    }
  });

  return (
    <div className="space-y-6">
      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Patient Record</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{deletingKid?.name}</strong> and all associated data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingKid && deleteKidMutation.mutate({ kidId: deletingKid.id })}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteKidMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Patient
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {editingKid && (
        <EditKidDialog
          kid={editingKid}
          open={!!editingKid}
          onOpenChange={(v) => { if (!v) setEditingKid(null); }}
        />
      )}

      {/* View Dialog */}
      <KidViewDialog
        kidId={viewingKidId}
        open={viewingKidId !== null}
        onOpenChange={(v) => { if (!v) setViewingKidId(null); }}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Patient Directory
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and monitor all children in the program.
          </p>
        </div>
        {canWrite && (
          <Button asChild className="rounded-xl shadow-sm">
            <Link href="/kids/new">Register New Patient</Link>
          </Button>
        )}
      </div>

      <Card className="rounded-2xl p-4 shadow-sm border-slate-200 bg-white">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by kid name, ID, or parent..."
              className="pl-9 h-11 rounded-xl border-slate-200 bg-slate-50 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <div className="flex items-center gap-2 text-sm text-slate-500 mr-2 shrink-0">
              <Filter className="h-4 w-4" /> Filter Phase:
            </div>
            {[1, 2, 3, 4].map((phase) => (
              <Button
                key={phase}
                variant={activePhase === phase ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePhase(activePhase === phase ? undefined : phase)}
                className={`rounded-lg shrink-0 ${activePhase === phase ? 'shadow-md shadow-primary/20' : 'bg-white'}`}
              >
                Phase {phase}
              </Button>
            ))}
            {activePhase !== undefined && (
              <Button variant="ghost" size="sm" onClick={() => setActivePhase(undefined)} className="text-slate-500 shrink-0">
                Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl shadow-sm border-slate-200 overflow-hidden bg-white">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !kids || kids.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-500">
            <User className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-700">No patients found</p>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-b-slate-200">
                  <TableHead className="font-semibold text-slate-600">Patient</TableHead>
                  <TableHead className="font-semibold text-slate-600">ID / Code</TableHead>
                  <TableHead className="font-semibold text-slate-600">Phase</TableHead>
                  <TableHead className="font-semibold text-slate-600">Parent Info</TableHead>
                  <TableHead className="font-semibold text-slate-600">Meal Completion</TableHead>
                  <TableHead className="font-semibold text-slate-600">Keto Status</TableHead>
                  <TableHead className="font-semibold text-slate-600">Risk</TableHead>
                  <TableHead className="text-right font-semibold text-slate-600">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kids.map((kid) => (
                  <TableRow key={kid.id} className="hover:bg-slate-50/80 transition-colors group">
                    <TableCell>
                      <div className="font-bold text-slate-900">{kid.name}</div>
                      <div className="text-xs text-slate-500">{kid.ageMonths} mos • {kid.gender === 'male' ? 'M' : 'F'}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-600">{kid.kidCode}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                        Phase {kid.phase}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm text-slate-700">{kid.parentName}</div>
                      <div className="text-xs text-slate-500">{kid.parentContact}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-full max-w-[80px] h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${kid.mealCompletionRate < 0.5 ? 'bg-destructive' : kid.mealCompletionRate < 0.8 ? 'bg-orange-500' : 'bg-green-500'}`} 
                              style={{ width: `${Math.round(kid.mealCompletionRate * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{Math.round(kid.mealCompletionRate * 100)}%</span>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1 text-xs text-slate-400 cursor-default">
                                <Clock className="h-3 w-3" />
                                <span>24h: <span className={`font-semibold ${Math.round((kid.last24hCompletionRate ?? 1) * 100) < 50 ? 'text-destructive' : Math.round((kid.last24hCompletionRate ?? 1) * 100) < 80 ? 'text-orange-500' : 'text-green-600'}`}>{Math.round((kid.last24hCompletionRate ?? 1) * 100)}%</span></span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Last recorded day's meal completion</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              {kid.inKetoStatus ? (
                                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 gap-1">
                                  <Flame className="h-3 w-3" /> In Keto
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
                                  Not in Keto
                                </Badge>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>Based on avg carb intake vs target (last 7 days)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      {kid.isHighRisk ? (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
                          High Risk
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Stable
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {canWrite && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10"
                            onClick={() => setEditingKid({
                              id: kid.id,
                              name: kid.name,
                              dateOfBirth: kid.dateOfBirth,
                              gender: kid.gender,
                              parentName: kid.parentName,
                              parentContact: kid.parentContact,
                              phase: kid.phase,
                            })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-lg text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => setViewingKidId(kid.id)}
                        >
                          View <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        {canWrite && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-lg text-slate-400 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => { setDeletingKid({ id: kid.id, name: kid.name }); setDeleteDialogOpen(true); }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
