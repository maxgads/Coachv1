import React, { useState, useMemo } from 'react';
import type { Habit, Schedule, CompletedTasks, CompletedHabits } from '../types';
import { parseDateKey, getWeeklyStats, getSubjectStats, getWeeklyProgressData, getDaysOfCurrentWeek, getWeeklyHabitStats } from '../utils/helpers';
import ChevronDownIcon from './icons/ChevronDownIcon';
import BarChart from './ui/BarChart';
import LineChart from './ui/LineChart';
import ExpandIcon from './icons/ExpandIcon';
import MinimizeIcon from './icons/MinimizeIcon';

interface AnalyticsProps {
    scheduleByDate: Schedule;
    completedTasks: CompletedTasks;
    completedHabits: CompletedHabits;
    subjects: string[];
    habits: Habit[];
    totalWeeks: number;
}

const CollapsibleCard: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean, onToggle?: () => void, extraButton?: React.ReactNode, className?: string }> = ({ title, children, defaultOpen = true, onToggle, extraButton, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (onToggle) onToggle();
    }

    return (
        <div className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex flex-col transition-all duration-300 break-inside-avoid mb-6 ${className}`}>
            <div className="w-full flex justify-between items-center p-6 text-left">
                <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
                <div className="flex items-center gap-2">
                    {extraButton}
                    <button onClick={handleToggle}>
                        <ChevronDownIcon className={`transform transition-transform text-[var(--text-secondary)] ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="px-6 pb-6 animate-fade-in-slow h-full flex flex-col">
                    {children}
                </div>
            )}
        </div>
    );
};

type ChartType = 'completedHours' | 'totalHours' | 'habitPerformanceWeekly' | 'weeklyProgress';

