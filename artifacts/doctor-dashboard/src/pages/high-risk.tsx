import { useGetKids } from "@workspace/api-client-react";
import { Link } from "wouter";
import { AlertTriangle, Phone, Activity, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HighRiskPage() {
  const { data: kids, isLoading } = useGetKids({ highRisk: true });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            High-Risk Patients
          </h1>
          <p className="text-slate-500 mt-1">Patients requiring immediate clinical review and intervention.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !kids || kids.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
          <div className="h-64 flex flex-col items-center justify-center text-slate-500">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Activity className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xl font-medium text-slate-700">Excellent News</p>
            <p className="mt-1">No high-risk patients require attention at this time.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {kids.map((kid) => (
            <Card key={kid.id} className="overflow-hidden rounded-2xl border-destructive/20 shadow-md hover:shadow-lg transition-all flex flex-col bg-white">
              <div className="h-2 bg-destructive w-full" />
              <CardContent className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900">{kid.name}</h3>
                    <p className="text-sm font-mono text-slate-500 mt-0.5">{kid.kidCode} • {kid.ageMonths} months</p>
                  </div>
                  <Badge variant="secondary" className="bg-destructive/10 text-destructive border-none">
                    {kid.dietType === "classic" ? "Classic Ketogenic" : kid.dietType === "mad" ? "Modified Atkins" : kid.dietType === "mct" ? "MCT Diet" : "Low GI Diet"}
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-sm font-semibold text-red-800 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="h-4 w-4" /> Risk Assessment
                    </p>
                    <p className="text-sm text-red-700 font-medium">Low meal completion and weight loss observed.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-1">
                      <p className="text-slate-500 font-medium">Meal Completion</p>
                      <p className="font-bold text-slate-800 text-lg">{Math.round(kid.mealCompletionRate * 100)}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-500 font-medium">Current Weight</p>
                      <p className="font-bold text-slate-800 text-lg">{kid.currentWeight || '--'} kg</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">{kid.parentName}:</span> {kid.parentContact}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-slate-50 border-t border-slate-100">
                <Button asChild className="w-full bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-sm" variant="outline">
                  <Link href={`/kids/${kid.id}`}>
                    Review Patient Profile <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
