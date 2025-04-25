import React from 'react';
import { Seller } from '../../types';
import { useCompanies } from '../../context/CompanyContext';
import { Avatar } from '../ui/Avatar';
import { Phone, Mail, Building } from 'lucide-react';

type SellerCardProps = {
  seller: Seller;
  onClick?: () => void;
};

export function SellerCard({ seller, onClick }: SellerCardProps) {
  const { getCompany } = useCompanies();
  const company = getCompany(seller.companyId);
  
  return (
    <div 
      className={`bg-white border border-gray-300 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer ${!seller.active ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <Avatar name={seller.name} imageUrl={seller.avatar} size="lg" />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">{seller.name}</h3>
          <p className="text-sm text-gray-500">{seller.role || 'Vendedor'}</p>
          {!seller.active && (
            <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full mt-1">
              Inativo
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{seller.phone}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{seller.email}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Building className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{company?.name || 'Empresa não encontrada'}</span>
        </div>
      </div>
    </div>
  );
}
