import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { AppConfig, CompletedTasks, CompletedHabits } from '../types';
import { getDayName, parseDateKey } from '../utils/helpers';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiDownload, FiUpload, FiTrash2, FiPlus, FiEdit, FiCalendar, 
  FiRefreshCw, FiSettings, FiBell, FiEye, FiLock, FiDatabase,
  FiSun, FiMoon, FiGlobe, FiZap, FiSave, FiKey, FiClock,
  FiCheckCircle, FiAlertCircle, FiInfo, FiChevronRight, FiSearch,
  FiCommand, FiActivity, FiTrendingUp, FiCopy, FiShare2, FiBookmark,
  FiLayers, FiSliders, FiX, FiCheck, FiArrowLeft, FiExternalLink,
  FiBarChart2, FiFileText, FiCloud, FiMonitor, FiSmartphone, FiWatch,
  FiShield, FiAward, FiTarget, FiFilter, FiCornerDownRight
} from 'react-icons/fi';

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
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// ============= PERFILES PRECONFIGURADOS =============
const PRESET_PROFILES = {
  balanced: {
    name: 'Balance',
    icon: '⚖️',
    description: 'Configuración equilibrada para uso diario',
    settings: {
      pomodoroTime: 25,
      shortBreak: 5,
      longBreak: 15,
      enableNotifications: true,
      examReminderTime: 24,
      animations: true,
    }
  },
  intense: {
    name: 'Intensivo',
    icon: '🔥',
    description: 'Para periodos de exámenes y estudio intenso',
    settings: {
      pomodoroTime: 50,
      shortBreak: 10,
      longBreak: 30,
      enableNotifications: true,
      examReminderTime: 6,
      animations: false,
    }
  },
  minimal: {
    name: 'Minimalista',
    icon: '✨',
    description: 'Interfaz limpia con lo esencial',
    settings: {
      pomodoroTime: 25,
      shortBreak: 5,
      longBreak: 15,
      enableNotifications: false,
      compactMode: true,
      animations: false,
    }
  },
  productive: {
    name: 'Productivo',
    icon: '⚡',
    description: 'Maximiza tu rendimiento',
    settings: {
      pomodoroTime: 45,
      shortBreak: 5,
      longBreak: 20,
      enableNotifications: true,
      examReminderTime: 12,
      autoStartBreaks: true,
      animations: true,
    }
  }
};

// ============= COMPONENTES AVANZADOS =============

