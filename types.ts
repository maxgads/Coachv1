
export interface Exam {
  name: string;
  date: string; // Stored as ISO string for JSON compatibility
  subject: string;
  priority: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  critical: boolean;
}

export interface ScheduleTask {
  start: string;
  end: string;
  subject: string;
  task: string;
  hours: number;
}

export interface Schedule {
  [dateKey: string]: ScheduleTask[];
}

export interface AppConfig {
  exams: Exam[];
  habits: Habit[];
  scheduleByDate: Schedule;
}

export type View = 'dashboard' | 'planner' | 'analytics' | 'habits' | 'config';

export interface CompletedTasks {
    [taskId: string]: boolean;
}

export interface CompletedHabits {
    [dateKey: string]: {
        [habitId: string]: boolean;
    };
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
