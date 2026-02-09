import { useState, useEffect } from "react";
import { Customer, ServiceVisit } from "@/types/customer";

const STORAGE_KEY = "sai-aqua-customers";

const loadCustomers = (): Customer[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(loadCustomers);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers]);

  const addCustomer = (customer: Omit<Customer, "id" | "serviceVisits">) => {
    const newCustomer: Customer = {
      ...customer,
      id: crypto.randomUUID(),
      serviceVisits: [],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...data } : c))
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  const addServiceVisit = (customerId: string, visit: Omit<ServiceVisit, "id">) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              serviceVisits: [
                ...c.serviceVisits,
                { ...visit, id: crypto.randomUUID() },
              ],
            }
          : c
      )
    );
  };

  return { customers, addCustomer, updateCustomer, deleteCustomer, addServiceVisit };
}
