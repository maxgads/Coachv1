import React, { useState, useMemo, useId } from 'react';
import type { Schedule, CompletedTasks, ScheduleTask } from '../types';
import { parseDateKey, formatDateKey } from '../utils/helpers';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { FiChevronLeft, FiChevronRight, FiMove } from 'react-icons/fi';
import { motion } from 'framer-motion';


interface CollapsibleCardProps { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean; 
  className?: string; 
  isEditing?: boolean;
  extraControls?: React.ReactNode;
}
const CollapsibleCard: React.FC<CollapsibleCardProps> = ({ 
  title, 
  children, 
  defaultOpen = true, 
  className = '',
  isEditing,
  extraControls
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentId = useId();
    return (
        <div className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex flex-col transition-all duration-300 break-inside-avoid mb-6 ${className}`}>
            <button 
                onClick={() => setIsOpen(prev => !prev)} 
                aria-expanded={isOpen} 
                aria-controls={contentId}
                className="w-full flex justify-between items-center p-6 text-left group hover:bg-[var(--bg-inner)] transition-colors"
                disabled={isEditing}
            >
                <div className="flex items-center gap-3">
                   {isEditing && <FiMove className="text-[var(--text-secondary)] cursor-grab" />}
                   <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    {extraControls}
                    {!isEditing &&
                      <ChevronDownIcon className={`transform transition-transform text-[var(--text-secondary)] ${isOpen ? 'rotate-180' : ''}`} />
                    }
                </div>
            </button>
            {isOpen && <div id={contentId} className="px-6 pb-6 h-full flex flex-col">{children}</div>}
        </div>
    );
};


/**
 * Generates the dataset for the Productivity Heatmap.
 */
export const getProductivityHeatmapData = (
  scheduleByDate: Schedule,
  completedTasks: CompletedTasks
): Record<string, number> => {
  const heatmapData: Record<string, number> = {};

  for (const taskId in completedTasks) {
    if (!completedTasks[taskId]) continue;

    const parts = taskId.split('-');
    if (parts.length < 4) continue;
    
    const dateKey = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const taskIndex = parseInt(parts[3], 10);
    if (isNaN(taskIndex)) continue;

    try {
      const date = parseDateKey(dateKey);
      const dayOfWeek = date.getDay();
      const task = scheduleByDate[dateKey]?.[taskIndex];
      
      if (task) {
        const startHour = parseInt(task.start.split(':')[0], 10);
        const startMinute = parseInt(task.start.split(':')[1], 10);
        const endHour = parseInt(task.end.split(':')[0], 10);
        const endMinute = parseInt(task.end.split(':')[1], 10);

        if (isNaN(startHour) || isNaN(endHour) || isNaN(startMinute) || isNaN(endMinute)) continue;

        for (let h = startHour; h <= endHour; h++) {
          if (h > 23) break;

          let hoursInThisSlot = 0;
          if (h === startHour && h === endHour) {
            hoursInThisSlot = (endMinute - startMinute) / 60;
          } else if (h === startHour) {
            hoursInThisSlot = (60 - startMinute) / 60;
          } else if (h === endHour) {
            hoursInThisSlot = endMinute / 60;
          } else {
            hoursInThisSlot = 1;
          }
          
          if (hoursInThisSlot > 0) {
            const key = `${dayOfWeek}-${h}`;
            heatmapData[key] = (heatmapData[key] || 0) + hoursInThisSlot;
          }
        }
      }
    } catch (e) {
      console.error(`Error processing task ID: ${taskId}`, e);
    }
  }
  return heatmapData;
};


/**
 * UI component that renders the heatmap chart.
 */
const ProductivityHeatmap: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23
  
  const maxVal = Math.max(1, ...Object.values(data)); 

  return (
    <div className="w-full overflow-x-auto p-1">
      <div className="flex text-xs text-center min-w-max">
        <div className="w-8 sticky left-0 bg-[var(--bg-card)] z-10">&nbsp;</div>
        {hours.map(hour => (
          <div key={hour} className="w-6 text-[var(--text-secondary)]">
            {hour % 2 === 0 ? hour : ''}
          </div>
        ))}
      </div>
      
      {days.map((day, dayIndex) => (
        <div key={day} className="flex min-w-max">
          <div className="w-8 text-xs text-[var(--text-secondary)] sticky left-0 bg-[var(--bg-card)] z-10 flex items-center justify-center">
            {day}
          </div>
          
          {hours.map(hour => {
            const key = `${dayIndex}-${hour}`;
            const value = data[key] || 0;
            const opacity = value / maxVal;
            
            return (
              <div 
                key={key} 
                className="w-6 h-6 m-px rounded border border-[var(--border-color)] transition-colors"
                style={{ backgroundColor: `rgba(var(--color-accent-green-rgb), ${opacity})` }}
                title={`${day} ${hour}:00 - ${value.toFixed(1)}h`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};


interface ProductivityHeatmapCardProps {
  scheduleByDate: Schedule;
  completedTasks: CompletedTasks;
  isEditing?: boolean;
}

/**
 * Main component for the Productivity Heatmap module.
 */
export const ProductivityHeatmapCard: React.FC<ProductivityHeatmapCardProps> = ({
  scheduleByDate, completedTasks, isEditing
}) => {
  const [weekOffset, setWeekOffset] = useState(0);

  const { weekSchedule, weekCompletedTasks, weekDateRange } = useMemo(() => {
    const startOfWeek = new Date();
    startOfWeek.setHours(0,0,0,0);
    startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1) + weekOffset * 7);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const weekSchedule: Schedule = {};
    const weekCompletedTasks: CompletedTasks = {};
    
    for (let d = new Date(startOfWeek); d <= endOfWeek; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDateKey(d);
        if (scheduleByDate[dateKey]) {
            weekSchedule[dateKey] = scheduleByDate[dateKey];
            scheduleByDate[dateKey].forEach((_, index) => {
                const taskId = `${dateKey}-${index}`;
                if(completedTasks[taskId]){
                    weekCompletedTasks[taskId] = true;
                }
            })
        }
    }
    
    const weekDateRange = `${startOfWeek.toLocaleDateString('es-ES', {day:'numeric', month:'short'})} - ${endOfWeek.toLocaleDateString('es-ES', {day:'numeric', month:'short'})}`;

    return { weekSchedule, weekCompletedTasks, weekDateRange };
  }, [scheduleByDate, completedTasks, weekOffset]);

  const heatmapData = useMemo(() => 
    getProductivityHeatmapData(weekSchedule, weekCompletedTasks),
    [weekSchedule, weekCompletedTasks]
  );
  
  const handleWeekChange = (e: React.MouseEvent, direction: number) => {
    e.stopPropagation();
    setWeekOffset(prev => prev + direction);
  };
  
  return (
    <CollapsibleCard 
        title={`Mapa de Productividad (${weekDateRange})`} 
        defaultOpen={true}
        isEditing={isEditing}
        extraControls={
            <div className="flex gap-1">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleWeekChange(e, -1)}
                    className="p-1 hover:bg-[var(--bg-inner)] rounded"
                >
                    <FiChevronLeft />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleWeekChange(e, 1)}
                    className="p-1 hover:bg-[var(--bg-inner)] rounded"
                >
                    <FiChevronRight />
                </motion.button>
            </div>
        }
    >
      <div className="flex flex-col h-full">
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Visualiza las horas de estudio completadas por día y bloque horario para identificar tus momentos de mayor rendimiento.
        </p>
        <div className="flex-grow">
          <ProductivityHeatmap data={heatmapData} />
        </div>
      </div>
    </CollapsibleCard>
  );
};