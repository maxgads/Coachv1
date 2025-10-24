import React, { useState } from 'react';
import type { AppConfig, CompletedTasks, CompletedHabits } from '../types';
import { getDayName, parseDateKey } from '../utils/helpers';
import ChevronDownIcon from './icons/ChevronDownIcon';
import CalendarIcon from './icons/CalendarIcon';


interface ConfigProps {
    config: AppConfig;
    setCompletedTasks: React.Dispatch<React.SetStateAction<CompletedTasks>>;
    setCompletedHabits: React.Dispatch<React.SetStateAction<CompletedHabits>>;
    exportConfig: () => void;
    importConfig: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resetConfig: () => void;
    exportToICS: () => void;
    addExam: () => void;
    editExam: (index: number) => void;
    deleteExam: (index: number) => void;
    addHabit: () => void;
    editHabit: (habitId: string) => void;
    deleteHabit: (habitId: string) => void;
    addScheduleDate: () => void;
    deleteScheduleDate: (dateKey: string) => void;
    addScheduleTask: (dateKey: string) => void;
    editScheduleTask: (dateKey: string, taskIndex: number) => void;
    deleteScheduleTask: (dateKey: string, taskIndex: number) => void;
    subjects: string[];
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CollapsibleCard: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean, className?: string }> = ({ title, children, defaultOpen = true, className = '' }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className={`bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl break-inside-avoid mb-6 ${className}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-6 text-left">
                <h2 className="font-serif text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
                <ChevronDownIcon className={`transform transition-transform text-[var(--text-secondary)] ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 animate-fade-in-slow">
                    {children}
                </div>
            )}
        </div>
    );
};


