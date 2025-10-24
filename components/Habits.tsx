import React, { useState, useMemo } from 'react';
import type { Habit, CompletedHabits, Schedule } from '../types';
import { 
    formatDateKey, 
    getTodayHabitCompletion, 
    getHabitStreaks, 
    getDaysOfCurrentWeek, 
    getWeeklyHabitConsistency 
} from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiCheckCircle, FiCircle, FiAlertCircle, FiTrendingUp, 
    FiAward, FiCalendar, FiBarChart2, FiFilter, FiStar,
    FiTarget, FiZap, FiClock, FiDownload, FiChevronRight,
    FiEdit, FiTrash2, FiPlus
} from 'react-icons/fi';

interface HabitsProps {
    habits: Habit[];
    completedHabits: CompletedHabits;
    toggleHabit: (habitId: string, dateKey: string) => void;
    currentTime: Date;
    scheduleByDate: Schedule;
}

// Componente de Heatmap Mensual
const MonthlyHeatmap: React.FC<{ 
    habitId: string; 
    completedHabits: CompletedHabits;
    currentMonth: Date;
}> = ({ habitId, completedHabits, currentMonth }) => {
    // Generar días del mes
    const getDaysInMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        
        const days = [];
        // Días vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    const days = getDaysInMonth();
    const today = new Date();

    return (
        <div className="grid grid-cols-7 gap-1">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
                <div key={day} className="text-xs text-center text-[var(--text-secondary)] font-semibold p-1">
                    {day}
                </div>
            ))}
            {days.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
                
                const dateKey = formatDateKey(day);
                const isCompleted = completedHabits[dateKey]?.[habitId];
                const isToday = day.toDateString() === today.toDateString();
                const isFuture = day > today;
                
                return (
                    <motion.div
                        key={dateKey}
                        whileHover={{ scale: isFuture ? 1 : 1.2 }}
                        className={`
                            aspect-square rounded flex items-center justify-center text-xs font-semibold
                            transition-all cursor-pointer
                            ${isCompleted ? 'bg-green-500 text-white shadow-sm' : ''}
                            ${!isCompleted && !isFuture ? 'bg-red-500/20' : ''}
                            ${isFuture ? 'bg-[var(--bg-inner)] opacity-50 cursor-not-allowed' : ''}
                            ${isToday ? 'ring-2 ring-blue-400' : ''}
                        `}
                        title={`${day.getDate()}/${day.getMonth() + 1} - ${isCompleted ? 'Completado' : 'Pendiente'}`}
                    >
                        {day.getDate()}
                    </motion.div>
                );
            })}
        </div>
    );
};

// Componente de Logros
const AchievementBadge: React.FC<{ 
    icon: string; 
    title: string; 
    description: string;
    unlocked: boolean;
    progress?: number;
}> = ({ icon, title, description, unlocked, progress }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className={`
            p-4 rounded-xl border transition-all
            ${unlocked 
                ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' 
                : 'bg-[var(--bg-inner)] border-[var(--border-color)] opacity-60'
            }
        `}
    >
        <div className="text-3xl mb-2 text-center">{icon}</div>
        <div className="text-sm font-bold text-center mb-1">{title}</div>
        <div className="text-xs text-[var(--text-secondary)] text-center">{description}</div>
        {!unlocked && progress !== undefined && (
            <div className="mt-2">
                <div className="h-1 bg-[var(--border-color)] rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-yellow-500 transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="text-xs text-center mt-1 text-[var(--text-secondary)]">
                    {progress}%
                </div>
            </div>
        )}
    </motion.div>
);

