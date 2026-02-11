import { useState, useMemo } from "react";
import { useCustomers, CustomerData } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import CustomerCard from "@/components/CustomerCard";
import CustomerDetail from "@/components/CustomerDetail";
import CustomerForm from "@/components/CustomerForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Droplets, Plus, Search, Users, Wrench, AlertTriangle, LogOut, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const Index = () => {
  const { customers, loading, addCustomer, deleteCustomer, addServiceVisit } = useCustomers();
  const { signOut } = useAuth();
  const [selected, setSelected] = useState<CustomerData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const expiringSoon = useMemo(() =>
    customers.filter((c) => {
      const days = differenceInDays(new Date(c.contractEndDate), new Date());
      return days >= 0 && days <= 30;
    }).sort((a, b) => new Date(a.contractEndDate).getTime() - new Date(b.contractEndDate).getTime()),
  [customers]);

  const totalVisits = customers.reduce((sum, c) => sum + c.serviceVisits.length, 0);

  const selectedCustomer = selected
    ? customers.find((c) => c.id === selected.id) ?? null
    : null;

  if (selectedCustomer) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="container max-w-5xl py-4 flex items-center gap-3">
            <Droplets className="h-7 w-7 text-primary" />
            <h1 className="font-display font-bold text-xl">Sai Aqua Service</h1>
          </div>
        </header>
        <main className="container max-w-5xl py-6 px-4">
          <CustomerDetail
            customer={selectedCustomer}
            onBack={() => setSelected(null)}
            onAddVisit={addServiceVisit}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container max-w-5xl py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Droplets className="h-7 w-7 text-primary" />
            <div>
              <h1 className="font-display font-bold text-xl leading-tight">Sai Aqua Service</h1>
              <p className="text-xs text-muted-foreground">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Customer
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl py-6 px-4 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-card border p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{customers.length}</p>
              <p className="text-xs text-muted-foreground">Customers</p>
            </div>
          </div>
          <div className="rounded-xl bg-card border p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{totalVisits}</p>
              <p className="text-xs text-muted-foreground">Total Visits</p>
            </div>
          </div>
          <div className="rounded-xl bg-card border p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">{expiringSoon.length}</p>
              <p className="text-xs text-muted-foreground">Expiring Soon</p>
            </div>
          </div>
        </div>

        {/* Expiring Soon Table */}
        {expiringSoon.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-display">
                <AlertTriangle className="h-5 w-5 text-warning" />
                Expiring Soon (Next 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Contract End</TableHead>
                      <TableHead>Days Left</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expiringSoon.map((c) => {
                      const daysLeft = differenceInDays(new Date(c.contractEndDate), new Date());
                      return (
                        <TableRow
                          key={c.id}
                          className="cursor-pointer"
                          onClick={() => setSelected(c)}
                        >
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>{c.phone}</TableCell>
                          <TableCell>{c.model}</TableCell>
                          <TableCell>{format(new Date(c.contractEndDate), "dd MMM yyyy")}</TableCell>
                          <TableCell>
                            <Badge variant={daysLeft <= 7 ? "destructive" : "outline"} className="text-xs">
                              {daysLeft === 0 ? "Today" : `${daysLeft} days`}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, address or model..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Customer list */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground animate-pulse">Loading customers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Droplets className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {customers.length === 0 ? "No customers yet. Add your first customer!" : "No results found."}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <CustomerCard key={c.id} customer={c} onSelect={setSelected} onDelete={deleteCustomer} />
            ))}
          </div>
        )}
      </main>

      <CustomerForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={addCustomer}
      />
    </div>
  );
};

export default Index;