const Config: React.FC<ConfigProps> = ({
    config,
    setCompletedTasks,
    setCompletedHabits,
    exportConfig,
    importConfig,
    resetConfig,
    exportToICS,
    addExam, editExam, deleteExam,
    addHabit, editHabit, deleteHabit,
    addScheduleDate, deleteScheduleDate,
    addScheduleTask, editScheduleTask, deleteScheduleTask,
    showToast
}) => {
    const examsWithDateObjects = config.exams.map(exam => ({...exam, dateObj: new Date(exam.date)}))

    const buttonBaseClass = "px-4 py-3 rounded-lg hover:opacity-80 transition-all text-sm font-semibold w-full text-center flex items-center justify-center gap-2";
    
    const handleClearTasks = () => {
        if (confirm('⚠️ ¿Seguro que querés borrar todo el progreso de TAREAS? Esta acción no se puede deshacer.')) {
            setCompletedTasks({});
            showToast('Progreso de tareas limpiado.', 'success');
        }
    };
    
    const handleClearHabits = () => {
        if (confirm('⚠️ ¿Seguro que querés borrar todo el progreso de HÁBITOS? Esta acción no se puede deshacer.')) {
            setCompletedHabits({});
            showToast('Progreso de hábitos limpiado.', 'success');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="font-serif text-3xl font-semibold text-[var(--text-primary)]">Configuración</h1>
            <div className="bg-sky-900/20 border border-sky-700/30 rounded-xl p-4">
                <h2 className="text-md text-sky-400 font-bold mb-2">ℹ️ Cómo usar el editor</h2>
                <ul className="text-sm text-[var(--text-secondary)] space-y-1">
                    <li>• <strong>Exportar/Importar JSON:</strong> Guardá un backup de tu configuración antes de editar.</li>
                    <li>• <strong>Editar/Eliminar:</strong> En móvil los íconos ✏️ y 🗑️ son siempre visibles.</li>
                    <li>• <strong>Reset:</strong> Restaura la configuración original sin afectar tu progreso.</li>
                </ul>
            </div>

            <CollapsibleCard title="Gestión de Datos">
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">CONFIGURACIÓN Y CALENDARIO</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <button onClick={exportConfig} className={`${buttonBaseClass} bg-green-900/50 text-green-300 border border-green-700/50`}>⬇️ Exportar JSON</button>
                            <label className="cursor-pointer">
                                <input type="file" accept=".json" onChange={importConfig} className="hidden" />
                                <div className={`${buttonBaseClass} bg-blue-900/50 text-blue-300 border border-blue-700/50`}>⬆️ Importar JSON</div>
                            </label>
                            <button onClick={resetConfig} className={`${buttonBaseClass} bg-red-900/50 text-red-300 border border-red-700/50`}>🔄 Reset Original</button>
                            <button onClick={exportToICS} className={`${buttonBaseClass} bg-purple-900/50 text-purple-300 border border-purple-700/50`}><CalendarIcon size={18} /> Exportar a Calendario</button>
                        </div>
                    </div>
                     <div>
                        <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">PROGRESO</h3>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                           <button onClick={handleClearTasks} className={`${buttonBaseClass} bg-orange-900/50 text-orange-300 border border-orange-700/50`}>🗑️ Limpiar Tareas</button>
                           <button onClick={handleClearHabits} className={`${buttonBaseClass} bg-orange-900/50 text-orange-300 border border-orange-700/50`}>🗑️ Limpiar Hábitos</button>
                        </div>
                    </div>
                </div>
            </CollapsibleCard>

            <div className="md:columns-2 gap-6">
                <CollapsibleCard title="Exámenes" defaultOpen={false}>
                    <div className="flex justify-end mb-4">
                        <button onClick={addExam} className="px-3 py-1 bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/50 rounded hover:opacity-80 transition-all text-xs">+ Agregar</button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto p-1 -m-1">
                        {examsWithDateObjects.map((exam, idx) => (
                            <div key={idx} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg p-3 group hover:border-[var(--accent-green)]/50 transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="font-bold text-sm mb-1">{exam.name}</div>
                                        <div className="text-xs text-[var(--text-secondary)]">{exam.subject}</div>
                                        <div className="text-xs text-[var(--text-secondary)]/70 mt-1">{exam.dateObj.toLocaleString('es-AR')} | P: {exam.priority}</div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => editExam(idx)} aria-label={`Editar examen ${exam.name}`} className="opacity-100 md:opacity-0 group-hover:md:opacity-100 p-2 bg-blue-900/30 text-blue-300 rounded text-xs hover:bg-blue-900/60 transition-all">✏️</button>
                                        <button onClick={() => deleteExam(idx)} aria-label={`Eliminar examen ${exam.name}`} className="opacity-100 md:opacity-0 group-hover:md:opacity-100 p-2 bg-red-900/30 text-red-300 rounded text-xs hover:bg-red-900/60 transition-all">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>
                <CollapsibleCard title="Hábitos" defaultOpen={false}>
                    <div className="flex justify-end mb-4">
                        <button onClick={addHabit} className="px-3 py-1 bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/50 rounded hover:opacity-80 transition-all text-xs">+ Agregar</button>
                    </div>
                    <div className="space-y-2">
                        {config.habits.map((habit) => (
                            <div key={habit.id} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg p-3 group hover:border-[var(--accent-green)]/50 transition-all">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{habit.icon}</span>
                                        <div>
                                            <div className="font-bold text-sm">{habit.name}</div>
                                            <div className={`text-xs ${habit.critical ? 'text-[var(--accent-terracotta)]' : 'text-[var(--text-secondary)]'}`}>{habit.critical ? 'CRÍTICO' : 'Normal'}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => editHabit(habit.id)} aria-label={`Editar hábito ${habit.name}`} className="opacity-100 md:opacity-0 group-hover:md:opacity-100 p-2 bg-blue-900/30 text-blue-300 rounded text-xs hover:bg-blue-900/60 transition-all">✏️</button>
                                        <button onClick={() => deleteHabit(habit.id)} aria-label={`Eliminar hábito ${habit.name}`} className="opacity-100 md:opacity-0 group-hover:md:opacity-100 p-2 bg-red-900/30 text-red-300 rounded text-xs hover:bg-red-900/60 transition-all">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleCard>
            </div>

            <CollapsibleCard title="Editor de Cronograma" defaultOpen={false}>
                <div className="flex justify-end mb-4">
                    <button onClick={addScheduleDate} className="px-3 py-1 bg-[var(--accent-green)]/20 text-[var(--accent-green)] border border-[var(--accent-green)]/50 rounded hover:opacity-80 transition-all text-xs">+ Agregar Fecha</button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto p-1 -m-1">
                    {Object.keys(config.scheduleByDate).sort().map(dateKey => {
                        const date = parseDateKey(dateKey);
                        const tasks = config.scheduleByDate[dateKey];
                        const totalHours = tasks.reduce((sum, t) => sum + t.hours, 0);
                        return (
                            <div key={dateKey} className="bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg p-4 group hover:border-[var(--accent-green)]/50 transition-all">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                                    <div>
                                        <span className="font-bold text-md text-[var(--text-primary)]">{getDayName(date.getDay())} {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</span>
                                        <span className="text-[var(--text-secondary)] text-xs ml-2">({totalHours}h, {tasks.length} tareas)</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => addScheduleTask(dateKey)} className="opacity-100 md:opacity-0 group-hover:md:opacity-100 px-2 py-1 bg-green-900/40 text-green-300 rounded text-xs hover:bg-green-900/60 transition-all">+ Tarea</button>
                                        <button onClick={() => deleteScheduleDate(dateKey)} aria-label={`Eliminar día ${dateKey}`} className="opacity-100 md:opacity-0 group-hover:md:opacity-100 px-2 py-1 bg-red-900/40 text-red-300 rounded text-xs hover:bg-red-900/60 transition-all">🗑️ Día</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {tasks.map((task, idx) => (
                                        <div key={idx} className="bg-[var(--bg-card)] rounded p-2 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                            <div className="flex-1">
                                                <div className="text-xs">
                                                    <span className="text-[var(--accent-terracotta)] font-semibold">{task.start} - {task.end}</span>
                                                    <span className="text-[var(--text-secondary)] ml-2">({task.hours}h)</span>
                                                </div>
                                                <div className="text-sm font-bold mt-1">{task.subject}</div>
                                                <div className="text-xs text-[var(--text-secondary)]">{task.task}</div>
                                            </div>
                                            <div className="flex gap-1 ml-auto">
                                                <button onClick={() => editScheduleTask(dateKey, idx)} aria-label={`Editar tarea ${task.task}`} className="p-2 bg-blue-900/30 text-blue-300 rounded text-xs hover:bg-blue-900/60 transition-all">✏️</button>
                                                <button onClick={() => deleteScheduleTask(dateKey, idx)} aria-label={`Eliminar tarea ${task.task}`} className="p-2 bg-red-900/30 text-red-300 rounded text-xs hover:bg-red-900/60 transition-all">🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                    {tasks.length === 0 && (<div className="text-xs text-[var(--text-secondary)] text-center py-2">Sin tareas.</div>)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CollapsibleCard>
        </div>
    );
};

export default Config;