import React, { useState, FormEvent } from 'react';
import { Seller } from '../../types';
import { useSellers } from '../../context/SellerContext';
import { useCompanies } from '../../context/CompanyContext';
import { PhoneInput } from '../ui/PhoneInput';
import { PasswordInput } from '../ui/PasswordInput';

type SellerFormProps = {
  initialData?: Partial<Seller>;
  onSubmit?: () => void;
  onCancel?: () => void;
};

export function SellerForm({ initialData, onSubmit, onCancel }: SellerFormProps) {
  const { addSeller, updateSeller } = useSellers();
  const { companies, isLoading: isLoadingCompanies } = useCompanies();
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    companyId: initialData?.companyId || '',
    role: initialData?.role || '',
    avatar: initialData?.avatar || '',
    active: initialData?.active !== undefined ? initialData.active : true,
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Limpar erro quando o campo é editado
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome do vendedor é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (!formData.companyId) {
      newErrors.companyId = 'Empresa é obrigatória';
    }
    
    // Validação de senha apenas para novos vendedores
    if (!initialData?.id) {
      if (!formData.password) {
        newErrors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    } else if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Remover confirmPassword antes de enviar para a API
      const { confirmPassword, ...sellerData } = formData;
      
      if (initialData?.id) {
        // Se não tiver senha, não enviar campo vazio
        const dataToUpdate = sellerData.password ? sellerData : {
          name: sellerData.name,
          email: sellerData.email,
          phone: sellerData.phone,
          companyId: sellerData.companyId,
          role: sellerData.role,
          avatar: sellerData.avatar,
          active: sellerData.active
        };
        
        await updateSeller(initialData.id, dataToUpdate);
      } else {
        await addSeller(sellerData);
      }
      
      if (onSubmit) {
        onSubmit();
      }
    } catch (error) {
      console.error('Erro ao salvar vendedor:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome do Vendedor *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Nome completo"
        />
        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="email@exemplo.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
      </div>
      
      <div>
        <PhoneInput
          label="Telefone *"
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          placeholder="(00) 0 0000-0000"
          error={errors.phone}
        />
      </div>
      
      <div>
        <label htmlFor="companyId" className="block text-sm font-medium text-gray-700 mb-1">
          Empresa *
        </label>
        <select
          id="companyId"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${errors.companyId ? 'border-red-500' : 'border-gray-300'}`}
          disabled={isLoadingCompanies}
        >
          <option value="">Selecione uma empresa</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        {errors.companyId && <p className="mt-1 text-sm text-red-500">{errors.companyId}</p>}
      </div>
      
      {/* Campo de senha - obrigatório para novos vendedores, opcional para edição */}
      <div>
        <PasswordInput
          label={initialData?.id ? 'Senha (deixe em branco para manter a atual)' : 'Senha *'}
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder={initialData?.id ? '••••••••' : 'Digite uma senha'}
          error={errors.password}
          required={!initialData?.id}
        />
      </div>
      
      <div>
        <PasswordInput
          label={initialData?.id ? 'Confirmar Senha' : 'Confirmar Senha *'}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirme a senha"
          error={errors.confirmPassword}
          required={!initialData?.id}
        />
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Cargo
        </label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Cargo ou função"
        />
      </div>
      
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
          URL da Foto
        </label>
        <input
          type="text"
          id="avatar"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="https://exemplo.com/foto.jpg"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          name="active"
          checked={formData.active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
          Vendedor ativo
        </label>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvando...' : initialData?.id ? 'Atualizar' : 'Cadastrar'}
        </button>
      </div>
    </form>
  );
}
