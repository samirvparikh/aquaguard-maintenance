import { useState } from "react";
import { Customer, ContractType } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplets } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Customer, "id" | "serviceVisits">) => void;
  initial?: Customer;
}

export default function CustomerForm({ open, onClose, onSubmit, initial }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    address: initial?.address ?? "",
    phone: initial?.phone ?? "",
    installationDate: initial?.installationDate ?? "",
    expiryDate: initial?.expiryDate ?? "",
    model: initial?.model ?? "",
    contractType: (initial?.contractType ?? "full") as ContractType,
    contractDate: initial?.contractDate ?? "",
    contractAmount: initial?.contractAmount ?? 3000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  const set = (key: string, value: string | number) =>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="installDate">Installation Date</Label>
              <Input id="installDate" type="date" value={form.installationDate} onChange={(e) => set("installationDate", e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input id="expiryDate" type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Contract Type</Label>
              <Select value={form.contractType} onValueChange={(v) => set("contractType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Contract (1 Year)</SelectItem>
                  <SelectItem value="limited">Limited (No Membrane & Pump)</SelectItem>
                  <SelectItem value="prefilter">Pre Filter Service (1 Year)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Contract Amount (₹)</Label>
              <Input id="amount" type="number" value={form.contractAmount} onChange={(e) => set("contractAmount", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contractDate">Contract Date</Label>
            <Input id="contractDate" type="date" value={form.contractDate} onChange={(e) => set("contractDate", e.target.value)} />
          </div>
          <Button type="submit" className="mt-2">{initial ? "Update" : "Add Customer"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
