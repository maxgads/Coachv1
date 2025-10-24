import React, { useState, useMemo, useCallback } from 'react';
import type { Habit, Schedule, CompletedTasks, CompletedHabits } from '../types';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { getDaysOfCurrentWeek, formatDateKey, parseDateKey, getWeeklyProgressData } from '../utils/helpers';
import { 
  FiChevronDown, FiMaximize2, FiMinimize2, FiTrendingUp, FiTrendingDown,
  FiClock, FiTarget, FiCalendar, FiZap, FiEdit, FiMove,
  FiActivity, FiPieChart, FiBarChart2, FiList, FiGrid, FiRefreshCw,
  FiAward, FiAlertCircle, FiCheckCircle, FiInfo, FiStar, FiArrowUp,
  FiArrowDown, FiChevronLeft, FiChevronRight, FiEye, FiEyeOff
} from 'react-icons/fi';
import { ProductivityHeatmapCard } from './ProductivityHeatmapCard';
import LineChart from './ui/LineChart';
import BarChart from './ui/BarChart';
import DonutChart from './ui/DonutChart';


// ===============================================================
// == ADVANCED ANALYTICS FUNCTIONS (MOCK IMPLEMENTATIONS) ==
// ===============================================================

const calculateProductivityScore = (completedTasks: CompletedTasks, scheduleByDate: Schedule, timeRange: 'week' | 'month' | 'all') => {
    return {
        score: 82,
        level: 'Excelente'
    };
};

const getStudyTrends = (completedTasks: CompletedTasks, scheduleByDate: Schedule, totalWeeks: number) => {
    return {
        weeklyTrend: 5, // percentage
    };
};

const calculateEfficiencyRate = (completedTasks: CompletedTasks, scheduleByDate: Schedule) => {
    let totalHours = 0;
    let completedHours = 0;

    Object.values(scheduleByDate).flat().forEach(task => {
        totalHours += task.hours;
    });

    Object.keys(completedTasks).forEach(taskId => {
        const [dateKey, taskIndexStr] = taskId.split('-');
        const taskIndex = parseInt(taskIndexStr, 10);
        const task = scheduleByDate[dateKey]?.[taskIndex];
        if (task && completedTasks[taskId]) {
            completedHours += task.hours;
        }
    });

    const rate = totalHours > 0 ? completedHours / totalHours : 0;
    let classification = 'Bajo';
    if (rate > 0.8) classification = 'Excelente';
    else if (rate > 0.6) classification = 'Bueno';
    else if (rate > 0.4) classification = 'Regular';
    
    return {
        rate,
        classification,
        insights: 'Tu eficiencia es mayor en tareas de menos de 2 horas.'
    };
};

const getWeeklyStats = (scheduleByDate: Schedule, completedTasks: CompletedTasks, weekPage: number, weeksPerPage: number, totalWeeks: number) => {
    let totalHours = 0;
    let completedHours = 0;
    let completedTasksCount = 0;
    const activeDays = new Set<string>();

    const dateKeys = Object.keys(scheduleByDate).sort();
    if(dateKeys.length === 0) {
        return {
            totalHours: 0,
            percentage: 0,
            completedTasks: 0,
            completedDays: 0,
            badge: 'Bajo'
        };
    }
    
    const startWeek = weekPage * weeksPerPage;
    const endWeek = Math.min(startWeek + weeksPerPage, totalWeeks);

    const scheduleStartDate = parseDateKey(dateKeys[0]);

    for (let weekNum = startWeek; weekNum < endWeek; weekNum++) {
        for (let i = 0; i < 7; i++) {
            const date = new Date(scheduleStartDate);
            date.setDate(date.getDate() + (weekNum * 7) + i);
            const dateKey = formatDateKey(date);

            const tasks = scheduleByDate[dateKey] || [];
            tasks.forEach((task, idx) => {
                totalHours += task.hours;
                const taskId = `${dateKey}-${idx}`;
                if (completedTasks[taskId]) {
                    completedHours += task.hours;
                    completedTasksCount++;
                    activeDays.add(dateKey);
                }
            });
        }
    }

    const percentage = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
    
    let badge = 'Bajo';
    if (percentage > 85) badge = 'Excelente';
    else if (percentage > 70) badge = 'Bueno';
    else if (percentage > 50) badge = 'Regular';

    return {
        totalHours,
        percentage,
        completedTasks: completedTasksCount,
        completedDays: activeDays.size,
        badge
    };
};

// ===============================================================

interface AnalyticsProps {
    scheduleByDate: Schedule;
    completedTasks: CompletedTasks;
    completedHabits: CompletedHabits;
    subjects: string[];
    habits: Habit[];
    totalWeeks: number;
}

