export type ContractType = "full" | "limited" | "prefilter";

export interface ServiceVisit {
  id: string;
  date: string;
  description: string;
  spares: string;
  techName: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  installationDate: string;
  expiryDate: string;
  model: string;
  contractType: ContractType;
  contractDate: string;
  contractAmount: number;
  serviceVisits: ServiceVisit[];
}
