import { useState } from "react";
import { ServiceVisit } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wrench } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<ServiceVisit, "id">) => void;
}

export default function ServiceVisitForm({ open, onClose, onSubmit }: Props) {
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: "",
    spares: "",
    techName: "",
  });

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ date: new Date().toISOString().slice(0, 10), description: "", spares: "", techName: "" });
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
            <Input id="visitDate" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={form.description} onChange={(e) => set("description", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="spares">Spares Used</Label>
            <Input id="spares" value={form.spares} onChange={(e) => set("spares", e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tech">Technician Name</Label>
            <Input id="tech" value={form.techName} onChange={(e) => set("techName", e.target.value)} required />
          </div>
          <Button type="submit">Add Visit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
