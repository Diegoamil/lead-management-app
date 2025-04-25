import { z } from "zod";

export type UserRole = 'admin' | 'manager' | 'user';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: UserRole;
  companyId?: string;
};

export type FunnelStage = 'new' | 'qualifying' | 'proposal' | 'negotiation' | 'closed' | 'rejected';

export type LeadStatus = 'active' | 'inactive' | 'won' | 'lost';

export type LeadSource = 'website' | 'referral' | 'instagram' | 'facebook' | 'whatsapp' | 'trafego';

export type Car = {
  id: string;
  model: string;
  price: number;
  createdAt: Date;
};

export const carSchema = z.object({
  model: z.string().min(1, "Modelo é obrigatório"),
  price: z.number().min(0, "Preço deve ser maior que zero"),
});

export type Lead = {
  id: string;
  name: string;
  phone: string;
  imageUrl?: string;
  source: LeadSource;
  stage: FunnelStage;
  status: LeadStatus;
  interest: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Company = {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email?: string;
  logo?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Seller = {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyId: string;
  role?: string;
  avatar?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};