// Command Palette (Cmd+K style)
const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onExecute: (command: string) => void;
}> = ({ isOpen, onClose, onExecute }) => {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'export', label: 'Exportar configuración', icon: <FiDownload />, action: 'export' },
    { id: 'import', label: 'Importar configuración', icon: <FiUpload />, action: 'import' },
    { id: 'reset', label: 'Resetear configuración', icon: <FiRefreshCw />, action: 'reset' },
    { id: 'calendar', label: 'Exportar a calendario', icon: <FiCalendar />, action: 'calendar' },
    { id: 'dark', label: 'Toggle modo oscuro', icon: <FiMoon />, action: 'darkMode' },
    { id: 'notifications', label: 'Toggle notificaciones', icon: <FiBell />, action: 'notifications' },
    { id: 'backup', label: 'Crear backup ahora', icon: <FiDatabase />, action: 'backup' },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -20 }}
        className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <FiSearch className="text-[var(--text-secondary)]" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar configuración o comando..."
              className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
              <kbd className="px-2 py-1 bg-[var(--bg-inner)] rounded">ESC</kbd>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd, idx) => (
            <motion.button
              key={cmd.id}
              whileHover={{ backgroundColor: 'var(--bg-inner)' }}
              onClick={() => {
                onExecute(cmd.action);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
            >
              <div className="text-[var(--accent-green)]">{cmd.icon}</div>
              <span className="flex-1 text-[var(--text-primary)]">{cmd.label}</span>
              <kbd className="px-2 py-1 bg-[var(--bg-inner)] rounded text-xs text-[var(--text-secondary)]">
                {idx < 9 ? `${idx + 1}` : ''}
              </kbd>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Activity Timeline
const ActivityTimeline: React.FC<{ activities: any[] }> = ({ activities }) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-lg text-[var(--text-primary)] flex items-center gap-2">
      <FiActivity className="text-[var(--accent-green)]" />
      Actividad Reciente
    </h3>
    <div className="space-y-3">
      {activities.slice(0, 5).map((activity, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="flex items-start gap-3 p-3 bg-[var(--bg-inner)] rounded-lg border border-[var(--border-color)]"
        >
          <div className={`p-2 rounded-lg ${activity.type === 'export' ? 'bg-blue-500/20 text-blue-400' : ''} ${activity.type === 'import' ? 'bg-green-500/20 text-green-400' : ''} ${activity.type === 'delete' ? 'bg-red-500/20 text-red-400' : ''}`}>
            {activity.icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[var(--text-primary)]">
              {activity.action}
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              {activity.time}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Smart Recommendations
const SmartRecommendations: React.FC<{ stats: any }> = ({ stats }) => {
  const recommendations = useMemo(() => {
    const recs = [];
    
    if (stats.totalExams > 10 && stats.totalScheduleDays < 30) {
      recs.push({
        icon: '📅',
        title: 'Organiza tu calendario',
        description: 'Tenés muchos exámenes. Planificá más días de estudio.',
        action: 'Ver Cronograma',
        color: 'orange'
      });
    }
    
    if (stats.totalHabits === 0) {
      recs.push({
        icon: '⚡',
        title: 'Creá hábitos de estudio',
        description: 'Los hábitos te ayudarán a mantener la consistencia.',
        action: 'Agregar Hábitos',
        color: 'green'
      });
    }

    if (stats.dataSize > 5) {
      recs.push({
        icon: '💾',
        title: 'Hacé un backup',
        description: 'Hace más de una semana que no guardás un backup.',
        action: 'Exportar Ahora',
        color: 'blue'
      });
    }

    return recs;
  }, [stats]);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
      <h3 className="font-semibold text-lg text-[var(--text-primary)] flex items-center gap-2 mb-4">
        <FiTarget className="text-purple-400" />
        Recomendaciones Inteligentes
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-start gap-3 p-4 bg-[var(--bg-card)] rounded-lg border border-[var(--border-color)]"
          >
            <span className="text-2xl">{rec.icon}</span>
            <div className="flex-1">
              <div className="font-semibold text-[var(--text-primary)] mb-1">
                {rec.title}
              </div>
              <div className="text-sm text-[var(--text-secondary)] mb-2">
                {rec.description}
              </div>
              <button className={`text-sm font-semibold ${rec.color === 'blue' ? 'text-blue-400' : ''} ${rec.color === 'green' ? 'text-green-400' : ''} ${rec.color === 'orange' ? 'text-orange-400' : ''} hover:underline`}>
                {rec.action} →
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Preview Panel
const PreviewPanel: React.FC<{ settings: any }> = ({ settings }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
    <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-4">
      Vista Previa en Vivo
    </h3>
    <div className="space-y-4">
      <div 
        className={`p-4 rounded-lg transition-all ${settings.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        style={{ 
          backgroundColor: settings.darkMode ? '#1a1a2e' : '#f3f4f6',
          color: settings.darkMode ? '#e5e7eb' : '#1f2937'
        }}
      >
        <div className="mb-2 font-semibold">Tema: {settings.darkMode ? 'Oscuro' : 'Claro'}</div>
        <div className="mb-2">Color de acento: <span style={{ color: settings.accentColor }}>●</span> {settings.accentColor}</div>
        <div className={`text-sm ${settings.compactMode ? 'leading-tight' : 'leading-relaxed'}`}>
          Modo: {settings.compactMode ? 'Compacto' : 'Normal'}
        </div>
        {settings.animations && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block mt-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded"
          >
            ✨ Animaciones activas
          </motion.div>
        )}
      </div>
    </div>
  </div>
);

// Profile Selector
const ProfileSelector: React.FC<{
  onSelectProfile: (profile: any) => void;
}> = ({ onSelectProfile }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Object.entries(PRESET_PROFILES).map(([key, profile]) => (
      <motion.button
        key={key}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectProfile(profile)}
        className="p-6 bg-[var(--bg-card)] border-2 border-[var(--border-color)] rounded-xl text-left hover:border-[var(--accent-green)] transition-all"
      >
        <div className="text-4xl mb-3">{profile.icon}</div>
        <div className="font-bold text-lg text-[var(--text-primary)] mb-2">
          {profile.name}
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {profile.description}
        </div>
      </motion.button>
    ))}
  </div>
);

// Switch mejorado con animación
const Switch: React.FC<{ 
  enabled: boolean; 
  onChange: (enabled: boolean) => void;
  label: string;
  description?: string;
  badge?: string;
}> = ({ enabled, onChange, label, description, badge }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className="flex items-center justify-between py-3 group"
  >
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <div className="text-sm font-semibold text-[var(--text-primary)]">{label}</div>
        {badge && (
          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            {badge}
          </span>
        )}
      </div>
      {description && <div className="text-xs text-[var(--text-secondary)] mt-1">{description}</div>}
    </div>
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-all
        ${enabled ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'}
      `}
    >
      <motion.span
        layout
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-md
          ${enabled ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </motion.button>
  </motion.div>
);

// Sección colapsable mejorada
const ConfigSection: React.FC<{ 
  title: string; 
  icon: React.ReactNode;
  children: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
}> = ({ title, icon, children, badge, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-[var(--bg-inner)] transition-all group"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-2 bg-gradient-to-br from-[var(--accent-green)]/20 to-blue-500/20 rounded-lg text-[var(--accent-green)]"
          >
            {icon}
          </motion.div>
          <div className="text-left">
            <h3 className="font-semibold text-lg text-[var(--text-primary)] group-hover:text-[var(--accent-green)] transition-colors">
              {title}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {badge && (
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-full text-xs font-bold">
              {badge}
            </span>
          )}
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiChevronRight className="text-[var(--text-secondary)]" />
          </motion.div>
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
            <div className="p-6 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Botón de acción mejorado
const ActionButton: React.FC<{
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'danger' | 'success' | 'warning';
  disabled?: boolean;
  loading?: boolean;
}> = ({ onClick, icon, label, variant = 'primary', disabled = false, loading = false }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 hover:from-blue-500/30 hover:to-cyan-500/30 border-blue-500/30',
    danger: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 hover:from-red-500/30 hover:to-pink-500/30 border-red-500/30',
    success: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 hover:from-green-500/30 hover:to-emerald-500/30 border-green-500/30',
    warning: 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-400 hover:from-orange-500/30 hover:to-yellow-500/30 border-orange-500/30',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        flex items-center justify-center gap-2 px-4 py-3 rounded-lg 
        border transition-all font-semibold text-sm shadow-sm hover:shadow-md
        ${variants[variant]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <FiRefreshCw />
        </motion.div>
      ) : icon}
      {label}
    </motion.button>
  );
};

// ============= COMPONENTE PRINCIPAL =============
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

  // Estados
  const [settings, setSettings] = useState({
    enableNotifications: true,
    notifyBeforeExam: true,
    examReminderTime: 24,
    notifyDailyGoals: true,
    soundEnabled: true,
    darkMode: true,
    compactMode: false,
    animations: true,
    accentColor: 'green',
    autoSave: true,
    syncEnabled: false,
    dataRetention: 30,
    pomodoroTime: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    developerMode: false,
    betaFeatures: false,
    analytics: true,
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'profiles' | 'activity' | 'advanced'>('settings');
  const [isLoading, setIsLoading] = useState(false);

  // Estadísticas
  const stats = useMemo(() => ({
    totalExams: config.exams.length,
    totalHabits: config.habits.length,
    totalScheduleDays: Object.keys(config.scheduleByDate).length,
    dataSize: 2.4,
    lastBackup: 'Hace 3 días',
  }), [config]);

  // Actividades recientes (mock)
  const recentActivities = [
    { type: 'export', action: 'Exportaste la configuración', time: 'Hace 2 horas', icon: <FiDownload /> },
    { type: 'import', action: 'Cambiaste el tema a modo oscuro', time: 'Hace 5 horas', icon: <FiMoon /> },
    { type: 'delete', action: 'Limpiaste el progreso de tareas', time: 'Ayer', icon: <FiTrash2 /> },
    { type: 'export', action: 'Exportaste al calendario', time: 'Hace 2 días', icon: <FiCalendar /> },
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClearTasks = useCallback(() => {
    if (confirm('⚠️ ¿Seguro que querés borrar todo el progreso de TAREAS? Esta acción no se puede deshacer.')) {
      setCompletedTasks({});
      showToast('Progreso de tareas limpiado exitosamente', 'success');
    }
  }, [setCompletedTasks, showToast]);

  const handleClearHabits = useCallback(() => {
    if (confirm('⚠️ ¿Seguro que querés borrar todo el progreso de HÁBITOS? Esta acción no se puede deshacer.')) {
      setCompletedHabits({});
      showToast('Progreso de hábitos limpiado exitosamente', 'success');
    }
  }, [setCompletedHabits, showToast]);

  const handleExportBackup = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      exportConfig();
      showToast('Backup exportado correctamente', 'success');
      setIsLoading(false);
    }, 500);
  }, [exportConfig, showToast]);

  const updateSetting = useCallback((key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    showToast('Configuración actualizada', 'info');
  }, [showToast]);

  const handleCommandExecute = useCallback((command: string) => {
    switch(command) {
      case 'export':
        handleExportBackup();
        break;
      case 'reset':
        resetConfig();
        showToast('Configuración reseteada', 'info');
        break;
      case 'calendar':
        exportToICS();
        showToast('Calendario exportado', 'success');
        break;
      case 'darkMode':
        updateSetting('darkMode', !settings.darkMode);
        break;
      case 'notifications':
        updateSetting('enableNotifications', !settings.enableNotifications);
        break;
      default:
        break;
    }
  }, [handleExportBackup, resetConfig, exportToICS, settings, updateSetting, showToast]);

  const applyProfile = useCallback((profile: any) => {
    setSettings(prev => ({ ...prev, ...profile.settings }));
    showToast(`Perfil "${profile.name}" aplicado exitosamente`, 'success');
  }, [showToast]);

  const handleSaveAll = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      showToast('Todos los cambios guardados', 'success');
      setIsLoading(false);
    }, 1000);
  }, [showToast]);

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 animate-fade-in relative">
      
      {/* Command Palette */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            onExecute={handleCommandExecute}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQuickActions(!showQuickActions)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-[var(--accent-green)] to-blue-500 rounded-full shadow-lg flex items-center justify-center text-white z-40"
      >
        {showQuickActions ? <FiX /> : <FiZap />}
      </motion.button>

      {/* Quick Actions Menu */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl shadow-2xl p-4 space-y-2 z-40 min-w-[200px]"
          >
            <button onClick={handleExportBackup} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-inner)] rounded-lg transition-all text-left">
              <FiDownload className="text-blue-400" />
              <span className="text-sm">Exportar</span>
            </button>
            <button onClick={() => setCommandPaletteOpen(true)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-inner)] rounded-lg transition-all text-left">
              <FiCommand className="text-purple-400" />
              <span className="text-sm">Comandos</span>
            </button>
            <button onClick={() => setShowPreview(!showPreview)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-inner)] rounded-lg transition-all text-left">
              <FiEye className="text-green-400" />
              <span className="text-sm">Preview</span>
            </button>
            <button onClick={handleSaveAll} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[var(--bg-inner)] rounded-lg transition-all text-left">
              <FiSave className="text-orange-400" />
              <span className="text-sm">Guardar Todo</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent-green)] bg-clip-text text-transparent mb-3"
          >
            Centro de Configuración
          </motion.h1>
          <p className="text-[var(--text-secondary)] flex items-center gap-2">
            Personaliza tu experiencia de estudio
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex items-center gap-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              En línea
            </motion.span>
          </p>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Buscar configuración... (Cmd+K para comandos)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setCommandPaletteOpen(true)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--accent-green)]/20 transition-all"
            />
          </div>
        </div>

        {/* Status Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg shadow-sm">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <FiCheckCircle className="text-green-400" size={20} />
            </motion.div>
            <div>
              <div className="text-sm font-semibold text-green-400">Sincronizado</div>
              <div className="text-xs text-[var(--text-secondary)]">Última actualización: ahora</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${showPreview ? 'bg-[var(--accent-green)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border-color)]'}`}
            >
              <FiEye />
            </button>
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="px-3 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg text-sm font-semibold hover:border-[var(--accent-green)] transition-all flex items-center gap-2"
            >
              <FiCommand />
              <span className="hidden md:inline">Cmd+K</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'settings', label: 'Configuración', icon: <FiSettings /> },
          { id: 'profiles', label: 'Perfiles', icon: <FiLayers /> },
          { id: 'activity', label: 'Actividad', icon: <FiActivity /> },
          { id: 'advanced', label: 'Avanzado', icon: <FiSliders /> },
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all
              ${activeTab === tab.id 
                ? 'bg-gradient-to-r from-[var(--accent-green)] to-blue-500 text-white shadow-lg' 
                : 'bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-green)]'
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Exámenes', value: stats.totalExams, icon: <FiCalendar />, color: 'from-blue-500/20 to-cyan-500/20', textColor: 'text-blue-400' },
          { label: 'Hábitos', value: stats.totalHabits, icon: <FiZap />, color: 'from-purple-500/20 to-pink-500/20', textColor: 'text-purple-400' },
          { label: 'Días', value: stats.totalScheduleDays, icon: <FiClock />, color: 'from-green-500/20 to-emerald-500/20', textColor: 'text-green-400' },
          { label: 'Almacenamiento', value: `${stats.dataSize} MB`, icon: <FiDatabase />, color: 'from-orange-500/20 to-yellow-500/20', textColor: 'text-orange-400' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`bg-gradient-to-br ${stat.color} border border-white/10 rounded-xl p-6 backdrop-blur-sm`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.textColor} text-2xl`}>{stat.icon}</div>
              <FiTrendingUp className="text-green-400 text-sm" />
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</div>
            <div className="text-sm text-[var(--text-secondary)]">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Preview Panel */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PreviewPanel settings={settings} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Based on Active Tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              {/* Smart Recommendations */}
              <SmartRecommendations stats={stats} />

              {/* GESTIÓN DE DATOS */}
              <ConfigSection 
                title="Gestión de Datos y Backups" 
                icon={<FiDatabase size={20} />}
                badge="Crítico"
              >
                <div className="space-y-4">
                  
                  <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <FiInfo className="text-blue-400 mt-1 flex-shrink-0" />
                      <div className="text-sm">
                        <strong className="text-blue-400">Consejo Pro:</strong>
                        <span className="text-[var(--text-secondary)]"> Exportá backups regulares y almacenalos en múltiples ubicaciones. Usa sincronización en la nube para mayor seguridad.</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <ActionButton
                      onClick={handleExportBackup}
                      icon={<FiDownload />}
                      label="Exportar JSON"
                      variant="success"
                      loading={isLoading}
                    />
                    
                    <label className="cursor-pointer">
                      <input type="file" accept=".json" onChange={importConfig} className="hidden" />
                      <ActionButton
                        onClick={() => {}}
                        icon={<FiUpload />}
                        label="Importar JSON"
                        variant="primary"
                      />
                    </label>

                    <ActionButton
                      onClick={exportToICS}
                      icon={<FiCalendar />}
                      label="Exportar Calendario"
                      variant="primary"
                    />

                    <ActionButton
                      onClick={resetConfig}
                      icon={<FiRefreshCw />}
                      label="Restaurar Original"
                      variant="warning"
                    />

                    <ActionButton
                      onClick={() => showToast('Próximamente: Exportar PDF', 'info')}
                      icon={<FiFileText />}
                      label="Exportar PDF"
                      variant="primary"
                    />

                    <ActionButton
                      onClick={() => showToast('Próximamente: Sincronización en nube', 'info')}
                      icon={<FiCloud />}
                      label="Sync Cloud"
                      variant="primary"
                    />
                  </div>

                  <div className="border-t border-[var(--border-color)] pt-4">
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3 flex items-center gap-2">
                      <FiTrash2 className="text-red-400" />
                      Zona de Peligro
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ActionButton
                        onClick={handleClearTasks}
                        icon={<FiTrash2 />}
                        label="Borrar Tareas Completadas"
                        variant="danger"
                      />
                      <ActionButton
                        onClick={handleClearHabits}
                        icon={<FiTrash2 />}
                        label="Borrar Hábitos Completados"
                        variant="danger"
                      />
                    </div>
                  </div>

                  <Switch
                    enabled={settings.autoSave}
                    onChange={(val) => updateSetting('autoSave', val)}
                    label="Guardado automático"
                    description="Guarda automáticamente cada 30 segundos"
                    badge="Auto"
                  />

                  <div className="flex items-center justify-between py-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-[var(--text-primary)]">
                        Retención de datos
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-1">
                        Eliminar datos antiguos automáticamente
                      </div>
                    </div>
                    <select 
                      value={settings.dataRetention}
                      onChange={(e) => updateSetting('dataRetention', Number(e.target.value))}
                      className="px-3 py-2 bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)] cursor-pointer hover:border-[var(--accent-green)] transition-all"
                    >
                      <option value={7}>7 días</option>
                      <option value={30}>30 días</option>
                      <option value={90}>90 días</option>
                      <option value={365}>1 año</option>
                      <option value={-1}>Nunca</option>
                    </select>
                  </div>
                </div>
              </ConfigSection>

              {/* NOTIFICACIONES */}
              <ConfigSection 
                title="Notificaciones y Recordatorios" 
                icon={<FiBell size={20} />}
                badge="Smart"
              >
                <Switch
                  enabled={settings.enableNotifications}
                  onChange={(val) => updateSetting('enableNotifications', val)}
                  label="Habilitar notificaciones"
                  description="Recibí alertas inteligentes sobre tus exámenes y tareas"
                />

                {settings.enableNotifications && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pl-4 border-l-2 border-[var(--accent-green)]"
                  >
                    <Switch
                      enabled={settings.notifyBeforeExam}
                      onChange={(val) => updateSetting('notifyBeforeExam', val)}
                      label="Recordatorios de exámenes"
                      description="Notificaciones inteligentes antes de cada examen"
                      badge="Smart"
                    />

                    <div className="flex items-center justify-between py-3">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[var(--text-primary)]">
                          Tiempo de anticipación
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          Cuándo querés ser notificado
                        </div>
                      </div>
                      <select 
                        value={settings.examReminderTime}
                        onChange={(e) => updateSetting('examReminderTime', Number(e.target.value))}
                        className="px-3 py-2 bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg text-sm text-[var(--text-primary)]"
                      >
                        <option value={1}>1 hora antes</option>
                        <option value={3}>3 horas antes</option>
                        <option value={6}>6 horas antes</option>
                        <option value={12}>12 horas antes</option>
                        <option value={24}>1 día antes</option>
                        <option value={48}>2 días antes</option>
                        <option value={72}>3 días antes</option>
                        <option value={168}>1 semana antes</option>
                      </select>
                    </div>

                    <Switch
                      enabled={settings.notifyDailyGoals}
                      onChange={(val) => updateSetting('notifyDailyGoals', val)}
                      label="Resumen diario"
                      description="Recibí un resumen cada mañana con tus pendientes"
                    />

                    <Switch
                      enabled={settings.soundEnabled}
                      onChange={(val) => updateSetting('soundEnabled', val)}
                      label="Sonidos y vibraciones"
                      description="Reproducir sonido con las notificaciones"
                    />

                    <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-3">
                      <div className="text-sm text-purple-300 mb-2 font-semibold">🔔 Próximamente</div>
                      <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                        <li>• Notificaciones push en dispositivos móviles</li>
                        <li>• Integración con Google Calendar</li>
                        <li>• Recordatorios por email/SMS</li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </ConfigSection>

              {/* APARIENCIA */}
              <ConfigSection 
                title="Apariencia y Personalización" 
                icon={<FiEye size={20} />}
                badge="Nuevo"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Switch
                    enabled={settings.darkMode}
                    onChange={(val) => updateSetting('darkMode', val)}
                    label="Modo oscuro"
                    description="Mejor para ambientes con poca luz"
                  />

                  <Switch
                    enabled={settings.animations}
                    onChange={(val) => updateSetting('animations', val)}
                    label="Animaciones fluidas"
                    description="Transiciones y efectos visuales suaves"
                  />

                  <Switch
                    enabled={settings.compactMode}
                    onChange={(val) => updateSetting('compactMode', val)}
                    label="Modo compacto"
                    description="Más información en menos espacio"
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--text-primary)]">
                      🎨 Color de acento
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      Personaliza el color principal de la interfaz
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { name: 'green', color: '#10b981' },
                      { name: 'blue', color: '#3b82f6' },
                      { name: 'purple', color: '#a855f7' },
                      { name: 'pink', color: '#ec4899' },
                      { name: 'orange', color: '#f97316' },
                      { name: 'cyan', color: '#06b6d4' },
                    ].map(({ name, color }) => (
                      <motion.button
                        key={name}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => updateSetting('accentColor', name)}
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all
                          ${settings.accentColor === name ? 'border-white scale-110 ring-2 ring-white/30' : 'border-transparent'}
                        `}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/30 rounded-lg p-4">
                  <div className="text-sm font-semibold text-pink-300 mb-2">✨ Personalización Premium (Próximamente)</div>
                  <ul className="text-xs text-[var(--text-secondary)] space-y-1">
                    <li>• Temas personalizados con gradientes</li>
                    <li>• Fondos de pantalla dinámicos</li>
                    <li>• Fuentes personalizadas</li>
                    <li>• Exportar/Importar temas</li>
                  </ul>
                </div>
              </ConfigSection>

              {/* TÉCNICA POMODORO */}
              <ConfigSection 
                title="Técnica Pomodoro y Temporizadores" 
                icon={<FiClock size={20} />}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block flex items-center gap-1">
                      ⏱️ Tiempo de estudio
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={settings.pomodoroTime}
                        onChange={(e) => updateSetting('pomodoroTime', Number(e.target.value))}
                        min={15}
                        max={60}
                        className="w-full px-3 py-2 bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--accent-green)]/20 transition-all"
                      />
                      <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">minutos</span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      Recomendado: 25-50 min
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block flex items-center gap-1">
                      ☕ Descanso corto
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={settings.shortBreak}
                        onChange={(e) => updateSetting('shortBreak', Number(e.target.value))}
                        min={1}
                        max={15}
                        className="w-full px-3 py-2 bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--accent-green)]/20 transition-all"
                      />
                      <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">minutos</span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      Recomendado: 5-10 min
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-2 block flex items-center gap-1">
                      🌴 Descanso largo
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={settings.longBreak}
                        onChange={(e) => updateSetting('longBreak', Number(e.target.value))}
                        min={10}
                        max={30}
                        className="w-full px-3 py-2 bg-[var(--bg-inner)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[var(--accent-green)]/20 transition-all"
                      />
                      <span className="text-sm text-[var(--text-secondary)] whitespace-nowrap">minutos</span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      Recomendado: 15-30 min
                    </div>
                  </div>
                </div>

                <Switch
                  enabled={settings.autoStartBreaks}
                  onChange={(val) => updateSetting('autoStartBreaks', val)}
                  label="Iniciar descansos automáticamente"
                  description="Los descansos comienzan sin necesidad de confirmación"
                />

                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FiTarget className="text-green-400 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <strong className="text-green-400">Técnica Pomodoro:</strong>
                      <span className="text-[var(--text-secondary)]"> Trabajá en bloques de tiempo con descansos intermedios. Cada 4 pomodoros, tomá un descanso largo. Esta técnica mejora tu concentración y productividad.</span>
                    </div>
                  </div>
                </div>
              </ConfigSection>

              {/* PRIVACIDAD */}
              <ConfigSection 
                title="Privacidad y Seguridad" 
                icon={<FiLock size={20} />}
                defaultOpen={false}
              >
                <Switch
                  enabled={settings.syncEnabled}
                  onChange={(val) => updateSetting('syncEnabled', val)}
                  label="Sincronización en la nube"
                  description="Sincroniza tus datos entre todos tus dispositivos"
                  badge="Beta"
                />

                <Switch
                  enabled={settings.analytics}
                  onChange={(val) => updateSetting('analytics', val)}
                  label="Análisis de uso anónimo"
                  description="Ayudanos a mejorar compartiendo datos de uso (100% anónimo)"
                />

                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FiShield className="text-yellow-400 mt-1 flex-shrink-0 text-xl" />
                    <div className="text-sm">
                      <strong className="text-yellow-400">Tu privacidad es nuestra prioridad:</strong>
                      <span className="text-[var(--text-secondary)]"> Todos tus datos se almacenan localmente en tu navegador. No compartimos, vendemos ni accedemos a tu información personal. Tu información permanece 100% bajo tu control.</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-[var(--bg-inner)] rounded-lg border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-2">
                      <FiMonitor className="text-blue-400" />
                      <span className="font-semibold text-[var(--text-primary)]">Almacenamiento Local</span>
                    </div>
                    <div className="text-[var(--text-secondary)]">Tus datos están en tu dispositivo, no en servidores externos</div>
                  </div>
                  <div className="p-3 bg-[var(--bg-inner)] rounded-lg border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 mb-2">
                      <FiShield className="text-green-400" />
                      <span className="font-semibold text-[var(--text-primary)]">Cifrado</span>
                    </div>
                    <div className="text-[var(--text-secondary)]">Los backups exportados pueden ser cifrados (próximamente)</div>
                  </div>
                </div>
              </ConfigSection>
            </div>
          )}

          {/* PROFILES TAB */}
          {activeTab === 'profiles' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  🎯 Perfiles Preconfigurados
                </h2>
                <p className="text-[var(--text-secondary)]">
                  Aplicá configuraciones optimizadas según tu situación. Cada perfil ajusta automáticamente múltiples parámetros.
                </p>
              </div>
              <ProfileSelector onSelectProfile={applyProfile} />
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <ActivityTimeline activities={recentActivities} />
              
              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="font-semibold text-lg text-[var(--text-primary)] flex items-center gap-2 mb-4">
                  <FiBarChart2 className="text-[var(--accent-green)]" />
                  Estadísticas de Uso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-[var(--bg-inner)] rounded-lg">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">127</div>
                    <div className="text-sm text-[var(--text-secondary)]">Configuraciones cambiadas</div>
                  </div>
                  <div className="p-4 bg-[var(--bg-inner)] rounded-lg">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">15</div>
                    <div className="text-sm text-[var(--text-secondary)]">Backups creados</div>
                  </div>
                  <div className="p-4 bg-[var(--bg-inner)] rounded-lg">
                    <div className="text-2xl font-bold text-[var(--text-primary)]">89%</div>
                    <div className="text-sm text-[var(--text-secondary)]">Notificaciones efectivas</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED TAB */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <ConfigSection 
                title="Configuración Avanzada" 
                icon={<FiSettings size={20} />}
              >
                <Switch
                  enabled={settings.developerMode}
                  onChange={(val) => updateSetting('developerMode', val)}
                  label="Modo desarrollador"
                  description="Muestra información técnica y opciones avanzadas"
                  badge="Dev"
                />

                <Switch
                  enabled={settings.betaFeatures}
                  onChange={(val) => updateSetting('betaFeatures', val)}
                  label="Funciones experimentales"
                  description="Acceso anticipado a características en desarrollo"
                  badge="Beta"
                />

                <div className="pt-4 border-t border-[var(--border-color)]">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Información del Sistema</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex justify-between p-2 bg-[var(--bg-inner)] rounded">
                      <span className="text-[var(--text-secondary)]">Versión:</span>
                      <span className="font-mono text-[var(--text-primary)]">2.5.0</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[var(--bg-inner)] rounded">
                      <span className="text-[var(--text-secondary)]">Build:</span>
                      <span className="font-mono text-[var(--text-primary)]">#2847</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[var(--bg-inner)] rounded">
                      <span className="text-[var(--text-secondary)]">Almacenamiento:</span>
                      <span className="font-mono text-[var(--text-primary)]">{stats.dataSize} MB</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[var(--bg-inner)] rounded">
                      <span className="text-[var(--text-secondary)]">Último backup:</span>
                      <span className="font-mono text-[var(--text-primary)]">{stats.lastBackup}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-red-400 mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <strong className="text-red-400">Zona de Peligro:</strong>
                      <span className="text-[var(--text-secondary)]"> Las siguientes acciones son irreversibles y pueden resultar en pérdida de datos.</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold">
                      Borrar TODOS los datos
                    </button>
                    <button className="w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold">
                      Restablecer de fábrica
                    </button>
                  </div>
                </div>
              </ConfigSection>

              <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-6">
                <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-4">
                  ⌨️ Atajos de Teclado
                </h3>
                <div className="space-y-2">
                  {[
                    { keys: ['Cmd/Ctrl', 'K'], action: 'Abrir paleta de comandos' },
                    { keys: ['Cmd/Ctrl', 'S'], action: 'Guardar cambios' },
                    { keys: ['Cmd/Ctrl', 'E'], action: 'Exportar configuración' },
                    { keys: ['ESC'], action: 'Cerrar diálogos' },
                  ].map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-inner)] rounded-lg">
                      <span className="text-sm text-[var(--text-primary)]">{shortcut.action}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd key={i} className="px-2 py-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded text-xs font-mono">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4 items-center justify-between p-6 bg-gradient-to-r from-[var(--bg-card)] to-[var(--bg-inner)] border border-[var(--border-color)] rounded-xl shadow-lg"
      >
        <div className="text-sm text-[var(--text-secondary)]">
          ¿Necesitás ayuda? 
          <a href="#" className="text-[var(--accent-green)] hover:underline ml-1 inline-flex items-center gap-1">
            Ver documentación
            <FiExternalLink size={12} />
          </a>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSaveAll}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                <FiRefreshCw />
              </motion.div>
            ) : (
              <FiSave />
            )}
            Guardar Todos los Cambios
          </motion.button>
        </div>
      </motion.div>

    </div>
  );
};

export default Config;