// Componente de estadística circular mejorado
const CircularProgress: React.FC<{ 
    percentage: number; 
    size?: number;
    strokeWidth?: number;
    color?: string;
    children?: React.ReactNode;
}> = ({ percentage, size = 120, strokeWidth = 8, color = '#10b981', children }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-[var(--border-color)]"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};

// Componente de carta de estadística avanzada
const AdvancedStatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: { value: number; isPositive: boolean };
    color: string;
}> = ({ icon, title, value, subtitle, trend, color }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg ${color}`}>
                {icon}
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-semibold ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    <FiTrendingUp className={trend.isPositive ? '' : 'rotate-180'} />
                    {Math.abs(trend.value)}%
                </div>
            )}
        </div>
        <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</div>
        <div className="text-xs text-[var(--text-secondary)] mb-1">{title}</div>
        <div className="text-xs text-[var(--text-secondary)]">{subtitle}</div>
    </motion.div>
);

// Componente principal de Hábitos
const Habits: React.FC<HabitsProps> = ({ 
    habits, 
    completedHabits, 
    toggleHabit, 
    currentTime, 
    scheduleByDate 
}) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('list');
    const [filterCategory, setFilterCategory] = useState<'all' | 'critical' | 'regular'>('all');
    const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
    const [showAchievements, setShowAchievements] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const todayStats = getTodayHabitCompletion(habits, completedHabits, currentTime);
    const weeklyConsistency = getWeeklyHabitConsistency(habits, completedHabits);
    const todayKey = formatDateKey(currentTime);

    // Calcular estadísticas avanzadas
    const stats = useMemo(() => {
        const totalCompletions = Object.values(completedHabits).reduce((acc, day) => 
            acc + Object.keys(day).length, 0
        );
        
        const allDates = Object.keys(completedHabits).sort();
        const longestStreak = habits.reduce((max, habit) => {
            const streaks = getHabitStreaks(habit.id, completedHabits, scheduleByDate);
            return Math.max(max, streaks.best);
        }, 0);

        const avgDailyCompletion = allDates.length > 0 
            ? (totalCompletions / allDates.length).toFixed(1)
            : 0;

        // Calcular mejor día de la semana
        const dayCompletions: Record<number, number[]> = {};
        allDates.forEach(dateKey => {
            const date = new Date(dateKey);
            const dayOfWeek = date.getDay();
            const completed = Object.keys(completedHabits[dateKey] || {}).length;
            if (!dayCompletions[dayOfWeek]) dayCompletions[dayOfWeek] = [];
            dayCompletions[dayOfWeek].push(completed);
        });

        let bestDay = 0;
        let bestDayAvg = 0;
        Object.entries(dayCompletions).forEach(([day, completions]) => {
            const avg = completions.reduce((a, b) => a + b, 0) / completions.length;
            if (avg > bestDayAvg) {
                bestDayAvg = avg;
                bestDay = parseInt(day);
            }
        });

        const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        return {
            totalCompletions,
            longestStreak,
            avgDailyCompletion,
            bestDay: dayNames[bestDay] || 'N/A',
            perfectDays: allDates.filter(dateKey => 
                Object.keys(completedHabits[dateKey] || {}).length === habits.length
            ).length
        };
    }, [completedHabits, habits, scheduleByDate]);

    // Sistema de logros
    const achievements = useMemo(() => [
        {
            icon: '🔥',
            title: 'Racha de Fuego',
            description: '7 días consecutivos',
            unlocked: stats.longestStreak >= 7,
            progress: Math.min((stats.longestStreak / 7) * 100, 100)
        },
        {
            icon: '💯',
            title: 'Perfeccionista',
            description: '10 días perfectos',
            unlocked: stats.perfectDays >= 10,
            progress: Math.min((stats.perfectDays / 10) * 100, 100)
        },
        {
            icon: '⚡',
            title: 'Imparable',
            description: '30 días seguidos',
            unlocked: stats.longestStreak >= 30,
            progress: Math.min((stats.longestStreak / 30) * 100, 100)
        },
        {
            icon: '🎯',
            title: 'Centenario',
            description: '100 hábitos completados',
            unlocked: stats.totalCompletions >= 100,
            progress: Math.min((stats.totalCompletions / 100) * 100, 100)
        },
        {
            icon: '👑',
            title: 'Leyenda',
            description: '90 días de racha',
            unlocked: stats.longestStreak >= 90,
            progress: Math.min((stats.longestStreak / 90) * 100, 100)
        },
        {
            icon: '💎',
            title: 'Diamante',
            description: '30 días perfectos',
            unlocked: stats.perfectDays >= 30,
            progress: Math.min((stats.perfectDays / 30) * 100, 100)
        }
    ], [stats]);

    const unlockedAchievements = achievements.filter(a => a.unlocked).length;

    // Filtrar hábitos
    const filteredHabits = useMemo(() => {
        return habits.filter(habit => {
            if (filterCategory === 'critical') return habit.critical;
            if (filterCategory === 'regular') return !habit.critical;
            return true;
        });
    }, [habits, filterCategory]);

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8 animate-fade-in">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-4xl font-bold text-[var(--text-primary)] mb-2">
                        Centro de Hábitos
                    </h1>
                    <p className="text-[var(--text-secondary)]">
                        Construí una mejor versión de vos mismo, un día a la vez
                    </p>
                </div>

                {/* Controles de vista */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            viewMode === 'list' 
                                ? 'bg-[var(--accent-green)] text-white' 
                                : 'bg-[var(--bg-card)] border border-[var(--border-color)]'
                        }`}
                    >
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            viewMode === 'grid' 
                                ? 'bg-[var(--accent-green)] text-white' 
                                : 'bg-[var(--bg-card)] border border-[var(--border-color)]'
                        }`}
                    >
                        Grid
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-4 py-2 rounded-lg transition-all ${
                            viewMode === 'calendar' 
                                ? 'bg-[var(--accent-green)] text-white' 
                                : 'bg-[var(--bg-card)] border border-[var(--border-color)]'
                        }`}
                    >
                        <FiCalendar />
                    </button>
                </div>
            </div>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 text-center">
                    <CircularProgress 
                        percentage={todayStats.percentage}
                        color="#10b981"
                    >
                        <div>
                            <div className="text-3xl font-bold text-[var(--text-primary)]">
                                {todayStats.percentage}%
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">Hoy</div>
                        </div>
                    </CircularProgress>
                    <div className="mt-4">
                        <div className="text-sm font-semibold text-[var(--text-primary)]">
                            Completado Hoy
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                            {todayStats.completed} de {todayStats.total} hábitos
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6 text-center">
                    <CircularProgress 
                        percentage={weeklyConsistency.percentage}
                        color="#f97316"
                    >
                        <div>
                            <div className="text-3xl font-bold text-[var(--text-primary)]">
                                {weeklyConsistency.percentage}%
                            </div>
                            <div className="text-xs text-[var(--text-secondary)]">Semana</div>
                        </div>
                    </CircularProgress>
                    <div className="mt-4">
                        <div className="text-sm font-semibold text-[var(--text-primary)]">
                            Consistencia Semanal
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                            {weeklyConsistency.completed} de {weeklyConsistency.total} completados
                        </div>
                    </div>
                </div>

                <AdvancedStatCard
                    icon={<FiZap size={24} />}
                    title="Racha Actual"
                    value={stats.longestStreak}
                    subtitle="días consecutivos"
                    color="bg-orange-500/20 text-orange-400"
                />

                <AdvancedStatCard
                    icon={<FiTarget size={24} />}
                    title="Días Perfectos"
                    value={stats.perfectDays}
                    subtitle="todos los hábitos"
                    color="bg-purple-500/20 text-purple-400"
                />
            </div>

            {/* Estadísticas adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FiBarChart2 className="text-blue-400" size={24} />
                        <span className="font-semibold text-[var(--text-primary)]">Promedio Diario</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">
                        {stats.avgDailyCompletion}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                        hábitos por día
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FiStar className="text-green-400" size={24} />
                        <span className="font-semibold text-[var(--text-primary)]">Mejor Día</span>
                    </div>
                    <div className="text-2xl font-bold text-[var(--text-primary)]">
                        {stats.bestDay}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                        día más productivo
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 cursor-pointer"
                    onClick={() => setShowAchievements(!showAchievements)}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FiAward className="text-yellow-400" size={24} />
                        <span className="font-semibold text-[var(--text-primary)]">Logros</span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text-primary)]">
                        {unlockedAchievements}/{achievements.length}
                    </div>
                    <div className="text-sm text-[var(--text-secondary)]">
                        desbloqueados
                    </div>
                </motion.div>
            </div>

            {/* Panel de Logros */}
            <AnimatePresence>
                {showAchievements && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                                🏆 Tus Logros
                            </h2>
                            <button
                                onClick={() => setShowAchievements(false)}
                                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {achievements.map((achievement, idx) => (
                                <AchievementBadge key={idx} {...achievement} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filtros */}
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <FiFilter className="text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">Filtrar:</span>
                </div>
                {['all', 'critical', 'regular'].map(filter => (
                    <button
                        key={filter}
                        onClick={() => setFilterCategory(filter as any)}
                        className={`
                            px-4 py-2 rounded-lg text-sm font-semibold transition-all
                            ${filterCategory === filter 
                                ? 'bg-[var(--accent-green)] text-white' 
                                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)]'
                            }
                        `}
                    >
                        {filter === 'all' && '📋 Todos'}
                        {filter === 'critical' && '🔴 Críticos'}
                        {filter === 'regular' && '⚪ Regulares'}
                    </button>
                ))}
            </div>

            {/* Lista de Hábitos */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {filteredHabits.map((habit) => {
                        const isCompleted = completedHabits[todayKey]?.[habit.id];
                        const streaks = getHabitStreaks(habit.id, completedHabits, scheduleByDate);
                        const isExpanded = selectedHabit === habit.id;

                        return (
                            <motion.div
                                key={habit.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`
                                    bg-[var(--bg-card)] border rounded-xl overflow-hidden transition-all
                                    ${isCompleted 
                                        ? 'border-[var(--accent-green)]/50 shadow-lg shadow-green-500/10' 
                                        : 'border-[var(--border-color)]'
                                    }
                                `}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-4 flex-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => toggleHabit(habit.id, todayKey)}
                                                className="flex-shrink-0"
                                            >
                                                {isCompleted ? (
                                                    <FiCheckCircle className="text-[var(--accent-green)]" size={32} />
                                                ) : (
                                                    <FiCircle className="text-[var(--text-secondary)]" size={32} />
                                                )}
                                            </motion.button>

                                            <div className="flex items-center gap-3 flex-1">
                                                <span className="text-3xl">{habit.icon}</span>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-[var(--text-primary)]">
                                                            {habit.name}
                                                        </span>
                                                        {habit.critical && (
                                                            <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                                                                CRÍTICO
                                                            </span>
                                                        )}
                                                    </div>
                                                    {isCompleted && (
                                                        <div className="text-sm text-green-400 font-semibold">
                                                            ✅ Completado hoy
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-6">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-[var(--text-primary)]">
                                                    {streaks.current}
                                                </div>
                                                <div className="text-xs text-[var(--text-secondary)]">
                                                    Racha actual
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-yellow-400">
                                                    {streaks.best}
                                                </div>
                                                <div className="text-xs text-[var(--text-secondary)]">
                                                    Mejor racha
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedHabit(isExpanded ? null : habit.id)}
                                                className="p-2 hover:bg-[var(--bg-inner)] rounded-lg transition-all"
                                            >
                                                <FiChevronRight 
                                                    className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Heatmap semanal */}
                                    <div className="flex justify-start items-center gap-2 mb-4">
                                        {getDaysOfCurrentWeek().map(({ dateKey, dayName }) => {
                                            const isDone = completedHabits[dateKey]?.[habit.id];
                                            return (
                                                <div key={dateKey} className="flex flex-col items-center gap-1">
                                                    <div className="text-xs text-[var(--text-secondary)]">{dayName}</div>
                                                    <motion.div
                                                        whileHover={{ scale: 1.2 }}
                                                        className={`
                                                            w-8 h-8 rounded-lg transition-all duration-300 flex items-center justify-center
                                                            ${isDone 
                                                                ? 'bg-green-500 shadow-md' 
                                                                : 'bg-[var(--bg-inner)] border border-[var(--border-color)]'
                                                            }
                                                        `}
                                                    >
                                                        {isDone && '✓'}
                                                    </motion.div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Vista expandida */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="border-t border-[var(--border-color)] pt-4 mt-4"
                                            >
                                                <h4 className="font-semibold mb-3 text-[var(--text-primary)]">
                                                    Calendario del mes
                                                </h4>
                                                <MonthlyHeatmap
                                                    habitId={habit.id}
                                                    completedHabits={completedHabits}
                                                    currentMonth={currentMonth}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Vista Grid */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredHabits.map((habit) => {
                        const isCompleted = completedHabits[todayKey]?.[habit.id];
                        const streaks = getHabitStreaks(habit.id, completedHabits, scheduleByDate);

                        return (
                            <motion.div
                                key={habit.id}
                                whileHover={{ y: -4 }}
                                className={`
                                    bg-[var(--bg-card)] border rounded-xl p-6 transition-all
                                    ${isCompleted 
                                        ? 'border-[var(--accent-green)]/50' 
                                        : 'border-[var(--border-color)]'
                                    }
                                `}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-4xl">{habit.icon}</span>
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleHabit(habit.id, todayKey)}
                                    >
                                        {isCompleted ? (
                                            <FiCheckCircle className="text-[var(--accent-green)]" size={28} />
                                        ) : (
                                            <FiCircle className="text-[var(--text-secondary)]" size={28} />
                                        )}
                                    </motion.button>
                                </div>

                                <h3 className="font-bold text-lg mb-1">{habit.name}</h3>
                                {habit.critical && (
                                    <span className="text-xs text-red-400 font-bold">CRÍTICO</span>
                                )}

                                <div className="flex justify-between mt-4 pt-4 border-t border-[var(--border-color)]">
                                    <div>
                                        <div className="text-xl font-bold">{streaks.current}</div>
                                        <div className="text-xs text-[var(--text-secondary)]">Actual</div>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-yellow-400">{streaks.best}</div>
                                        <div className="text-xs text-[var(--text-secondary)]">Mejor</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Vista Calendario */}
            {viewMode === 'calendar' && filteredHabits.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
                            {currentMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                                className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg"
                            >
                                ←
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date())}
                                className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg"
                            >
                                Hoy
                            </button>
                            <button
                                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                                className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg"
                            >
                                →
                            </button>
                        </div>
                    </div>

                    {filteredHabits.map(habit => (
                        <div key={habit.id} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-2xl">{habit.icon}</span>
                                <h3 className="font-bold text-lg">{habit.name}</h3>
                            </div>
                            <MonthlyHeatmap
                                habitId={habit.id}
                                completedHabits={completedHabits}
                                currentMonth={currentMonth}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Recomendaciones */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-6"
            >
                <div className="flex items-start gap-3 mb-4">
                    <FiAlertCircle className="text-blue-400 text-2xl flex-shrink-0" />
                    <div>
                        <h2 className="text-xl font-bold text-blue-400 mb-2">
                            💡 Consejos para el éxito
                        </h2>
                        <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <li className="flex items-start gap-2">
                                <span>✓</span>
                                <span><strong className="text-[var(--text-primary)]">Comenzá pequeño:</strong> Es mejor hacer poco consistentemente que mucho ocasionalmente</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>✓</span>
                                <span><strong className="text-[var(--text-primary)]">Racha de 21 días:</strong> Los expertos dicen que se necesitan 21 días para formar un hábito</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>✓</span>
                                <span><strong className="text-[var(--text-primary)]">Hora fija:</strong> Hacé tus hábitos a la misma hora cada día para automatizarlos</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>✓</span>
                                <span><strong className="text-[var(--text-primary)]">Recompensate:</strong> Celebrá tus logros, te lo merecés</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default Habits;