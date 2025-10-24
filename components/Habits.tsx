import React from 'react';
import type { Habit, CompletedHabits, Schedule } from '../types';
import { formatDateKey, getTodayHabitCompletion, getHabitStreaks } from '../utils/helpers';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CircleIcon from './icons/CircleIcon';

interface HabitsProps {
    habits: Habit[];
    completedHabits: CompletedHabits;
    toggleHabit: (habitId: string, dateKey: string) => void;
    currentTime: Date;
    scheduleByDate: Schedule;
}

const Habits: React.FC<HabitsProps> = ({ habits, completedHabits, toggleHabit, currentTime, scheduleByDate }) => {
    const todayStats = getTodayHabitCompletion(habits, completedHabits, currentTime);
    
    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
             <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">Hábitos Diarios</h1>
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                <div className="mb-6 p-4 bg-[#222222] rounded-lg border border-[var(--border-color)]">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{todayStats.percentage}%</div>
                        <div className="text-sm text-[var(--text-secondary)]">{todayStats.completed} de {todayStats.total} hábitos hoy</div>
                         <div className="w-full bg-[var(--border-color)] rounded-full h-1.5 mt-2 max-w-xs mx-auto">
                            <div className="bg-[var(--accent-green)] h-1.5 rounded-full" style={{ width: `${todayStats.percentage}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {habits.map(habit => {
                        const todayKey = formatDateKey(currentTime);
                        const isCompleted = completedHabits[todayKey] && completedHabits[todayKey][habit.id];
                        const streaks = getHabitStreaks(habit.id, completedHabits, scheduleByDate);

                        return (
                            <div key={habit.id} className={`p-4 rounded-lg border transition-all ${isCompleted ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]/50' : 'bg-[#222222] border-[var(--border-color)]'}`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => toggleHabit(habit.id, todayKey)} className="flex-shrink-0">
                                            {isCompleted ? <CheckCircleIcon className="text-[var(--accent-green)]" size={24} /> : <CircleIcon className="text-[var(--text-secondary)]" size={24} />}
                                        </button>
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{habit.icon}</span>
                                            <span className="text-md font-semibold">{habit.name}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-center">
                                        <div>
                                            <div className="font-bold text-lg text-[var(--text-primary)]">{streaks.current}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">Racha Actual</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-[var(--text-primary)]">{streaks.best}</div>
                                            <div className="text-xs text-[var(--text-secondary)]">Mejor Racha</div>
                                        </div>
                                        {habit.critical && !isCompleted && (<span className="text-xs px-2 py-1 bg-[var(--accent-terracotta)]/20 text-[var(--accent-terracotta)] rounded border border-[var(--accent-terracotta)]/30 font-semibold">CRÍTICO</span>)}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-[var(--accent-terracotta)]/10 border border-[var(--accent-terracotta)]/30 rounded-xl p-6">
                <h2 className="text-lg text-[var(--accent-terracotta)] mb-4 font-serif font-semibold">Reglas Clave</h2>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                    <li className="flex items-start gap-3"><span className="text-[var(--accent-terracotta)]">×</span><span>Trasnochar estudiando (mejor dormir y madrugar)</span></li>
                    <li className="flex items-start gap-3"><span className="text-[var(--accent-terracotta)]">×</span><span>"Una partidita nomás" - El LoL es trampa</span></li>
                    <li className="flex items-start gap-3"><span className="text-[var(--accent-terracotta)]">×</span><span>Fumar estas 3 semanas (afecta memoria)</span></li>
                    <li className="flex items-start gap-3"><span className="text-[var(--accent-terracotta)]">×</span><span>Estudiar nuevo el día del parcial (solo repasar)</span></li>
                </ul>
            </div>
        </div>
    );
};

export default Habits;