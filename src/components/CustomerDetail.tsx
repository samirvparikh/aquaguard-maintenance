import { useState } from "react";
import { CustomerData, ServiceVisitData } from "@/hooks/useCustomers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Phone, MapPin, Calendar, Wrench, FileText } from "lucide-react";
import { format } from "date-fns";
import ServiceVisitForm from "./ServiceVisitForm";

interface Props {
  customer: CustomerData;
  onBack: () => void;
  onAddVisit: (customerId: string, visit: Omit<ServiceVisitData, "id">) => void;
}

export default function CustomerDetail({ customer, onBack, onAddVisit }: Props) {
  const [showVisitForm, setShowVisitForm] = useState(false);
  const isExpired = new Date(customer.contractEndDate) < new Date();

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
              <span>{customer.contractType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span>
                {customer.contractStartDate && format(new Date(customer.contractStartDate), "dd MMM yyyy")}
                {" → "}
                {customer.contractEndDate && format(new Date(customer.contractEndDate), "dd MMM yyyy")}
              </span>
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
                    <TableHead>Service Type</TableHead>
                    <TableHead>Spares</TableHead>
                    <TableHead>Technician</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customer.serviceVisits.map((v, i) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-medium">{i + 1}</TableCell>
                      <TableCell>{format(new Date(v.visitDate), "dd/MM/yy")}</TableCell>
                      <TableCell>{v.serviceType}</TableCell>
                      <TableCell>{v.sparesUsed || "—"}</TableCell>
                      <TableCell>{v.technicianName}</TableCell>
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
