
import React, { useMemo, useState, useEffect } from 'react';
import type { Exam, ScheduleTask, Schedule, CompletedTasks } from '../types';
import { formatDateKey, getDayName } from '../utils/helpers';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CircleIcon from './icons/CircleIcon';
import StatCard from './ui/StatCard';


interface DashboardProps {
    currentTime: Date;
    nextTask: { task: ScheduleTask; date: Date } | null;
    exams: Exam[];
    selectedExam: number;
    setSelectedExam: (index: number) => void;
    todayHabitCompletion: { completed: number; total: number; percentage: number };
    currentWeekStats: { totalHours: string; completedHours: string; percentage: number };
    scheduleByDate: Schedule;
    completedTasks: CompletedTasks;
    toggleTask: (taskId: string) => void;
}

const PomodoroTimer: React.FC = () => {
    const WORK_TIME = 25 * 60;
    const SHORT_BREAK_TIME = 5 * 60;
    const LONG_BREAK_TIME = 15 * 60;

    const [time, setTime] = useState(WORK_TIME);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'work' | 'short' | 'long'>('work');

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined = undefined;

        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setIsActive(false);
            // Optional: add sound notification here
        }

        return () => clearInterval(interval);
    }, [isActive, time]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleModeChange = (newMode: 'work' | 'short' | 'long') => {
        setMode(newMode);
        setIsActive(false);
        switch (newMode) {
            case 'work': setTime(WORK_TIME); break;
            case 'short': setTime(SHORT_BREAK_TIME); break;
            case 'long': setTime(LONG_BREAK_TIME); break;
        }
    };

    const handleReset = () => {
        setIsActive(false);
        handleModeChange(mode);
    }
    
    return (
        <div className="text-center">
             <div className="flex justify-center gap-2 mb-4">
                <button onClick={() => handleModeChange('work')} className={`px-3 py-1 text-xs rounded-md transition-colors ${mode === 'work' ? 'bg-[var(--accent-green)] text-[var(--bg-main)] font-semibold' : 'bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'}`}>Pomodoro</button>
                <button onClick={() => handleModeChange('short')} className={`px-3 py-1 text-xs rounded-md transition-colors ${mode === 'short' ? 'bg-[var(--accent-green)] text-[var(--bg-main)] font-semibold' : 'bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'}`}>Desc. C.</button>
                <button onClick={() => handleModeChange('long')} className={`px-3 py-1 text-xs rounded-md transition-colors ${mode === 'long' ? 'bg-[var(--accent-green)] text-[var(--bg-main)] font-semibold' : 'bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'}`}>Desc. L.</button>
            </div>
            <div className="font-mono text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-4">
                {formatTime(time)}
            </div>
            <div className="flex justify-center gap-4 items-center">
                <button onClick={() => setIsActive(!isActive)} className="px-8 py-2 bg-[var(--text-primary)] text-[var(--bg-main)] font-bold rounded-lg hover:bg-opacity-80 transition-all duration-200 ease-in-out hover:scale-105">
                    {isActive ? 'Pausar' : 'Iniciar'}
                </button>
                 <button onClick={handleReset} aria-label="Reiniciar temporizador" className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" title="Reiniciar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </button>
            </div>
        </div>
    )
}

const ProgressIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);
  
const HabitIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
      <path d="M20 6 9 17l-5-5" />
    </svg>
);

const TaskIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--text-secondary)]">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
);