const Analytics: React.FC<AnalyticsProps> = ({ scheduleByDate, completedTasks, completedHabits, subjects, habits, totalWeeks }) => {
    const [weekPage, setWeekPage] = useState(0);
    const [chartType, setChartType] = useState<ChartType>('weeklyProgress');
    const [isChartExpanded, setIsChartExpanded] = useState(false);
    
    const WEEKS_PER_PAGE = 4;
    const totalPages = Math.ceil(totalWeeks / WEEKS_PER_PAGE);
    const weekDays = useMemo(() => getDaysOfCurrentWeek(), []);


    const chartData = useMemo(() => {
        switch (chartType) {
            case 'completedHours':
                return {
                    type: 'bar',
                    labels: subjects,
                    values: subjects.map(s => getSubjectStats(s, scheduleByDate, completedTasks).completedHours),
                    color: 'var(--accent-green)'
                };
            case 'totalHours':
                return {
                    type: 'bar',
                    labels: subjects,
                    values: subjects.map(s => getSubjectStats(s, scheduleByDate, completedTasks).totalHours),
                    color: 'var(--accent-terracotta)'
                };
            case 'habitPerformanceWeekly':
                const weeklyHabitData = getWeeklyHabitStats(habits, completedHabits);
                return {
                    type: 'bar',
                    labels: weeklyHabitData.map(h => h.name),
                    values: weeklyHabitData.map(h => h.completedThisWeek),
                    color: 'var(--accent-green)'
                };
            case 'weeklyProgress':
                 return {
                    type: 'line',
                    labels: Array.from({ length: totalWeeks }, (_, i) => `S${i + 1}`),
                    values: getWeeklyProgressData(scheduleByDate, completedTasks, totalWeeks),
                    color: 'var(--accent-green)'
                };
        }
    }, [chartType, subjects, habits, scheduleByDate, completedTasks, completedHabits, totalWeeks]);
    
    return (
        <div className="space-y-6 animate-fade-in">
             <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)] mb-2">Analíticas</h1>

            <div className="md:columns-2 gap-6">
                 <CollapsibleCard 
                    title="Visualización Gráfica"
                    className={`${isChartExpanded ? 'md:col-span-2' : ''}`}
                    extraButton={
                        <button onClick={() => setIsChartExpanded(!isChartExpanded)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                            {isChartExpanded ? <MinimizeIcon /> : <ExpandIcon />}
                        </button>
                    }
                >
                    <div className="flex flex-col h-full flex-grow">
                        <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value as ChartType)}
                            className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-terracotta)] mb-4"
                        >
                            <option value="weeklyProgress">Progreso Semanal (Horas)</option>
                            <option value="completedHours">Horas Completadas (Materia)</option>
                            <option value="totalHours">Horas Totales (Materia)</option>
                            <option value="habitPerformanceWeekly">Rendimiento de Hábitos (Semana Actual)</option>
                        </select>
                        <div className={`flex-grow ${isChartExpanded ? 'min-h-[300px]' : 'min-h-[200px]'}`}>
                           {chartData.type === 'bar' && <BarChart labels={chartData.labels} values={chartData.values} color={chartData.color} />}
                           {chartData.type === 'line' && <LineChart labels={chartData.labels} values={chartData.values} color={chartData.color} />}
                        </div>
                    </div>
                </CollapsibleCard>
                 
                 <CollapsibleCard title="Comparativa Semanal">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {Array.from({ length: WEEKS_PER_PAGE }, (_, i) => weekPage * WEEKS_PER_PAGE + i).map(weekNum => {
                            if (weekNum >= totalWeeks) return <div key={weekNum} />;
                            const stats = getWeeklyStats(weekNum, scheduleByDate, completedTasks);
                            return (
                                <div key={weekNum} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg p-4">
                                    <div className="text-xs text-[var(--text-secondary)] mb-2">Sem {weekNum + 1}</div>
                                    <div className="text-xl font-bold text-[var(--text-primary)] mb-2">{stats.completedHours.toFixed(1)}h / {stats.totalHours.toFixed(1)}h</div>
                                    <div className="w-full bg-[var(--border-color)] rounded-full h-2 mb-2">
                                        <div className={`h-2 rounded-full transition-all bg-[var(--accent-green)]`} style={{ width: `${stats.percentage}%` }}></div>
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)]">{stats.percentage}%</div>
                                </div>
                            );
                        })}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-[var(--border-color)]">
                            <button onClick={() => setWeekPage(p => p - 1)} disabled={weekPage === 0} className="px-3 py-1 text-sm rounded-md bg-[var(--bg-inner)] disabled:opacity-50 disabled:cursor-not-allowed">Anterior</button>
                            <span className="text-xs text-[var(--text-secondary)]">Página {weekPage + 1} de {totalPages}</span>
                            <button onClick={() => setWeekPage(p => p + 1)} disabled={weekPage + 1 >= totalPages} className="px-3 py-1 text-sm rounded-md bg-[var(--bg-inner)] disabled:opacity-50 disabled:cursor-not-allowed">Siguiente</button>
                        </div>
                    )}
                </CollapsibleCard>

                <CollapsibleCard title="Estadísticas por Materia">
                    <div className="space-y-3">
                        {subjects.map(subject => {
                            const stats = getSubjectStats(subject, scheduleByDate, completedTasks);
                            return (
                                <div key={subject} className="p-3 bg-[var(--bg-inner)] rounded-lg border border-[var(--border-color)]">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold">{subject}</span>
                                        <span className={`text-sm font-bold text-[var(--accent-green)]`}>{stats.percentage}%</span>
                                    </div>
                                    <div className="text-xs text-[var(--text-secondary)] mb-2">{stats.completedHours.toFixed(1)}h / {stats.totalHours.toFixed(1)}h</div>
                                    <div className="w-full bg-[var(--border-color)] rounded-full h-2">
                                        <div className={`h-2 rounded-full transition-all bg-[var(--accent-green)]`} style={{ width: `${stats.percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CollapsibleCard>

                <CollapsibleCard title="Análisis de Hábitos">
                     <div className="space-y-4">
                        {habits.map(habit => {
                             const weeklyStats = getWeeklyHabitStats([habit], completedHabits)[0];
                            return (
                                <div key={habit.id} className="bg-[var(--bg-inner)] rounded-lg p-3 border border-[var(--border-color)]">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{habit.icon}</span>
                                            <span className="text-sm font-semibold">{habit.name}</span>
                                        </div>
                                        <span className="font-bold text-sm">{weeklyStats.completedThisWeek}/7</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 gap-2">
                                        {weekDays.map(day => (
                                            <div key={day.dateKey} title={day.dateKey} className={`h-3 w-full rounded-sm ${completedHabits[day.dateKey]?.[habit.id] ? 'bg-[var(--accent-green)]' : 'bg-[var(--border-color)]'}`}></div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CollapsibleCard>

            </div>
        </div>
    );
};

export default Analytics;