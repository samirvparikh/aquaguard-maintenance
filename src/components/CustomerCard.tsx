import { CustomerData } from "@/hooks/useCustomers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Calendar, Wrench, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Props {
  customer: CustomerData;
  onSelect: (c: CustomerData) => void;
  onDelete: (id: string) => void;
}

export default function CustomerCard({ customer, onSelect, onDelete }: Props) {
  const isExpired = new Date(customer.contractEndDate) < new Date();
  const lastVisit = customer.serviceVisits[customer.serviceVisits.length - 1];

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group"
      onClick={() => onSelect(customer)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight">{customer.name}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{customer.model}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isExpired ? "destructive" : "default"} className="text-xs">
              {isExpired ? "Expired" : customer.contractType}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(customer.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" />
            <span>{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{customer.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {customer.contractStartDate && format(new Date(customer.contractStartDate), "dd MMM yyyy")}
              {" → "}
              {customer.contractEndDate && format(new Date(customer.contractEndDate), "dd MMM yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wrench className="h-3.5 w-3.5" />
            <span>
              {customer.serviceVisits.length} visit{customer.serviceVisits.length !== 1 ? "s" : ""}
              {lastVisit && ` · Last: ${format(new Date(lastVisit.visitDate), "dd MMM yyyy")}`}
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{customer.contractType}</span>
          <span className="text-xs font-medium text-primary">View Details →</span>
        </div>
      </CardContent>
    </Card>
  );
}
