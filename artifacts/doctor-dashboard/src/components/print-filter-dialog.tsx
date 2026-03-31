import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Printer } from "lucide-react";

export interface CheckboxOption {
  id: string;
  label: string;
  defaultChecked?: boolean;
}

export interface PrintFilterResult {
  selectedIds: string[];
  dateRange?: { start: string; end: string };
}

interface PrintFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  options: CheckboxOption[];
  showDateRange?: boolean;
  onConfirm: (result: PrintFilterResult) => void;
}

function getDefaultSelected(options: CheckboxOption[]): Set<string> {
  return new Set(options.filter((o) => o.defaultChecked !== false).map((o) => o.id));
}

export function PrintFilterDialog({
  open,
  onOpenChange,
  title,
  description,
  options,
  showDateRange = false,
  onConfirm,
}: PrintFilterDialogProps) {
  const [selected, setSelected] = useState<Set<string>>(() => getDefaultSelected(options));
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (open) {
      setSelected(getDefaultSelected(options));
      setStartDate("");
      setEndDate("");
    }
  }, [open, options]);

  const allSelected = selected.size === options.length && options.length > 0;
  const noneSelected = selected.size === 0;

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(options.map((o) => o.id)));
    }
  }

  function toggleItem(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleConfirm() {
    const result: PrintFilterResult = {
      selectedIds: Array.from(selected),
    };
    if (showDateRange && (startDate || endDate)) {
      result.dateRange = { start: startDate, end: endDate };
    }
    onConfirm(result);
    onOpenChange(false);
  }

  function handleCancel() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4 py-2">
          {showDateRange && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Date Range</p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label htmlFor="print-start-date" className="text-xs text-slate-500">
                    From
                  </Label>
                  <input
                    id="print-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full mt-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="print-end-date" className="text-xs text-slate-500">
                    To
                  </Label>
                  <input
                    id="print-end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full mt-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">Sections to Include</p>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-primary hover:underline font-medium"
              >
                {allSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto rounded-md border border-slate-100 p-3">
              {options.map((opt) => (
                <label
                  key={opt.id}
                  className="flex items-center gap-2.5 py-1 px-1 rounded hover:bg-slate-50 cursor-pointer"
                >
                  <Checkbox
                    checked={selected.has(opt.id)}
                    onCheckedChange={() => toggleItem(opt.id)}
                  />
                  <span className="text-sm text-slate-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={noneSelected} className="gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
