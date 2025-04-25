import React, { useState } from 'react';
import { Check, ChevronDown, Plus } from 'lucide-react';

type Option = {
  value: string;
  label: string;
};

type ComboboxProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onCreateNew?: () => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
};

export function Combobox({
  label,
  options,
  value,
  onChange,
  onCreateNew,
  required = false,
  error,
  placeholder,
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-gray-50 text-left text-gray-900 rounded-lg px-4 py-3.5 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
      >
        <div className="flex items-center justify-between">
          <span className={!selectedOption ? 'text-gray-500' : ''}>
            {selectedOption ? selectedOption.label : placeholder || 'Selecione...'}
          </span>
          <ChevronDown size={18} className="text-gray-500" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
          {onCreateNew && (
            <button
              type="button"
              onClick={() => {
                onCreateNew();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center text-blue-600"
            >
              <Plus size={18} className="mr-2" />
              Adicionar novo veículo
            </button>
          )}

          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
            >
              {option.label}
              {option.value === value && (
                <Check size={18} className="text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}