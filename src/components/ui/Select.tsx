import React from 'react';
import { ChevronDown } from 'lucide-react';

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  name?: string;
};

export function Select({
  label,
  options,
  value,
  onChange,
  required = false,
  placeholder,
  error,
  name,
}: SelectProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          name={name}
          className={`appearance-none w-full bg-gray-50 text-gray-900 rounded-lg px-4 py-3.5 border ${
            error ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
          required={required}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}