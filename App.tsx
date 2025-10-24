import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type { View, AppConfig, CompletedTasks, CompletedHabits, ToastMessage } from './types';
import { getDefaultConfig } from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import { formatDateKey, getSubjectStats, getCurrentWeekStats, getTodayHabitCompletion, getScheduleWeekCount } from './utils/helpers';
import Dashboard from './components/Dashboard';
import Planner from './components/Planner';
import Analytics from './components/Analytics';
import Habits from './components/Habits';
import Config from './components/Config';
import Toast from './components/ui/Toast';

import DashboardIcon from './components/icons/DashboardIcon';
import PlannerIcon from './components/icons/PlannerIcon';
import AnalyticsIcon from './components/icons/AnalyticsIcon';
import HabitsIcon from './components/icons/HabitsIcon';
import ConfigIcon from './components/icons/ConfigIcon';
import MoonIcon from './components/icons/MoonIcon';
import SunIcon from './components/icons/SunIcon';
import LoadingSpinner from './components/ui/LoadingSpinner';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [config, setConfig] = useLocalStorage<AppConfig>('coachConfig', getDefaultConfig());
    const [completedTasks, setCompletedTasks] = useLocalStorage<CompletedTasks>('completedTasks', {});
    const [completedHabits, setCompletedHabits] = useLocalStorage<CompletedHabits>('completedHabits', {});
    const [theme, setTheme] = useLocalStorage<Theme>('coachTheme', 'dark');
    const [toast, setToast] = useState<ToastMessage | null>(null);
    
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [selectedExam, setSelectedExam] = useState(0);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const newToast: ToastMessage = { id: Date.now(), message, type };
        setToast(newToast);
    }, []);

    useEffect(() => {
        // Simulate loading time for assets and data hydration
        const loadingTimer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(loadingTimer);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getNextTask = useCallback(() => {
        const now = new Date();
        const futureLimit = new Date();
        futureLimit.setDate(now.getDate() + 7);

        let closestTask = null;
        let closestTaskTime = Infinity;

        for (let d = new Date(now); d <= futureLimit; d.setDate(d.getDate() + 1)) {
            // We only care about today and future dates for the 'next task'
            if (d < now && formatDateKey(d) !== formatDateKey(now)) continue;

            const dateKey = formatDateKey(d);
            const dayTasks = config.scheduleByDate[dateKey] || [];
            
            for (const task of dayTasks) {
                const [hour, minute] = task.start.split(':').map(Number);
                const taskDateTime = new Date(d);
                taskDateTime.setHours(hour, minute, 0, 0);

                if (taskDateTime > now && taskDateTime.getTime() < closestTaskTime) {
                    closestTaskTime = taskDateTime.getTime();
                    closestTask = { task, date: d };
                }
            }
        }
        return closestTask;
    }, [config.scheduleByDate]);

    const nextTask = useMemo(() => getNextTask(), [currentTime, getNextTask]);

    const subjects = useMemo(() => [...new Set(
        Object.values(config.scheduleByDate)
            .flat()
            .map(task => task.subject)
            .filter(subj => !subj.includes('PARCIAL') && subj !== 'Repaso' && subj !== 'Descanso' && subj !== 'Básquet' && subj !== 'Gym' && subj !== 'Cena' && subj !== 'Repaso Semanal' && subj !== 'Repaso General')
    )], [config.scheduleByDate]);

    const totalWeeks = useMemo(() => getScheduleWeekCount(config.scheduleByDate), [config.scheduleByDate]);

    const toggleTask = useCallback((taskId: string) => {
        setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }));
    }, [setCompletedTasks]);

    const toggleHabit = useCallback((habitId: string, dateKey: string) => {
        setCompletedHabits(prev => ({
            ...prev,
            [dateKey]: {
                ...(prev[dateKey] || {}),
                [habitId]: !(prev[dateKey] && prev[dateKey][habitId])
            }
        }));
    }, [setCompletedHabits]);
    
    // Config Handlers
    const exportConfig = useCallback(() => {
        const dataStr = JSON.stringify(config, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'coach-config.json';
        link.click();
        URL.revokeObjectURL(url);
        showToast('Configuración exportada.', 'success');
    }, [config, showToast]);

    const importConfig = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target?.result as string);
                setConfig(imported);
                showToast('Configuración importada.', 'success');
            } catch (error) {
                showToast('Error: archivo JSON inválido.', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    }, [setConfig, showToast]);

    const resetConfig = useCallback(() => {
        if (confirm('⚠️ ¿Seguro que querés resetear a los valores originales? Esto no afectará tu progreso.')) {
            setConfig(getDefaultConfig());
            showToast('Configuración reseteada.', 'info');
        }
    }, [setConfig, showToast]);

    const exportToICS = useCallback(() => {
        const formatDateForICS = (date: Date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        }

        let icsContent = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CoachEstudio//App v1.0//EN'];
        Object.entries(config.scheduleByDate).forEach(([dateKey, tasks]) => {
            tasks.forEach((task, index) => {
                const [year, month, day] = dateKey.split('-').map(Number);
                const [startHour, startMinute] = task.start.split(':').map(Number);
                const [endHour, endMinute] = task.end.split(':').map(Number);
                const startDate = new Date(Date.UTC(year, month - 1, day, startHour, startMinute));
                const endDate = new Date(Date.UTC(year, month - 1, day, endHour, endMinute));
                icsContent.push('BEGIN:VEVENT', `UID:${dateKey}-${index}@coachestudio.app`, `DTSTAMP:${formatDateForICS(new Date())}`, `DTSTART:${formatDateForICS(startDate)}`, `DTEND:${formatDateForICS(endDate)}`, `SUMMARY:${task.subject}`, `DESCRIPTION:${task.task}`, 'END:VEVENT');
            });
        });
        icsContent.push('END:VCALENDAR');

        const dataBlob = new Blob([icsContent.join('\n')], { type: 'text/calendar' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'study-schedule.ics';
        link.click();
        URL.revokeObjectURL(url);
        showToast('Calendario exportado.', 'success');
    }, [config.scheduleByDate, showToast]);
    
    // Exam handlers
    const addExam = useCallback(() => {
        const name = prompt('Nombre del examen:'); if (!name) return;
        const subject = prompt('Materia:'); if (!subject) return;
        const dateStr = prompt('Fecha y hora (formato: 2025-12-01T14:00):'); if (!dateStr) return;
        const priority = parseInt(prompt('Prioridad (1-3, 1=más importante):', '1') || '1');
        if (isNaN(priority) || priority < 1 || priority > 3) { showToast('Prioridad inválida.', 'error'); return; }
        setConfig(prev => ({ ...prev, exams: [...prev.exams, { name, subject, date: dateStr, priority }] }));
    }, [setConfig, showToast]);

    const editExam = useCallback((index: number) => {
        const exam = config.exams[index];
        const name = prompt('Nombre del examen:', exam.name); if (name === null) return;
        const subject = prompt('Materia:', exam.subject); if (subject === null) return;
        const dateStr = prompt('Fecha y hora:', exam.date); if (dateStr === null) return;
        const priority = parseInt(prompt('Prioridad:', String(exam.priority)) || '1');
        if (isNaN(priority) || priority < 1 || priority > 3) { showToast('Prioridad inválida.', 'error'); return; }
        const updatedExam = { name: name || exam.name, subject: subject || exam.subject, date: dateStr || exam.date, priority };
        setConfig(prev => ({ ...prev, exams: prev.exams.map((e, i) => i === index ? updatedExam : e) }));
    }, [config.exams, setConfig, showToast]);

    const deleteExam = useCallback((index: number) => {
        if (confirm('⚠️ ¿Eliminar este examen?')) {
            setConfig(prev => ({ ...prev, exams: prev.exams.filter((_, i) => i !== index) }));
        }
    }, [setConfig]);

    // Habit handlers
    const addHabit = useCallback(() => {
        const id = prompt('ID único (ej: gym):', 'habit' + Date.now()); if (!id) return;
        const name = prompt('Nombre del hábito:'); if (!name) return;
        const icon = prompt('Emoji:', '✅');
        const critical = confirm('¿Es un hábito CRÍTICO?');
        setConfig(prev => ({ ...prev, habits: [...prev.habits, { id, name, icon: icon || '✅', critical }] }));
    }, [setConfig]);

    const editHabit = useCallback((habitId: string) => {
        const habit = config.habits.find(h => h.id === habitId); if (!habit) return;
        const name = prompt('Nombre:', habit.name); if (name === null) return;
        const icon = prompt('Emoji:', habit.icon); if (icon === null) return;
        const critical = confirm(`¿Es CRÍTICO? (Actual: ${habit.critical ? 'Sí' : 'No'})`);
        const updatedHabit = { ...habit, name: name || habit.name, icon: icon || habit.icon, critical };
        setConfig(prev => ({ ...prev, habits: prev.habits.map(h => h.id === habitId ? updatedHabit : h) }));
    }, [config.habits, setConfig]);

    const deleteHabit = useCallback((habitId: string) => {
        if (confirm('⚠️ ¿Eliminar este hábito?')) {
            setConfig(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== habitId) }));
        }
    }, [setConfig]);

    // Schedule handlers
    const addScheduleDate = useCallback(() => {
        const dateStr = prompt('Fecha nueva (YYYY-MM-DD):'); if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) { showToast('Formato inválido.', 'error'); return; }
        if (config.scheduleByDate[dateStr]) { showToast('Esa fecha ya existe.', 'error'); return; }
        setConfig(prev => ({ ...prev, scheduleByDate: { ...prev.scheduleByDate, [dateStr]: [] } }));
    }, [config.scheduleByDate, setConfig, showToast]);

    const deleteScheduleDate = useCallback((dateKey: string) => {
        if (confirm('⚠️ ¿Eliminar este día completo?')) {
            setConfig(prev => {
                const newSchedule = { ...prev.scheduleByDate };
                delete newSchedule[dateKey];
                return { ...prev, scheduleByDate: newSchedule };
            });
        }
    }, [setConfig]);

    const addScheduleTask = useCallback((dateKey: string) => {
        const start = prompt('Inicio (HH:MM):'); if (!start) return;
        const end = prompt('Fin (HH:MM):'); if (!end) return;
        const subject = prompt('Materia/Actividad:'); if (!subject) return;
        const task = prompt('Descripción:'); if (!task) return;
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
        const hours = ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
        const newTask = { start, end, subject, task, hours };
        setConfig(prev => ({ ...prev, scheduleByDate: { ...prev.scheduleByDate, [dateKey]: [...(prev.scheduleByDate[dateKey] || []), newTask] }}));
    }, [setConfig]);

    const editScheduleTask = useCallback((dateKey: string, taskIndex: number) => {
        const task = config.scheduleByDate[dateKey][taskIndex];
        const start = prompt('Inicio (HH:MM):', task.start); if (start === null) return;
        const end = prompt('Fin (HH:MM):', task.end); if (end === null) return;
        const subject = prompt('Materia/Actividad:', task.subject); if (subject === null) return;
        const taskDesc = prompt('Descripción:', task.task); if (taskDesc === null) return;
        const [startH, startM] = (start || task.start).split(':').map(Number);
        const [endH, endM] = (end || task.end).split(':').map(Number);
        const hours = ((endH * 60 + endM) - (startH * 60 + startM)) / 60;
        const updatedTask = { start: start || task.start, end: end || task.end, subject: subject || task.subject, task: taskDesc || task.task, hours };
        setConfig(prev => ({ ...prev, scheduleByDate: { ...prev.scheduleByDate, [dateKey]: prev.scheduleByDate[dateKey].map((t, i) => i === taskIndex ? updatedTask : t) }}));
    }, [config.scheduleByDate, setConfig]);

    const deleteScheduleTask = useCallback((dateKey: string, taskIndex: number) => {
        if (confirm('⚠️ ¿Eliminar esta tarea?')) {
            setConfig(prev => ({ ...prev, scheduleByDate: { ...prev.scheduleByDate, [dateKey]: prev.scheduleByDate[dateKey].filter((_, i) => i !== taskIndex) }}));
        }
    }, [setConfig]);

    const renderView = () => {
        switch (currentView) {
            case 'dashboard': return <Dashboard currentTime={currentTime} nextTask={nextTask} exams={config.exams} selectedExam={selectedExam} setSelectedExam={setSelectedExam} todayHabitCompletion={getTodayHabitCompletion(config.habits, completedHabits, currentTime)} currentWeekStats={getCurrentWeekStats(config.scheduleByDate, completedTasks)} scheduleByDate={config.scheduleByDate} completedTasks={completedTasks} toggleTask={toggleTask} />;
            case 'planner': return <Planner scheduleByDate={config.scheduleByDate} completedTasks={completedTasks} toggleTask={toggleTask} />;
            case 'analytics': return <Analytics scheduleByDate={config.scheduleByDate} completedTasks={completedTasks} completedHabits={completedHabits} subjects={subjects} habits={config.habits} totalWeeks={totalWeeks} />;
            case 'habits': return <Habits habits={config.habits} completedHabits={completedHabits} toggleHabit={toggleHabit} currentTime={currentTime} scheduleByDate={config.scheduleByDate} />;
            case 'config': return <Config config={config} setCompletedTasks={setCompletedTasks} setCompletedHabits={setCompletedHabits} exportConfig={exportConfig} importConfig={importConfig} resetConfig={resetConfig} exportToICS={exportToICS} addExam={addExam} editExam={editExam} deleteExam={deleteExam} addHabit={addHabit} editHabit={editHabit} deleteHabit={deleteHabit} addScheduleDate={addScheduleDate} deleteScheduleDate={deleteScheduleDate} addScheduleTask={addScheduleTask} editScheduleTask={editScheduleTask} deleteScheduleTask={deleteScheduleTask} subjects={subjects} showToast={showToast} />;
            default: return null;
        }
    };
    
    const tabs: { name: string, view: View, icon: React.ReactNode }[] = [
        { name: 'Dashboard', view: 'dashboard', icon: <DashboardIcon /> },
        { name: 'Cronograma', view: 'planner', icon: <PlannerIcon /> },
        { name: 'Analíticas', view: 'analytics', icon: <AnalyticsIcon /> },
        { name: 'Hábitos', view: 'habits', icon: <HabitsIcon /> },
        { name: 'Config', view: 'config', icon: <ConfigIcon /> },
    ];

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]"><LoadingSpinner /></div>
    }

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[var(--bg-main)]">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                        Coach Estudio
                    </div>
                    <nav className="flex items-center gap-1 sm:gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-1 rounded-xl">
                        {tabs.map(tab => (
                            <button key={tab.view} onClick={() => setCurrentView(tab.view)} className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm transition-all ${currentView === tab.view ? 'bg-[var(--accent-green)] text-[var(--bg-main)] font-semibold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} >
                                {tab.icon}
                                <span className='hidden sm:inline'>{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                     <div className="hidden md:block">
                        <button onClick={toggleTheme} aria-label="Cambiar tema" className="p-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                           {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                </header>
                <main>
                    {renderView()}
                </main>
            </div>
            {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default App;