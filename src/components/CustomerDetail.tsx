import { useState } from "react";
import { Customer, ServiceVisit } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Phone, MapPin, Calendar, IndianRupee, Wrench, FileText } from "lucide-react";
import { format } from "date-fns";
import ServiceVisitForm from "./ServiceVisitForm";

const contractLabels = {
  full: "Full Contract (1 Year)",
  limited: "Service Contract (No Membrane & Pump)",
  prefilter: "Pre Filter Service (1 Year)",
};

interface Props {
  customer: Customer;
  onBack: () => void;
  onAddVisit: (customerId: string, visit: Omit<ServiceVisit, "id">) => void;
}

export default function CustomerDetail({ customer, onBack, onAddVisit }: Props) {
  const [showVisitForm, setShowVisitForm] = useState(false);
  const isExpired = new Date(customer.expiryDate) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-display text-2xl font-bold">{customer.name}</h2>
          <p className="text-muted-foreground">{customer.model}</p>
        </div>
        <Badge variant={isExpired ? "destructive" : "default"} className="text-sm py-1 px-3">
          {isExpired ? "Contract Expired" : "Active"}
        </Badge>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customer Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${customer.phone}`} className="hover:text-primary transition-colors">{customer.phone}</a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{customer.address}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>{contractLabels[customer.contractType]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {customer.installationDate && format(new Date(customer.installationDate), "dd MMM yyyy")}
                {" → "}
                {customer.expiryDate && format(new Date(customer.expiryDate), "dd MMM yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span>₹{customer.contractAmount.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 font-display">
            <Wrench className="h-5 w-5 text-primary" />
            Service Visits
          </CardTitle>
          <Button size="sm" onClick={() => setShowVisitForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Visit
          </Button>
        </CardHeader>
        <CardContent>
          {customer.serviceVisits.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No service visits yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">No.</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Spares</TableHead>
                    <TableHead>Technician</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.serviceVisits.map((v, i) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{format(new Date(v.date), "dd/MM/yy")}</TableCell>
                      <TableCell>{v.description}</TableCell>
                      <TableCell>{v.spares || "—"}</TableCell>
                      <TableCell>{v.techName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ServiceVisitForm
        open={showVisitForm}
        onClose={() => setShowVisitForm(false)}
        onSubmit={(visit) => onAddVisit(customer.id, visit)}
      />
    </div>
  );
}
