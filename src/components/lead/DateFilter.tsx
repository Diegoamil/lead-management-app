import React, { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

type DateFilterProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
};

type DatePreset = 'custom' | 'today' | 'last7' | 'last15' | 'last30';

export function DateFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<DatePreset>('custom');
  
  const formatDateToString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  const getPresetLabel = (preset: DatePreset): string => {
    switch (preset) {
      case 'today': return 'Hoje';
      case 'last7': return 'Últimos 7 dias';
      case 'last15': return 'Últimos 15 dias';
      case 'last30': return 'Últimos 30 dias';
      default: return 'Intervalo personalizado';
    }
  };
  
  const applyPreset = (preset: DatePreset) => {
    const today = new Date();
    let start = new Date();
    let end = new Date();
    
    switch (preset) {
      case 'today':
        // Start and end are both today
        break;
      case 'last7':
        start.setDate(today.getDate() - 7);
        break;
      case 'last15':
        start.setDate(today.getDate() - 15);
        break;
      case 'last30':
        start.setDate(today.getDate() - 30);
        break;
      case 'custom':
        // Don't change dates, just close dropdown
        setIsDropdownOpen(false);
        setActivePreset('custom');
        return;
    }
    
    const startDateStr = formatDateToString(start);
    const endDateStr = formatDateToString(end);
    
    onStartDateChange(startDateStr);
    onEndDateChange(endDateStr);
    setActivePreset(preset);
    setIsDropdownOpen(false);
  };
  
  // Check if dates were manually changed and update preset accordingly
  React.useEffect(() => {
    if (activePreset !== 'custom') {
      const today = new Date();
      const todayStr = formatDateToString(today);
      
      // Check if current dates match any preset
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const endStr = formatDateToString(end);
        
        if (endStr !== todayStr) {
          setActivePreset('custom');
          return;
        }
        
        const daysDiff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0 && endStr === todayStr) {
          setActivePreset('today');
        } else if (daysDiff === 7) {
          setActivePreset('last7');
        } else if (daysDiff === 15) {
          setActivePreset('last15');
        } else if (daysDiff === 30) {
          setActivePreset('last30');
        } else {
          setActivePreset('custom');
        }
      }
    }
  }, [startDate, endDate, activePreset]);
  
  return (
    <div className="flex items-center gap-3 py-2 px-4 -mx-4 mb-3 bg-white border-b border-gray-200">
      <Calendar size={18} className="text-gray-500" />
      
      <div className="flex items-center gap-2 flex-1">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 bg-gray-50 text-gray-700 text-sm rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {getPresetLabel(activePreset)}
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="py-1">
                <button
                  onClick={() => applyPreset('today')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activePreset === 'today' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                >
                  Hoje
                </button>
                <button
                  onClick={() => applyPreset('last7')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activePreset === 'last7' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                >
                  Últimos 7 dias
                </button>
                <button
                  onClick={() => applyPreset('last15')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activePreset === 'last15' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                >
                  Últimos 15 dias
                </button>
                <button
                  onClick={() => applyPreset('last30')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activePreset === 'last30' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                >
                  Últimos 30 dias
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => applyPreset('custom')}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${activePreset === 'custom' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                >
                  Intervalo personalizado
                </button>
              </div>
            </div>
          )}
        </div>
        
        {activePreset === 'custom' && (
          <>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="flex-1 bg-gray-50 text-gray-900 text-sm rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="flex-1 bg-gray-50 text-gray-900 text-sm rounded-lg px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </>
        )}
      </div>
    </div>
  );
}