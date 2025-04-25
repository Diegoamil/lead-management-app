import React from 'react';

type TextAreaProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
  name?: string;
  rows?: number;
};

export function TextArea({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  name,
  rows = 3,
}: TextAreaProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 font-medium mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        rows={rows}
        className={`w-full bg-gray-50 text-gray-900 rounded-lg px-4 py-3 border ${
          error ? 'border-red-500' : 'border-gray-200'
        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
        required={required}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}