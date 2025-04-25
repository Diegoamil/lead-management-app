import React from 'react';
import { Company } from '../../types';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

type CompanyCardProps = {
  company: Company;
  onClick?: () => void;
};

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <div 
      className="bg-white border border-gray-300 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        {company.logo ? (
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 mr-4">
            <img 
              src={company.logo} 
              alt={company.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
          <p className="text-sm text-gray-500">{company.cnpj}</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{company.address}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{company.phone}</span>
        </div>
        
        {company.email && (
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{company.email}</span>
          </div>
        )}
      </div>
    </div>
  );
}
