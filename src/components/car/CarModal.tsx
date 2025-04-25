import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCars } from '../../context/CarContext';
import { carSchema } from '../../types';

type CarModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CarModal({ isOpen, onClose }: CarModalProps) {
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const { addCar } = useCars();

  if (!isOpen) return null;

  // Format price with dots for thousands and commas for decimal places
  const formatPrice = (value: string) => {
    // Remove any non-digit character
    const digits = value.replace(/\D/g, '');
    
    // Convert to number (in cents)
    const cents = parseInt(digits, 10);
    
    if (isNaN(cents) || cents === 0) {
      return '';
    }
    
    // Format with 2 decimal places and proper separators
    // Convert cents to reais (divide by 100)
    const valueAsReais = cents / 100;
    
    // Format with Brazilian currency pattern (dots for thousands, comma for decimals)
    return valueAsReais.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Convert formatted price (with dots and commas) to a number
  const parsePrice = (formattedPrice: string) => {
    // Remove dots and replace comma with dot for proper number parsing
    const numericString = formattedPrice.replace(/\./g, '').replace(',', '.');
    return parseFloat(numericString);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value);
    setPrice(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const priceNumber = parsePrice(price);
      const result = carSchema.parse({ model, price: priceNumber });
      
      addCar(result.model, result.price);
      setModel('');
      setPrice('');
      onClose();
    } catch (err) {
      setError('Preencha todos os campos corretamente');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 relative">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Novo Veículo</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <Input
            label="Modelo"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Ex: HB20 Sense 1.0"
            required
          />

          <Input
            label="Preço"
            type="text"
            value={price}
            onChange={handlePriceChange}
            placeholder="0,00"
            required
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              type="button"
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              fullWidth
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}