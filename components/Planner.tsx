import React, { useState, useMemo } from 'react';
import type { Schedule, CompletedTasks, ScheduleTask } from '../types';
import { formatDateKey } from '../utils/helpers';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface PlannerProps {
    scheduleByDate: Schedule;
    completedTasks: CompletedTasks;
    toggleTask: (taskId: string) => void;
}

const SubjectIcon: React.FC<{ subject: string }> = ({ subject }) => {
    const s = subject.toLowerCase();
    if (s.includes('básquet')) return <>🏀</>;
    if (s.includes('gym')) return <>💪</>;
    if (s.includes('cena')) return <>🍽️</>;
    if (s.includes('descanso')) return <>🌴</>;
    if (s.includes('repaso')) return <>📝</>;
    if (s.includes('parcial')) return <>🎯</>;
    return <>📚</>;
};

const SubjectDot: React.FC<{ subject: string }> = ({ subject }) => {
    const s = subject.toLowerCase();
    let color = 'bg-gray-500'; // Default
    if (s.includes('termo')) color = 'bg-red-400';
    if (s.includes('racional')) color = 'bg-blue-400';
    if (s.includes('estructuras')) color = 'bg-yellow-400';
    if (s.includes('electro')) color = 'bg-purple-400';
    if (s.includes('gym') || s.includes('básquet')) color = 'bg-orange-400';

    return <span className={`w-2 h-2 rounded-full ${color} inline-block`}></span>;
};


const Planner: React.FC<PlannerProps> = ({ scheduleByDate, completedTasks, toggleTask }) => {
    const [weekOffset, setWeekOffset] = useState(0);

    const weekDays = useMemo(() => {
        const days = [];
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1) + weekOffset * 7);
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            days.push(date);
        }
        return days;
    }, [weekOffset]);
    
    return (
        <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">Cronograma Semanal</h1>
                <div className="flex items-center space-x-4">
                    <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-4 py-2 rounded-lg text-sm bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors">← Ant.</button>
                    <span className="font-medium text-[var(--text-primary)] text-center w-48">
                        {weekDays[0].toLocaleDateString('es-ES', {day:'numeric', month:'short'})} - {weekDays[6].toLocaleDateString('es-ES', {day:'numeric', month:'short', year: 'numeric'})}
                    </span>
                    <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-4 py-2 rounded-lg text-sm bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors">Sig. →</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weekDays.map((date) => {
                    const dateKey = formatDateKey(date);
                    const dayTasks = scheduleByDate[dateKey] || [];
                    const isToday = formatDateKey(new Date()) === dateKey;
                    
                    return (
                        <div 
                            key={dateKey} 
                            className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-4 min-h-[300px] flex flex-col ${isToday ? 'ring-2 ring-[var(--accent-terracotta)]' : ''}`}
                        >
                            <div className="text-center mb-4 pb-2 border-b border-[var(--border-color)]">
                                <div className="font-serif text-lg font-semibold text-[var(--text-secondary)] uppercase">
                                    {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                                </div>
                                <div className="text-2xl font-bold text-[var(--text-primary)]">{date.getDate()}</div>
                            </div>

                            <div className="space-y-3 overflow-y-auto flex-grow p-1 -m-1">
                                {dayTasks.length > 0 ? (
                                    dayTasks.map((task, taskIndex) => {
                                        const taskId = `${dateKey}-${taskIndex}`;
                                        const isCompleted = completedTasks[taskId];
                                        return (
                                            <div
                                                key={taskIndex}
                                                className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 text-left ${isCompleted ? 'bg-[var(--accent-green)]/10' : 'bg-[#222222]'}`}
                                                onClick={() => toggleTask(taskId)}
                                            >
                                                <p className="text-xs font-semibold text-[var(--accent-terracotta)] mb-1">{task.start}</p>
                                                <div className="flex items-center gap-2">
                                                    <SubjectDot subject={task.subject} />
                                                    <p className={`text-sm font-semibold ${isCompleted ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                                                        {task.subject}
                                                    </p>
                                                </div>

                                                <p className="text-xs text-[var(--text-secondary)] mt-1">{task.task}</p>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center h-full text-[var(--text-secondary)]">
                                        <div className="mb-2 text-3xl">🍃</div>
                                        <p className="text-xs">Día libre</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Planner;