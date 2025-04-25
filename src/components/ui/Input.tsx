import React from 'react';

type InputProps = {
  type?: 'text' | 'tel' | 'password' | 'email';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
  name?: string;
  autoComplete?: string;
};

export function Input({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  name,
  autoComplete,
}: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        autoComplete={autoComplete}
        className={`w-full bg-gray-50 text-gray-900 rounded-lg px-4 py-3.5 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}