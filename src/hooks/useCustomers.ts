import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface CustomerData {
  id: string;
  name: string;
  phone: string;
  address: string;
  model: string;
  contractType: string;
  installationDate: string;
  contractStartDate: string;
  contractEndDate: string;
  notes: string;
  serviceVisits: ServiceVisitData[];
}

export interface ServiceVisitData {
  id: string;
  visitDate: string;
  serviceType: string;
  technicianName: string;
  sparesUsed: string;
  notes: string;
}

export function useCustomers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = useCallback(async () => {
    if (!user) { setCustomers([]); setLoading(false); return; }
    setLoading(true);
    const { data: custs, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) { toast({ title: "Error loading customers", description: error.message, variant: "destructive" }); setLoading(false); return; }

    // Fetch visits for all customers
    const ids = (custs || []).map((c: any) => c.id);
    let visits: any[] = [];
    if (ids.length > 0) {
      const { data: v } = await supabase.from("service_visits").select("*").in("customer_id", ids).order("visit_date", { ascending: true });
      visits = v || [];
    }

    const mapped: CustomerData[] = (custs || []).map((c: any) => ({
      id: c.id,
      name: c.name,
      phone: c.phone,
      address: c.address,
      model: c.model,
      contractType: c.contract_type,
      installationDate: c.installation_date,
      contractStartDate: c.contract_start_date,
      contractEndDate: c.contract_end_date,
      notes: c.notes || "",
      serviceVisits: visits
        .filter((v: any) => v.customer_id === c.id)
        .map((v: any) => ({
          id: v.id,
          visitDate: v.visit_date,
          serviceType: v.service_type,
          technicianName: v.technician_name,
          sparesUsed: v.spares_used || "",
          notes: v.notes || "",
        })),
    }));
    setCustomers(mapped);
    setLoading(false);
  }, [user, toast]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const addCustomer = async (data: Omit<CustomerData, "id" | "serviceVisits">) => {
    if (!user) return;
    const { error } = await supabase.from("customers").insert({
      user_id: user.id,
      name: data.name,
      phone: data.phone,
      address: data.address,
      model: data.model,
      contract_type: data.contractType,
      installation_date: data.installationDate,
      contract_start_date: data.contractStartDate,
      contract_end_date: data.contractEndDate,
      notes: data.notes,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    fetchCustomers();
  };

  const deleteCustomer = async (id: string) => {
    const { error } = await supabase.from("customers").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    fetchCustomers();
  };

  const addServiceVisit = async (customerId: string, visit: Omit<ServiceVisitData, "id">) => {
    if (!user) return;
    const { error } = await supabase.from("service_visits").insert({
      customer_id: customerId,
      user_id: user.id,
      visit_date: visit.visitDate,
      service_type: visit.serviceType,
      technician_name: visit.technicianName,
      spares_used: visit.sparesUsed,
      notes: visit.notes,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    fetchCustomers();
  };

  return { customers, loading, addCustomer, deleteCustomer, addServiceVisit };
}