interface CollapsibleCardProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    onToggle?: (isOpen: boolean) => void;
    extraButton?: React.ReactNode;
    className?: string;
    badge?: string;
    icon?: React.ReactNode;
    isEditing?: boolean;
}

// ============= COMPONENTES AUXILIARES =============

// Card colapsable mejorado con animaciones
const CollapsibleCard: React.FC<CollapsibleCardProps> = React.memo(({ 
    title, 
    children, 
    defaultOpen = true, 
    onToggle, 
    extraButton, 
    className = '',
    badge,
    icon,
    isEditing
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const handleToggle = useCallback(() => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);
        onToggle?.(newIsOpen);
    }, [isOpen, onToggle]);

    const badgeColors = {
        'Excelente': 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
        'Bueno': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
        'Regular': 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30',
        'Bajo': 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-500/30'
    };

    return (
        <motion.div 
            layout
            className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow break-inside-avoid mb-6 ${className}`}
        >
            <button 
                onClick={handleToggle}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-[var(--bg-inner)] transition-all group"
                disabled={isEditing}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                     {isEditing && <FiMove className="text-[var(--text-secondary)] cursor-grab" />}
                    {icon && (
                        <motion.div 
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="p-2 bg-gradient-to-br from-[var(--accent-green)]/20 to-blue-500/20 rounded-lg flex-shrink-0"
                        >
                            {icon}
                        </motion.div>
                    )}
                    <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)] truncate group-hover:text-[var(--accent-green)] transition-colors">
                        {title}
                    </h2>
                    {badge && (
                        <span className={`px-3 py-1 text-xs rounded-full font-bold border ${badgeColors[badge as keyof typeof badgeColors] || 'bg-gray-500/20 text-gray-400'}`}>
                            {badge}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {extraButton}
                    {!isEditing &&
                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FiChevronDown className="text-[var(--text-secondary)]" />
                        </motion.div>
                    }
                </div>
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-[var(--border-color)]"
                    >
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

CollapsibleCard.displayName = 'CollapsibleCard';


// Progress Bar con animación
const AnimatedProgressBar: React.FC<{
    percentage: number;
    color?: string;
    height?: string;
    showLabel?: boolean;
}> = ({ percentage, color = 'var(--accent-green)', height = 'h-2', showLabel = false }) => (
    <div className="relative">
        <div className={`w-full bg-[var(--border-color)] rounded-full ${height} overflow-hidden`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`${height} rounded-full`}
                style={{ backgroundColor: color }}
            />
        </div>
        {showLabel && (
            <div className="absolute right-0 -top-6 text-xs font-bold text-[var(--text-primary)]">
                {percentage}%
            </div>
        )}
    </div>
);

type ChartType = 'weeklyProgress' | 'productivityTrend' | 'subjectDistribution' | 'efficiencyRate' | 'performanceRadar' | 'studyHeatmap';

// Chart Container con opciones
const ChartContainer: React.FC<{
    title: string;
    type: ChartType;
    data: any;
    isExpanded: boolean;
    onExpand: () => void;
}> = ({ title, type, data, isExpanded, onExpand }) => {
     const renderChart = () => {
        switch (type) {
            case 'weeklyProgress':
                return <LineChart labels={data.weeklyProgress.labels} values={data.weeklyProgress.values} color="var(--accent-green)" />;
            case 'subjectDistribution':
                return <DonutChart data={data.subjectDistribution} />;
            case 'efficiencyRate':
                return <BarChart labels={data.efficiencyRate.labels} values={data.efficiencyRate.values} color="var(--accent-terracotta)" />;
            default:
                return (
                    <div className="w-full h-full bg-[var(--bg-inner)] rounded-lg border border-[var(--border-color)] flex items-center justify-center">
                        <div className="text-center text-[var(--text-secondary)]">
                            <div className="text-4xl mb-2">📊</div>
                            <div className="text-sm">Gráfico '{title}' no disponible.</div>
                        </div>
                    </div>
                );
        }
    };
    
    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg text-[var(--text-primary)]">{title}</h3>
                <div className="flex gap-2">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onExpand}
                        className="p-2 bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg hover:border-[var(--accent-green)] transition-all"
                    >
                        {isExpanded ? <FiMinimize2 size={16} /> : <FiMaximize2 size={16} />}
                    </motion.button>
                </div>
            </div>
            
            <div className={`${isExpanded ? 'h-96' : 'h-80'} transition-all duration-300`}>
                 {renderChart()}
            </div>
        </div>
    );
};

const HabitConsistencyMatrix: React.FC<{
    habits: Habit[];
    completedHabits: CompletedHabits;
}> = ({ habits, completedHabits }) => {
    const dates = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 28 }, (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            return date;
        }).reverse();
    }, []);

    if (habits.length === 0) {
        return <div className="text-center p-8 text-[var(--text-secondary)]">No hay hábitos para analizar.</div>;
    }

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="flex pb-2">
                    <div className="w-32 flex-shrink-0"></div>
                    {dates.map((date, index) => (
                        <div key={index} className="w-8 text-center flex-shrink-0">
                            <div className="text-xs text-[var(--text-secondary)]">
                                {['D', 'L', 'M', 'X', 'J', 'V', 'S'][date.getDay()]}
                            </div>
                            <div className="text-sm font-bold text-[var(--text-primary)]">
                                {date.getDate()}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    {habits.map(habit => (
                        <div key={habit.id} className="flex items-center">
                            <div className="w-32 flex-shrink-0 flex items-center gap-2 pr-2" title={habit.name}>
                                <span className="text-lg">{habit.icon}</span>
                                <span className="text-sm text-[var(--text-secondary)] truncate">{habit.name}</span>
                            </div>
                            {dates.map((date) => {
                                const dateKey = formatDateKey(date);
                                const isCompleted = completedHabits[dateKey]?.[habit.id];
                                return (
                                    <div key={dateKey} className="w-8 h-8 flex-shrink-0 p-px">
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            className={`w-full h-full rounded transition-colors ${isCompleted ? 'bg-[var(--accent-green)]' : 'bg-[var(--bg-inner)] border border-[var(--border-color)]'}`}
                                            title={`${date.toLocaleDateString()}: ${isCompleted ? 'Completado' : 'No completado'}`}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// ============= COMPONENTE PRINCIPAL =============
const Analytics: React.FC<AnalyticsProps> = ({ 
    scheduleByDate, 
    completedTasks, 
    completedHabits, 
    subjects, 
    habits, 
    totalWeeks 
}) => {
    const [weekPage, setWeekPage] = useState(0);
    const [chartType, setChartType] = useState<ChartType>('subjectDistribution');
    const [isChartExpanded, setIsChartExpanded] = useState(false);
    const [isEditingLayout, setIsEditingLayout] = useState(false);

    const WEEKS_PER_PAGE = 4;
    const totalPages = Math.ceil(totalWeeks / WEEKS_PER_PAGE);

    const weeklyStats = useMemo(() => 
        getWeeklyStats(scheduleByDate, completedTasks, weekPage, WEEKS_PER_PAGE, totalWeeks),
        [scheduleByDate, completedTasks, weekPage, totalWeeks]
    );

    const subjectStats = useMemo(() => {
        return subjects.map(subject => {
            let totalCursada = 0, completedCursada = 0;
            let totalExtra = 0, completedExtra = 0;

            Object.entries(scheduleByDate).forEach(([dateKey, tasks]) => {
                tasks.forEach((task, idx) => {
                    const fullSubjectName = task.subject;
                    if (fullSubjectName.startsWith(subject)) {
                        const taskId = `${dateKey}-${idx}`;
                        const isCompleted = !!completedTasks[taskId];
                        
                        if (fullSubjectName.includes('(Cursada)')) {
                            totalCursada += task.hours;
                            if (isCompleted) completedCursada += task.hours;
                        } else {
                            totalExtra += task.hours;
                            if (isCompleted) completedExtra += task.hours;
                        }
                    }
                });
            });

            return { subject, totalCursada, completedCursada, totalExtra, completedExtra };
        });
    }, [scheduleByDate, completedTasks, subjects]);

    const chartData = useMemo(() => {
        const weeklyProgress = getWeeklyProgressData(scheduleByDate, completedTasks, totalWeeks);
        const subjectDistribution = subjectStats.map((s, i) => ({
            name: s.subject,
            value: s.completedCursada + s.completedExtra,
            color: ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#10b981', '#06b6d4'][i % 6]
        })).filter(s => s.value > 0);

        const efficiencyData = subjectStats.map(s => {
            const total = s.totalCursada + s.totalExtra;
            const completed = s.completedCursada + s.completedExtra;
            return total > 0 ? (completed / total) * 100 : 0;
        });

        const subjectLabels = subjectStats.map(s => s.subject);

        return {
            weeklyProgress: {
                labels: Array.from({ length: totalWeeks }, (_, i) => `S${i + 1}`),
                values: weeklyProgress
            },
            subjectDistribution,
            efficiencyRate: {
                labels: subjectLabels,
                values: efficiencyData
            }
        };
    }, [scheduleByDate, completedTasks, totalWeeks, subjectStats]);
    
    const initialCardOrder = [
        'dataVisualization', 'productivityHeatmap', 'weeklySummary', 'subjectPerformance', 'habitAnalysis'
    ];
    const [cardOrder, setCardOrder] = useState(initialCardOrder);
    
    // FIX: Moved chartOptions declaration before it is used in cardComponents
    const chartOptions = [
        { id: 'subjectDistribution' as ChartType, label: 'Distribución', icon: <FiPieChart /> },
        { id: 'weeklyProgress' as ChartType, label: 'Progreso', icon: <FiActivity /> },
        { id: 'efficiencyRate' as ChartType, label: 'Eficiencia', icon: <FiZap /> },
        { id: 'productivityTrend' as ChartType, label: 'Tendencia', icon: <FiTrendingUp /> },
        { id: 'performanceRadar' as ChartType, label: 'Radar', icon: <FiTarget /> },
        { id: 'studyHeatmap' as ChartType, label: 'Mapa de Calor', icon: <FiCalendar /> },
    ];

    const cardComponents: { [key: string]: React.ReactNode } = {
        dataVisualization: (
             <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 relative">
                 {isEditingLayout && <FiMove className="absolute top-4 right-4 text-[var(--text-secondary)] cursor-grab" />}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Visualización de Datos</h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
                    { [
                        { id: 'subjectDistribution' as ChartType, label: 'Distribución', icon: <FiPieChart /> },
                        { id: 'weeklyProgress' as ChartType, label: 'Progreso', icon: <FiActivity /> },
                        { id: 'efficiencyRate' as ChartType, label: 'Eficiencia', icon: <FiZap /> },
                        { id: 'productivityTrend' as ChartType, label: 'Tendencia', icon: <FiTrendingUp /> },
                        { id: 'performanceRadar' as ChartType, label: 'Radar', icon: <FiTarget /> },
                        { id: 'studyHeatmap' as ChartType, label: 'Mapa de Calor', icon: <FiCalendar /> },
                    ].map(option => (
                        <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setChartType(option.id)}
                            className={`p-3 rounded-lg border transition-all ${
                                chartType === option.id
                                    ? 'bg-gradient-to-r from-[var(--accent-green)] to-blue-500 text-white border-transparent shadow-lg'
                                    : 'bg-[var(--bg-inner)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-green)]'
                            }`}
                        >
                            <div className="text-2xl mb-2 flex justify-center">{option.icon}</div>
                            <div className="text-xs font-semibold text-center">{option.label}</div>
                        </motion.button>
                    ))}
                </div>

                <ChartContainer
                    title={chartOptions.find(o => o.id === chartType)?.label || ''}
                    type={chartType}
                    data={chartData}
                    isExpanded={isChartExpanded}
                    onExpand={() => setIsChartExpanded(!isChartExpanded)}
                />
            </div>
        ),
        productivityHeatmap: (
            <ProductivityHeatmapCard 
                scheduleByDate={scheduleByDate}
                completedTasks={completedTasks}
                isEditing={isEditingLayout}
            />
        ),
        weeklySummary: (
            <CollapsibleCard 
                title="Resumen Semanal de Estudio" 
                badge={weeklyStats.badge}
                icon={<FiCalendar className="text-[var(--accent-green)]" />}
                isEditing={isEditingLayout}
                extraButton={
                    <div className="flex gap-1">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (weekPage > 0) setWeekPage(weekPage - 1);
                            }}
                            disabled={weekPage === 0}
                            className="p-1 hover:bg-[var(--bg-inner)] rounded disabled:opacity-50"
                        >
                            <FiChevronLeft />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (weekPage < totalPages - 1) setWeekPage(weekPage + 1);
                            }}
                            disabled={weekPage >= totalPages - 1}
                            className="p-1 hover:bg-[var(--bg-inner)] rounded disabled:opacity-50"
                        >
                            <FiChevronRight />
                        </motion.button>
                    </div>
                }
            >
                <div className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-[var(--bg-inner)] rounded-lg">
                                <div className="text-2xl font-bold text-[var(--text-primary)]">
                                    {weeklyStats.totalHours.toFixed(1)}h
                                </div>
                                <div className="text-xs text-[var(--text-secondary)]">Total Horas</div>
                            </div>
                            <div className="text-center p-4 bg-[var(--bg-inner)] rounded-lg">
                                <div className="text-2xl font-bold text-[var(--accent-green)]">
                                    {weeklyStats.percentage}%
                                </div>
                                <div className="text-xs text-[var(--text-secondary)]">Completado</div>
                            </div>
                            <div className="text-center p-4 bg-[var(--bg-inner)] rounded-lg">
                                <div className="text-2xl font-bold text-[var(--text-primary)]">
                                    {weeklyStats.completedTasks}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)]">Tareas</div>
                            </div>
                            <div className="text-center p-4 bg-[var(--bg-inner)] rounded-lg">
                                <div className="text-2xl font-bold text-[var(--text-primary)]">
                                    {weeklyStats.completedDays}
                                </div>
                                <div className="text-xs text-[var(--text-secondary)]">Días Activos</div>
                            </div>
                        </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 pt-2 border-t border-[var(--border-color)]">
                            <span className="text-sm text-[var(--text-secondary)]">
                                Semanas {weekPage * WEEKS_PER_PAGE + 1}-{Math.min((weekPage + 1) * WEEKS_PER_PAGE, totalWeeks)} de {totalWeeks}
                            </span>
                        </div>
                    )}
                </div>
            </CollapsibleCard>
        ),
        subjectPerformance: (
            <CollapsibleCard 
                title="Rendimiento por Materia"
                icon={<FiBarChart2 className="text-purple-400" />}
                isEditing={isEditingLayout}
            >
                <div className="space-y-3">
                    {subjectStats.map(({ subject, totalCursada, completedCursada, totalExtra, completedExtra }) => {
                        const cursadaPercentage = totalCursada > 0 ? Math.round((completedCursada / totalCursada) * 100) : 0;
                        const extraPercentage = totalExtra > 0 ? Math.round((completedExtra / totalExtra) * 100) : 0;
                        
                        return(
                            <motion.div 
                                key={subject}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ x: 4 }}
                                className="p-4 bg-[var(--bg-inner)] rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-green)] transition-all"
                            >
                                <span className="text-md font-semibold truncate text-[var(--text-primary)] block mb-3">
                                    {subject}
                                </span>
                                
                                <div className="space-y-3">
                                    {totalCursada > 0 && (
                                        <div>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-xs font-semibold text-[var(--text-secondary)]">Cursada</span>
                                                <span className="text-xs text-[var(--text-primary)]">{completedCursada.toFixed(1)}h / {totalCursada.toFixed(1)}h</span>
                                            </div>
                                            <AnimatedProgressBar percentage={cursadaPercentage} color="#8b5cf6" />
                                        </div>
                                    )}
                                    {totalExtra > 0 && (
                                        <div>
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-xs font-semibold text-[var(--text-secondary)]">Estudio Extra</span>
                                                <span className="text-xs text-[var(--text-primary)]">{completedExtra.toFixed(1)}h / {totalExtra.toFixed(1)}h</span>
                                            </div>
                                            <AnimatedProgressBar percentage={extraPercentage} color="#3b82f6" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </CollapsibleCard>
        ),
        habitAnalysis: (
            <CollapsibleCard 
                title="Matriz de Consistencia de Hábitos"
                icon={<FiCheckCircle className="text-green-400" />}
                isEditing={isEditingLayout}
                defaultOpen={false}
            >
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Visualizá tu constancia en cada hábito durante los últimos 28 días.
                </p>
                <HabitConsistencyMatrix habits={habits} completedHabits={completedHabits} />
            </CollapsibleCard>
        )
    };
    


    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent-green)] bg-clip-text text-transparent mb-2"
                    >
                        Centro de Analytics
                    </motion.h1>
                    <p className="text-[var(--text-secondary)]">
                        Análisis profundo de tu rendimiento académico
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditingLayout(!isEditingLayout)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all ${
                        isEditingLayout 
                            ? 'bg-[var(--accent-green)] text-white' 
                            : 'bg-[var(--bg-card)] border border-[var(--border-color)]'
                    }`}
                >
                    <FiEdit />
                    {isEditingLayout ? 'Guardar Diseño' : 'Editar Diseño'}
                </motion.button>
            </div>
            
            <Reorder.Group axis="y" values={cardOrder} onReorder={setCardOrder} className="space-y-6">
                {cardOrder.map(cardKey => (
                    <Reorder.Item key={cardKey} value={cardKey}>
                        {cardComponents[cardKey]}
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl p-6 text-center"
            >
                <p className="text-sm text-[var(--text-secondary)]">
                    📊 Analytics actualizado en tiempo real • Última actualización: {new Date().toLocaleString('es-AR')}
                </p>
            </motion.div>

        </div>
    );
};

export default React.memo(Analytics);
