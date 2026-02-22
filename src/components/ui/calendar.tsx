'use client';

import * as React from "react"

interface CalendarProps {
  mode?: 'single' | 'multiple';
  selected?: Date | Date[];
  onSelect?: (date: Date | undefined) => void;
  modifiers?: Record<string, Date[]>;
  modifiersStyles?: Record<string, React.CSSProperties>;
  className?: string;
}

export function Calendar({ 
  mode = 'single', 
  selected, 
  onSelect, 
  modifiers = {}, 
  modifiersStyles = {},
  className = '' 
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  
  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];
  
  const dayNames = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const getDayModifiers = (date: Date) => {
    const modifierKeys: string[] = [];
    Object.entries(modifiers).forEach(([key, dates]) => {
      if (dates.some(d => 
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      )) {
        modifierKeys.push(key);
      }
    });
    return modifierKeys;
  };
  
  const isSelected = (date: Date) => {
    if (!selected) return false;
    if (Array.isArray(selected)) {
      return selected.some(d => 
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
      );
    }
    return selected.getDate() === date.getDate() &&
      selected.getMonth() === date.getMonth() &&
      selected.getFullYear() === date.getFullYear();
  };
  
  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dayModifiers = getDayModifiers(date);
    const selected = isSelected(date);
    
    let style: React.CSSProperties = {};
    dayModifiers.forEach(mod => {
      if (modifiersStyles[mod]) {
        style = { ...style, ...modifiersStyles[mod] };
      }
    });
    
    days.push(
      <button
        key={day}
        onClick={() => onSelect?.(date)}
        className={`h-10 w-10 rounded-md text-sm transition-all hover:bg-white/5 ${
          selected ? 'bg-zorya-violet text-white' : ''
        }`}
        style={style}
      >
        {day}
      </button>
    );
  }
  
  return (
    <div className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-md">
          ←
        </button>
        <h2 className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-md">
          →
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(name => (
          <div key={name} className="h-10 flex items-center justify-center text-xs text-white/60">
            {name}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}
