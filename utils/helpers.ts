import type { Schedule, CompletedTasks, CompletedHabits, Habit } from '../types';

export const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const parseDateKey = (dateKey: string): Date => {
    const [year, month, day] = dateKey.split('-').map(Number);
    return new Date(year, month - 1, day);
};

export const getDayName = (dayOfWeek: number): string => ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dayOfWeek];


export const getSubjectStats = (subjectName: string, scheduleByDate: Schedule, completedTasks: CompletedTasks) => {
    let totalHours = 0;
    let completedHours = 0;
    
    Object.entries(scheduleByDate).forEach(([dateKey, tasks]) => {
        tasks.forEach((task, idx) => {
            if (task.subject === subjectName) {
                totalHours += task.hours;
                const taskId = `${dateKey}-${idx}`;
                if (completedTasks[taskId]) {
                    completedHours += task.hours;
                }
            }
        });
    });
    
    return { totalHours, completedHours, percentage: totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0 };
};

export const getScheduleWeekCount = (scheduleByDate: Schedule): number => {
    const dateKeys = Object.keys(scheduleByDate);
    if (dateKeys.length === 0) return 0;
    const sortedKeys = dateKeys.sort();
    const startDate = parseDateKey(sortedKeys[0]);
    const endDate = parseDateKey(sortedKeys[sortedKeys.length - 1]);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.ceil((diffDays + 1) / 7);
};


export const getWeeklyStats = (weekNum: number, scheduleByDate: Schedule, completedTasks: CompletedTasks) => {
    const dateKeys = Object.keys(scheduleByDate).sort();
    if (dateKeys.length === 0) return { totalHours: 0, completedHours: 0, percentage: 0 };

    const scheduleStartDate = parseDateKey(dateKeys[0]);
    const startDate = new Date(scheduleStartDate);
    startDate.setDate(startDate.getDate() + (weekNum * 7));

    let totalHours = 0;
    let completedHours = 0;

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateKey = formatDateKey(date);
        const tasks = scheduleByDate[dateKey] || [];

        tasks.forEach((task, idx) => {
            totalHours += task.hours;
            const taskId = `${dateKey}-${idx}`;
            if (completedTasks[taskId]) {
                completedHours += task.hours;
            }
        });
    }

    return { totalHours, completedHours, percentage: totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0 };
};

export const getWeeklyProgressData = (scheduleByDate: Schedule, completedTasks: CompletedTasks, totalWeeks: number) => {
    const weeklyData = Array.from({ length: totalWeeks }, () => 0);
    for (let i = 0; i < totalWeeks; i++) {
        const stats = getWeeklyStats(i, scheduleByDate, completedTasks);
        weeklyData[i] = stats.completedHours;
    }
    return weeklyData;
};


export const getCurrentWeekStats = (scheduleByDate: Schedule, completedTasks: CompletedTasks) => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)));
    
    let totalHours = 0;
    let completedHours = 0;

    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const dateKey = formatDateKey(date);
        const tasks = scheduleByDate[dateKey] || [];

        tasks.forEach((task, idx) => {
            totalHours += task.hours;
            const taskId = `${dateKey}-${idx}`;
            if (completedTasks[taskId]) {
                completedHours += task.hours;
            }
        });
    }

    return { totalHours: totalHours.toFixed(1), completedHours: completedHours.toFixed(1), percentage: totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0 };
};

export const getDaysOfCurrentWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)));
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push({
            dateKey: formatDateKey(date),
            dayName: getDayName(date.getDay()).substring(0, 1)
        });
    }
    return days;
};

export const getWeeklyHabitStats = (habits: Habit[], completedHabits: CompletedHabits) => {
    const weekDays = getDaysOfCurrentWeek();
    return habits.map(habit => {
        const completedDays = weekDays.filter(day => completedHabits[day.dateKey]?.[habit.id]).length;
        return {
            ...habit,
            completedThisWeek: completedDays,
        };
    });
};


export const getHabitStats = (habitId: string, scheduleByDate: Schedule, completedHabits: CompletedHabits) => {
    const dateKeys = Object.keys(scheduleByDate).sort();
    if (dateKeys.length === 0) return { totalDays: 0, completedDays: 0, percentage: 0 };

    const startDate = parseDateKey(dateKeys[0]);
    const endDate = parseDateKey(dateKeys[dateKeys.length - 1]);
    let totalDays = 0;
    let completedDays = 0;

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDateKey(d);
        totalDays++;
        if (completedHabits[dateKey] && completedHabits[dateKey][habitId]) {
            completedDays++;
        }
    }

    return { totalDays, completedDays, percentage: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0 };
};

export const getHabitStreaks = (habitId: string, completedHabits: CompletedHabits, scheduleByDate: Schedule) => {
    const sortedDateKeys = Object.keys(scheduleByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    if (sortedDateKeys.length === 0) return { current: 0, best: 0 };

    const startDate = parseDateKey(sortedDateKeys[0]);
    const today = new Date();
    
    let bestStreak = 0;
    let currentRun = 0;

    // Iterate through all days from the start of the schedule to today to find the best streak
    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDateKey(d);
        if (completedHabits[dateKey]?.[habitId]) {
            currentRun++;
        } else {
            bestStreak = Math.max(bestStreak, currentRun);
            currentRun = 0;
        }
    }
    bestStreak = Math.max(bestStreak, currentRun);

    // Calculate current streak by iterating backwards from today
    let currentStreak = 0;
    for (let i = 0; ; i++) {
        const d = new Date();
        d.setHours(0,0,0,0);
        d.setDate(d.getDate() - i);
        if (d < startDate) break;

        const dateKey = formatDateKey(d);
        
        if (i > 0 && !completedHabits[dateKey]?.[habitId]) {
             break; // streak is broken
        } else if (completedHabits[dateKey]?.[habitId]) {
             currentStreak++;
        }
    }
    
    return { current: currentStreak, best: bestStreak };
};


export const getTodayHabitCompletion = (habits: Habit[], completedHabits: CompletedHabits, currentTime: Date) => {
    const todayKey = formatDateKey(currentTime);
    const todayHabits = completedHabits[todayKey] || {};
    const completed = Object.keys(todayHabits).filter(k => todayHabits[k]).length;
    const total = habits.length > 0 ? habits.length : 1;
    return { completed, total: habits.length, percentage: habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0 };
};