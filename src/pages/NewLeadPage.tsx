import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/layout/PageContainer';
import { Header } from '../components/layout/Header';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Combobox } from '../components/ui/Combobox';
import { Button } from '../components/ui/Button';
import { CarModal } from '../components/car/CarModal';
import { useLeads } from '../context/LeadContext';
import { useCars } from '../context/CarContext';
import { LeadSource } from '../types';

export function NewLeadPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('instagram');
  const [interest, setInterest] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  
  const { addLead } = useLeads();
  const { cars } = useCars();
  const navigate = useNavigate();
  
  const sourceOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Indicação' },
    { value: 'other', label: 'Outro' }
  ];

  const carOptions = cars.map(car => ({
    value: car.id,
    label: `${car.model} - ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(car.price)}`
  }));
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) return;
    
    setIsLoading(true);
    
    const selectedCar = cars.find(car => car.id === interest);
    
    addLead({
      name,
      phone,
      source,
      interest: selectedCar ? `${selectedCar.model} - ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(selectedCar.price)}` : '',
      stage: 'new',
      status: 'active',
      notes: ''
    });
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 500);
  };
  
  return (
    <>
      <Header title="Novo Lead" showBackButton />
      
      <PageContainer>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <Input
            label="Nome completo"
            type="text"
            placeholder="Nome do cliente"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          <Input
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          
          <Select
            label="Origem"
            options={sourceOptions}
            value={source}
            onChange={(val) => setSource(val as LeadSource)}
            required
          />
          
          <Combobox
            label="Interesse"
            options={carOptions}
            value={interest}
            onChange={setInterest}
            onCreateNew={() => setIsCarModalOpen(true)}
            placeholder="Selecione um veículo"
          />
          
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <Button 
              type="submit" 
              variant="primary" 
              fullWidth
              disabled={isLoading || !name || !phone}
            >
              {isLoading ? 'Salvando...' : 'Salvar Lead'}
            </Button>
          </div>
        </form>
      </PageContainer>

      <CarModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
      />
    </>
  );
}