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
import { PhoneInput } from '../components/ui/PhoneInput';
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
  const [loadingLead, setLoadingLead] = useState(true);
  
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
    
    const fetchLeadData = async () => {
      try {
        setLoadingLead(true);
        const leadData = await getLead(id);
        
        if (leadData) {
          setLead(leadData);
          // Initialize form state
          setName(leadData.name);
          setPhone(leadData.phone);
          setSource(leadData.source as LeadSource);
          setStage(leadData.stage as FunnelStage);
          setStatus(leadData.status as LeadStatus);
          setNotes(leadData.notes || '');
        } else {
          console.error('Lead não encontrado');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao buscar lead:', error);
        navigate('/dashboard');
      } finally {
        setLoadingLead(false);
      }
    };
    
    fetchLeadData();
  }, [id, getLead, navigate]);
  
  const handleSave = async () => {
    if (!id) return;
    
    try {
      setIsSaving(true);
      
      const updates = {
        name,
        phone,
        source,
        stage,
        status,
        notes
      };
      
      await updateLead(id, updates);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Função para renderizar o badge de status
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="gray">Inativo</Badge>;
      case 'won':
        return <Badge variant="primary">Ganho</Badge>;
      case 'lost':
        return <Badge variant="danger">Perdido</Badge>;
      default:
        return null;
    }
  };
  
  // Função para renderizar o badge de estágio
  const getStageBadge = (stage: FunnelStage) => {
    switch (stage) {
      case 'new':
        return <Badge variant="info">Novo</Badge>;
      case 'qualifying':
        return <Badge variant="warning">Qualificando</Badge>;
      case 'proposal':
        return <Badge variant="primary">Proposta</Badge>;
      case 'negotiation':
        return <Badge variant="secondary">Negociação</Badge>;
      case 'closed':
        return <Badge variant="success">Fechado</Badge>;
      case 'rejected':
        return <Badge variant="danger">Rejeitado</Badge>;
      default:
        return null;
    }
  };
  
  if (loadingLead || isLoading) {
    return (
      <>
        <Header title="Detalhes do Lead" />
        <PageContainer>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </PageContainer>
      </>
    );
  }
  
  if (!lead) {
    return (
      <>
        <Header title="Detalhes do Lead" />
        <PageContainer>
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Lead não encontrado</p>
          </div>
        </PageContainer>
      </>
    );
  }
  
  return (
    <>
      <Header title={isEditing ? "Editar Lead" : "Detalhes do Lead"} />
      
      <PageContainer>
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 text-lg font-semibold">
                  {name.substring(0, 1).toUpperCase()}
                </span>
              </div>
              
              {isEditing ? (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do lead"
                  className="font-semibold text-lg"
                />
              ) : (
                <h2 className="font-semibold text-lg">{name}</h2>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  icon={<Edit2 size={16} />}
                >
                  Editar
                </Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleSave}
                  icon={<Check size={16} />}
                  loading={isSaving}
                >
                  Salvar
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Telefone</p>
              {isEditing ? (
                <PhoneInput
                  value={phone}
                  onChange={setPhone}
                  placeholder="(00) 00000-0000"
                />
              ) : (
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-1" />
                  <a href={`tel:${phone}`} className="text-primary-600 hover:underline">
                    {phone}
                  </a>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Origem</p>
              {isEditing ? (
                <Select
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                >
                  <option value="website">Website</option>
                  <option value="referral">Indicação</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="trafego">Tráfego Pago</option>
                </Select>
              ) : (
                <div className="capitalize">
                  {source === 'website' && 'Website'}
                  {source === 'referral' && 'Indicação'}
                  {source === 'instagram' && 'Instagram'}
                  {source === 'facebook' && 'Facebook'}
                  {source === 'whatsapp' && 'WhatsApp'}
                  {source === 'trafego' && 'Tráfego Pago'}
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Estágio</p>
              {isEditing ? (
                <Select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as FunnelStage)}
                >
                  <option value="new">Novo</option>
                  <option value="qualifying">Qualificando</option>
                  <option value="proposal">Proposta</option>
                  <option value="negotiation">Negociação</option>
                  <option value="closed">Fechado</option>
                  <option value="rejected">Rejeitado</option>
                </Select>
              ) : (
                getStageBadge(stage)
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              {isEditing ? (
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="won">Ganho</option>
                  <option value="lost">Perdido</option>
                </Select>
              ) : (
                getStatusBadge(status)
              )}
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Interesse</p>
            <div className="flex items-center mb-2">
              <Car size={16} className="text-gray-400 mr-1" />
              <span>{lead.interest}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 mb-1">Observações</p>
            {isEditing ? (
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre este lead..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {notes || "Nenhuma observação."}
              </p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Veículos de Interesse</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCarModalOpen(true)}
            >
              Adicionar Veículo
            </Button>
          </div>
          
          {cars.length === 0 ? (
            <p className="text-gray-500 text-sm">Nenhum veículo adicionado.</p>
          ) : (
            <div className="space-y-2">
              {cars.map(car => (
                <div 
                  key={car.id} 
                  className="p-3 border border-gray-200 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{car.model}</p>
                    <p className="text-sm text-gray-500">
                      {new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(car.price)}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">Ver Detalhes</Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageContainer>
      
      <CarModal
        isOpen={isCarModalOpen}
        onClose={() => setIsCarModalOpen(false)}
        onSave={(car) => {
          console.log('Veículo adicionado:', car);
          setIsCarModalOpen(false);
        }}
      />
    </>
  );
}