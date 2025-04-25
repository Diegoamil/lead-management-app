import { z } from "zod";

export type User = {
  id: string;
  phone: string;
  name: string;
};

export type FunnelStage = 'new' | 'qualifying' | 'proposal' | 'closed' | 'rejected';

export type LeadStatus = 'active' | 'won' | 'lost';

export type LeadSource = 'instagram' | 'whatsapp' | 'website' | 'referral' | 'trafego' | 'other';

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
  notes: string;
  createdAt: Date;
  updatedAt: Date;
};