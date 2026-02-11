import { useState } from "react";
import { CustomerData } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplets } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<CustomerData, "id" | "serviceVisits">) => void;
  initial?: CustomerData;
}

export default function CustomerForm({ open, onClose, onSubmit, initial }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
    model: initial?.model ?? "",
    contractType: initial?.contractType ?? "AMC",
    installationDate: initial?.installationDate ?? "",
    contractStartDate: initial?.contractStartDate ?? "",
    contractEndDate: initial?.contractEndDate ?? "",
    notes: initial?.notes ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const set = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Droplets className="h-5 w-5 text-primary" />
            {initial ? "Edit Customer" : "New Customer"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" value={form.address} onChange={(e) => set("address", e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input id="model" value={form.model} onChange={(e) => set("model", e.target.value)} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="installDate">Installation Date</Label>
            <Input id="installDate" type="date" value={form.installationDate} onChange={(e) => set("installationDate", e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label>Contract Type</Label>
            <Select value={form.contractType} onValueChange={(v) => set("contractType", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="AMC">AMC (Full Contract)</SelectItem>
                <SelectItem value="Limited">Limited (No Membrane & Pump)</SelectItem>
                <SelectItem value="PreFilter">Pre Filter Service</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contractStart">Contract Start</Label>
              <Input id="contractStart" type="date" value={form.contractStartDate} onChange={(e) => set("contractStartDate", e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contractEnd">Contract End</Label>
              <Input id="contractEnd" type="date" value={form.contractEndDate} onChange={(e) => set("contractEndDate", e.target.value)} required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
          <Button type="submit" className="mt-2">{initial ? "Update" : "Add Customer"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
