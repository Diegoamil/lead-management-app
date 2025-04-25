import React from 'react';

type BadgeVariant = 'new' | 'qualifying' | 'proposal' | 'closed' | 'rejected' | 'active' | 'won' | 'lost';

type BadgeProps = {
  variant: BadgeVariant;
  label: string;
};

export function Badge({ variant, label }: BadgeProps) {
  const variantStyles = {
    new: 'bg-blue-100 text-blue-800',
    qualifying: 'bg-purple-100 text-purple-800',
    proposal: 'bg-amber-100 text-amber-800',
    closed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    active: 'bg-gray-100 text-gray-800',
    won: 'bg-green-100 text-green-800',
    lost: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${variantStyles[variant]}`}>
      {label}
    </span>
  );
}