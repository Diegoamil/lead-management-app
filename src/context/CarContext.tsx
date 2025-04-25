import React, { createContext, useContext, useState } from 'react';
import { Car } from '../types';

type CarContextType = {
  cars: Car[];
  addCar: (model: string, price: number) => void;
  getCar: (id: string) => Car | undefined;
};

const CarContext = createContext<CarContextType | undefined>(undefined);

// Mock data
const initialCars: Car[] = [
  {
    id: '1',
    model: 'HB20 Sense 1.0',
    price: 69990,
    createdAt: new Date(),
  },
  {
    id: '2',
    model: 'Onix LT 1.0',
    price: 72990,
    createdAt: new Date(),
  },
];

export function CarProvider({ children }: { children: React.ReactNode }) {
  const [cars, setCars] = useState<Car[]>(initialCars);

  const addCar = (model: string, price: number) => {
    const newCar: Car = {
      id: Date.now().toString(),
      model,
      price,
      createdAt: new Date(),
    };
    setCars(prev => [...prev, newCar]);
  };

  const getCar = (id: string) => {
    return cars.find(car => car.id === id);
  };

  return (
    <CarContext.Provider value={{ cars, addCar, getCar }}>
      {children}
    </CarContext.Provider>
  );
}

export function useCars() {
  const context = useContext(CarContext);
  if (context === undefined) {
    throw new Error('useCars must be used within a CarProvider');
  }
  return context;
}