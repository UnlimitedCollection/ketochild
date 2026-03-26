import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useGetKids } from "@workspace/api-client-react";
import { Search, Filter, Loader2, User, ChevronRight, Flame, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useDebounce } from "@/hooks/use-debounce";

export default function KidsListPage() {
  const searchQuery = useSearch();
  const urlParams = new URLSearchParams(searchQuery);
  const initialSearch = urlParams.get("search") ?? "";

  const notesMode = urlParams.get("notes") === "1";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setSearchTerm(urlParams.get("search") ?? "");
  }, [searchQuery]);

  const [activePhase, setActivePhase] = useState<number | undefined>(undefined);

  const { data: kids, isLoading } = useGetKids({
    query: {
      queryKey: ["/api/kids", debouncedSearch, activePhase],
    },
    request: {
      // @ts-ignore - orval params typing
      params: { search: debouncedSearch || undefined, phase: activePhase }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {notesMode ? "Private Notes" : "Patient Directory"}
          </h1>
          <p className="text-slate-500 mt-1">
            {notesMode
              ? "Select a patient below to view or add private notes."
              : "Manage and monitor all children in the program."}
          </p>
        </div>
        <Button asChild className="rounded-xl shadow-sm">
          <Link href="/kids/new">Register New Patient</Link>
        </Button>
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
                      <Button size="sm" variant="ghost" asChild className="rounded-lg text-primary hover:text-primary hover:bg-primary/10">
                        <Link href={`/kids/${kid.id}`}>
                          View <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
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
