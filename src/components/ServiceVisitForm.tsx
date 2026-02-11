import { useState } from "react";
import { ServiceVisitData } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wrench } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ServiceVisitData, "id">) => void;
}

export default function ServiceVisitForm({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    visitDate: new Date().toISOString().slice(0, 10),
    serviceType: "",
    sparesUsed: "",
    technicianName: "",
    notes: "",
  });

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ visitDate: new Date().toISOString().slice(0, 10), serviceType: "", sparesUsed: "", technicianName: "", notes: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Wrench className="h-5 w-5 text-primary" />
            Add Service Visit
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="visitDate">Date</Label>
            <Input id="visitDate" type="date" value={form.visitDate} onChange={(e) => set("visitDate", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Input id="serviceType" value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="spares">Spares Used</Label>
            <Input id="spares" value={form.sparesUsed} onChange={(e) => set("sparesUsed", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tech">Technician Name</Label>
            <Input id="tech" value={form.technicianName} onChange={(e) => set("technicianName", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="visitNotes">Notes</Label>
            <Input id="visitNotes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <Button type="submit">Add Visit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
