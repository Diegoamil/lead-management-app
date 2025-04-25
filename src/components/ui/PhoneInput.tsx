import { useState, useEffect } from 'react';

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string;
  id?: string;
  name?: string;
  label?: string;
};

export function PhoneInput({
  value,
  onChange,
  placeholder = '(00) 0 0000-0000',
  required = false,
  className = '',
  error,
  id,
  name,
  label,
}: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Aplicar máscara ao valor inicial e quando o valor mudar externamente
  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  // Função para formatar o número de telefone no padrão XX X XXXX-XXXX
  const formatPhoneNumber = (phoneNumber: string) => {
    // Remove todos os caracteres não numéricos
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Aplica a máscara conforme os dígitos disponíveis
    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digits = inputValue.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD + 9 + número)
    if (digits.length <= 11) {
      const formattedValue = formatPhoneNumber(digits);
      setDisplayValue(formattedValue);
      onChange(digits); // Passa apenas os dígitos para o componente pai
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="tel"
        id={id}
        name={name}
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        autoComplete="tel"
        className={`w-full bg-gray-50 text-gray-900 rounded-lg px-4 py-3.5 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
