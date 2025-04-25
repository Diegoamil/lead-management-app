import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, Edit2, Check, Car } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Combobox } from '../components/ui/Combobox';
import { TextArea } from '../components/ui/TextArea';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { CarModal } from '../components/car/CarModal';
import { useLeads } from '../context/LeadContext';
import { useCars } from '../context/CarContext';
import { Lead, FunnelStage, LeadStatus, LeadSource } from '../types';

export function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLead, updateLead, isLoading } = useLeads();
  const { cars } = useCars();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('instagram');
  const [selectedCarId, setSelectedCarId] = useState('');
  const [stage, setStage] = useState<FunnelStage>('new');
  const [status, setStatus] = useState<LeadStatus>('active');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const leadData = getLead(id);
    if (leadData) {
      setLead(leadData);
      // Initialize form state
      setName(leadData.name);
      setPhone(leadData.phone);
      setSource(leadData.source);
      setStage(leadData.stage);
      setStatus(leadData.status);
      setNotes(leadData.notes);
      
      // Try to find the car ID from the interest string
      const carMatch = cars.find(car => 
        leadData.interest.startsWith(car.model)
      );
      if (carMatch) {
        setSelectedCarId(carMatch.id);
      }
    }
  }, [id, getLead, cars]);

  if (isLoading || !lead) {
    return (
      <>
        <Header title="Detalhes do Lead" showBackButton />
        <PageContainer>
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Carregando informações...</p>
          </div>
        </PageContainer>
      </>
    );
  }

  const handleSave = () => {
    if (!id) return;
    
    setIsSaving(true);
    
    const selectedCar = cars.find(car => car.id === selectedCarId);
    const interest = selectedCar 
      ? `${selectedCar.model} - ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(selectedCar.price)}`
      : '';
    
    const updates = {
      name,
      phone,
      source,
      interest,
      stage,
      status,
      notes
    };
    
    updateLead(id, updates);
    
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      setLead({
        ...lead,
        ...updates,
        updatedAt: new Date()
      });
    }, 500);
  };

  const handleMarkAsClosed = () => {
    if (!id) return;
    
    updateLead(id, {
      stage: 'closed',
      status: 'won'
    });
    
    setLead({
      ...lead,
      stage: 'closed',
      status: 'won',
      updatedAt: new Date()
    });
    
    setStage('closed');
    setStatus('won');
  };

  const sourceOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Indicação' },
    { value: 'trafego', label: 'Tráfego' },
    { value: 'other', label: 'Outro' }
  ];

  const stageOptions = [
    { value: 'new', label: 'Novo' },
    { value: 'qualifying', label: 'Qualificando' },
    { value: 'proposal', label: 'Proposta' },
    { value: 'rejected', label: 'Ficha recusada' },
    { value: 'closed', label: 'Fechado' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Ativo' },
    { value: 'won', label: 'Ganho' },
    { value: 'lost', label: 'Perdido' }
  ];

  const carOptions = cars.map(car => ({
    value: car.id,
    label: `${car.model} - ${new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(car.price)}`
  }));

  return (
    <>
      <Header 
        title={isEditing ? "Editar Lead" : lead.name} 
        showBackButton
        rightAction={
          !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Edit2 size={20} className="text-gray-700" />
            </button>
          )
        }
      />
      
      <PageContainer>
        {!isEditing ? (
          <>
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex items-center mb-4">
                <Phone className="text-blue-600 mr-2" size={18} />
                <a href={`tel:${lead.phone}`} className="text-blue-600 font-medium">
                  {lead.phone}
                </a>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Origem</p>
                  <p className="font-medium capitalize">{lead.source}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Interesse</p>
                  <div className="flex items-center">
                    <Car size={16} className="text-gray-500 mr-2" />
                    <p className="font-medium">{lead.interest || "Não informado"}</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Etapa</p>
                    <Badge variant={lead.stage} label={stageOptions.find(o => o.value === lead.stage)?.label || ""} />
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <Badge variant={lead.status} label={statusOptions.find(o => o.value === lead.status)?.label || ""} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <p className="text-sm text-gray-500 mb-2">Notas</p>
              <p className="text-gray-700 whitespace-pre-line">
                {lead.notes || "Nenhuma nota adicionada."}
              </p>
            </div>
            
            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <Button 
                variant="success" 
                fullWidth
                icon={<Check size={18} />}
                onClick={handleMarkAsClosed}
                disabled={lead.stage === 'closed'}
              >
                {lead.stage === 'closed' ? 'Lead já fechado' : 'Marcar como Fechado'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 pb-32">
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome completo"
                required
              />
              
              <Input
                label="Telefone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
              
              <Select
                label="Origem"
                options={sourceOptions}
                value={source}
                onChange={(val) => setSource(val as LeadSource)}
              />
              
              <Combobox
                label="Interesse"
                options={carOptions}
                value={selectedCarId}
                onChange={setSelectedCarId}
                onCreateNew={() => setIsCarModalOpen(true)}
                placeholder="Selecione um veículo"
              />
              
              <Select
                label="Etapa do Funil"
                options={stageOptions}
                value={stage}
                onChange={(val) => setStage(val as FunnelStage)}
              />
              
              <Select
                label="Status"
                options={statusOptions}
                value={status}
                onChange={(val) => setStatus(val as LeadStatus)}
              />
              
              <TextArea
                label="Notas"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione notas importantes sobre este lead..."
              />
            </div>
            
            <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Salvando...' : 'Salvar alterações'}
                </Button>
              </div>
            </div>
          </>
        )}
      </PageContainer>

      <CarModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
      />
    </>
  );
}