const Dashboard: React.FC<DashboardProps> = ({
    currentTime,
    nextTask,
    exams,
    selectedExam,
    setSelectedExam,
    todayHabitCompletion,
    currentWeekStats,
    scheduleByDate,
    completedTasks,
    toggleTask,
}) => {
    const [selectedDateKey, setSelectedDateKey] = useState(formatDateKey(new Date()));

    const currentExam = useMemo(() => {
        if (!exams || exams.length === 0 || !exams[selectedExam]) return null;
        return {
            ...exams[selectedExam],
            date: new Date(exams[selectedExam].date)
        }
    }, [exams, selectedExam]);
    
    if (!currentExam) {
        return <div className="text-center p-8 bg-[var(--bg-card)] rounded-lg">Cargando datos del exámen...</div>
    }

    const now = new Date();
    const timeToExam = currentExam.date.getTime() - now.getTime();
    const daysToExam = Math.max(0, Math.floor(timeToExam / (1000 * 60 * 60 * 24)));
    const hoursToExam = Math.max(0, Math.floor((timeToExam % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutesToExam = Math.max(0, Math.floor((timeToExam % (1000 * 60 * 60)) / (1000 * 60)));

    const daySchedule = useMemo(() => {
        return scheduleByDate[selectedDateKey] || [];
    }, [scheduleByDate, selectedDateKey]);

    const changeDate = (offset: number) => {
        const currentDate = new Date(selectedDateKey + 'T00:00:00'); // Avoid timezone issues
        currentDate.setDate(currentDate.getDate() + offset);
        setSelectedDateKey(formatDateKey(currentDate));
    };
    
    const selectedDate = useMemo(() => new Date(selectedDateKey + 'T00:00:00'), [selectedDateKey]);


    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                {/* Main section */}
                <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                    <div className="grid md:grid-cols-2 gap-6 h-full items-center">
                        {/* Left side: Info */}
                        <div className="flex flex-col h-full">
                            <div>
                                <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-[var(--text-primary)]">Coach de Estudio</h1>
                                <p className="text-[var(--text-secondary)] mt-1 text-sm">Módulo II - Dic 2025 / Feb 2026</p>
                            </div>
                            <div className="mt-auto pt-4">
                                <div className="text-4xl lg:text-5xl font-bold tracking-wider text-[var(--text-primary)]">
                                    {currentTime.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                                    <span className="text-2xl lg:text-3xl hidden sm:inline">
                                        {currentTime.toLocaleTimeString('es-AR', { second: '2-digit' }).replace(/(\d{2})/, ':$1')}
                                    </span>
                                </div>
                                <div className="text-md text-[var(--text-secondary)] mt-1">
                                    {currentTime.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
                                </div>
                            </div>
                        </div>

                        {/* Divider and Right side: Pomodoro */}
                        <div className="flex items-center gap-6 h-full">
                            <div className="w-px h-4/5 bg-[var(--border-color)] hidden md:block"></div> {/* Vertical Divider */}
                            <div className="flex-1">
                                <PomodoroTimer />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Countdown section */}
                <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col">
                    <h2 className="font-serif font-semibold text-[var(--text-primary)] mb-4">Cuenta Regresiva</h2>
                    <select
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(parseInt(e.target.value))}
                        className="w-full bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-terracotta)] mb-4"
                    >
                        {exams.map((exam, idx) => (
                            <option key={idx} value={idx}>{exam.name}</option>
                        ))}
                    </select>
                    <div className="grid grid-cols-3 gap-4 text-center mt-auto">
                        <div><div className="text-4xl font-bold text-[var(--text-primary)]">{daysToExam}</div><div className="text-xs text-[var(--text-secondary)]">días</div></div>
                        <div><div className="text-4xl font-bold text-[var(--text-primary)]">{hoursToExam}</div><div className="text-xs text-[var(--text-secondary)]">hs</div></div>
                        <div><div className="text-4xl font-bold text-[var(--text-primary)]">{minutesToExam}</div><div className="text-xs text-[var(--text-secondary)]">min</div></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <StatCard title="Hábitos Hoy" icon={<HabitIcon />}>
                    <div className="text-4xl font-bold text-[var(--text-primary)]">{todayHabitCompletion.completed}/{todayHabitCompletion.total}</div>
                    <div className="w-full bg-[var(--border-color)] rounded-full h-1.5 mt-2">
                        <div className="bg-[var(--accent-green)] h-1.5 rounded-full" style={{ width: `${todayHabitCompletion.percentage}%` }}></div>
                    </div>
                </StatCard>

                <StatCard title="Próxima Tarea" icon={<TaskIcon />}>
                    {nextTask ? (
                        <div className="flex-grow flex flex-col justify-center">
                            <div className="text-md font-bold text-[var(--accent-terracotta)]">{nextTask.task.start}</div>
                            <div className="font-semibold text-[var(--text-primary)] mt-1 truncate">{nextTask.task.subject}</div>
                            <p className="text-sm text-[var(--text-secondary)] truncate">{nextTask.task.task}</p>
                        </div>
                    ) : (
                        <p className="text-[var(--text-secondary)] flex-grow flex items-center">No hay tareas pendientes.</p>
                    )}
                </StatCard>
                
                <StatCard title="Prog. Semanal" icon={<ProgressIcon />}>
                    <div className="text-4xl font-bold text-[var(--text-primary)]">{currentWeekStats.percentage}%</div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{currentWeekStats.completedHours}/{currentWeekStats.totalHours} horas</p>
                </StatCard>
            </div>
            
             <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
                    <h3 className="font-serif font-semibold text-[var(--text-primary)]">Tareas del Día</h3>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => changeDate(-1)} className="px-3 py-1 rounded-md text-sm bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors">←</button>
                        <span className="font-semibold text-[var(--text-primary)] text-center w-48 text-sm">
                           {selectedDate.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
                        </span>
                        <button onClick={() => changeDate(1)} className="px-3 py-1 rounded-md text-sm bg-[var(--bg-inner)] text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors">→</button>
                    </div>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
                    {daySchedule.length > 0 ? daySchedule.map((task, idx) => {
                        const taskId = `${selectedDateKey}-${idx}`;
                        const isCompleted = completedTasks[taskId];
                        const isParcial = task.subject.includes('PARCIAL');
                        return (
                             <div key={taskId} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${isCompleted ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]' : 'bg-[var(--bg-inner)] border-[var(--border-color)]'}`}>
                                <div className="flex items-center gap-4">
                                    {!isParcial && (
                                        <button onClick={() => toggleTask(taskId)}>
                                            {isCompleted ? <CheckCircleIcon size={22} className="text-[var(--accent-green)]" /> : <CircleIcon size={22} className="text-[var(--text-secondary)]" />}
                                        </button>
                                    )}
                                    {isParcial && <span className="text-lg">🎯</span>}
                                    <div>
                                        <p className={`font-semibold ${isCompleted ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>{task.subject}</p>
                                        <p className="text-xs text-[var(--text-secondary)]">{task.start} - {task.end} | {task.task}</p>
                                    </div>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${isParcial ? 'bg-[var(--accent-terracotta)]/20 text-[var(--accent-terracotta)]' : 'bg-[var(--border-color)] text-[var(--text-secondary)]'}`}>
                                    {task.hours}h
                                </span>
                            </div>
                        )
                    }) : (
                        <div className="text-center py-12 text-[var(--text-secondary)]">
                            <p className="text-3xl mb-2">🍃</p>
                            <p>No hay tareas para este día.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;