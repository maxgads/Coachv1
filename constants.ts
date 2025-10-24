
import type { AppConfig } from './types';

export const getDefaultConfig = (): AppConfig => ({
    exams: [
        { name: 'Termo Primera fecha', date: '2025-12-01T12:00:00', subject: 'Termodinámica', priority: 1 },
        { name: 'Electro Primera fecha', date: '2025-12-03T15:00:00', subject: 'Electrotecnia', priority: 2 },
        { name: 'Racional Primera fecha', date: '2025-12-04T10:00:00', subject: 'Mecánica Racional', priority: 1 },
        { name: 'Estructuras Primera fecha', date: '2025-12-09T14:00:00', subject: 'Estructuras III', priority: 3 },
        { name: 'Termo Segunda fecha', date: '2025-12-15T12:00:00', subject: 'Termodinámica', priority: 1 },
        { name: 'Racional Segunda fecha', date: '2025-12-15T10:00:00', subject: 'Mecánica Racional', priority: 1 },
        { name: 'Electro Segunda fecha', date: '2025-12-17T15:00:00', subject: 'Electrotecnia', priority: 2 },
        { name: 'Estructuras Segunda fecha', date: '2025-12-18T14:00:00', subject: 'Estructuras III', priority: 3 },
        { name: 'Estructuras Flotante', date: '2026-02-12T14:00:00', subject: 'Estructuras III', priority: 3 },
        { name: 'Racional Flotante', date: '2026-02-12T10:00:00', subject: 'Mecánica Racional', priority: 1 },
        { name: 'Termo Flotante', date: '2026-02-18T12:00:00', subject: 'Termodinámica', priority: 1 },
        { name: 'Electro Flotante', date: '2026-02-19T15:00:00', subject: 'Electrotecnia', priority: 2 },
        { name: 'Racional Instancia teórica', date: '2026-02-19T10:00:00', subject: 'Mecánica Racional', priority: 1 }
    ],
    habits: [
        { id: 'sleep23', name: 'Dormir 23:00', icon: '🛌', critical: true },
        { id: 'dinner20', name: 'Cenar 20:00-20:30', icon: '🍽️', critical: false },
        { id: 'noLol', name: 'CERO LoL', icon: '🎮', critical: true },
        { id: 'noWeed', name: 'CERO marihuana', icon: '🚫', critical: true },
        { id: 'water2L', name: '2L agua', icon: '💧', critical: false }
    ],
    scheduleByDate: {
        '2025-10-22': [
            { start: '08:00', end: '10:00', subject: 'Mecánica Racional', task: '🎯 Inicio Módulo II - Introducción a temas clave', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Termodinámica', task: '🎯 Inicio Módulo II - Conceptos base', hours: 1.5 },
            { start: '13:30', end: '16:30', subject: 'Electrotecnia', task: 'Repaso módulo anterior', hours: 3 }
        ],
        '2025-10-23': [
            { start: '08:00', end: '10:00', subject: 'Estructuras III', task: '🎯 Inicio Módulo II - Introducción', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Mecánica Racional', task: 'Continuación temas', hours: 1.5 },
            { start: '13:30', end: '16:00', subject: 'Termodinámica', task: 'Ejercicios introductorios', hours: 2.5 }
        ],
        '2025-10-24': [
            { start: '08:00', end: '10:00', subject: 'Mecánica Racional', task: '🎯 Temas clave del módulo', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Termodinámica', task: 'Avance de teoría', hours: 1.5 },
            { start: '13:30', end: '16:00', subject: 'Electrotecnia', task: 'Práctica de circuitos', hours: 2.5 }
        ],
        '2025-10-25': [
            { start: '08:00', end: '10:00', subject: 'Estructuras III', task: '🎯 Ejercicios básicos', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Mecánica Racional', task: 'Problemas prácticos', hours: 1.5 },
            { start: '13:30', end: '16:00', subject: 'Termodinámica', task: 'Práctica', hours: 2.5 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido/Entrenamiento', hours: 2 }
        ],
        '2025-10-26': [
            { start: '08:00', end: '10:00', subject: 'Electrotecnia', task: '🎯 Problemas tipo', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Mecánica Racional', task: 'Ejercicios', hours: 1.5 },
            { start: '13:30', end: '16:00', subject: 'Estructuras III', task: 'Práctica', hours: 2.5 }
        ],
        '2025-10-27': [
            { start: '08:00', end: '10:00', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Repasar ciclos termodinámicos básicos (Carnot, Otto)', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Dominar cinemática de partículas', hours: 1.5 },
            { start: '13:00', end: '15:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '16:00', end: '20:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '20:00', end: '20:30', subject: 'Cena', task: '🍽️ Cenar', hours: 0.5 }
        ],
        '2025-10-28': [
            { start: '08:00', end: '10:00', subject: 'Estructuras III', task: '🎯 MICRO-OBJETIVO: Entender métodos matriciales básicos', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Resolver 5 ejercicios de cinemática', hours: 1.5 },
            { start: '15:00', end: '18:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 3 },
            { start: '18:30', end: '19:00', subject: 'Estructuras III', task: 'Repaso rápido de lo visto en clase', hours: 0.5 },
            { start: '20:00', end: '20:30', subject: 'Cena', task: '🍽️ Cenar', hours: 0.5 }
        ],
        '2025-10-29': [
            { start: '08:00', end: '10:30', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Dominar ecuaciones de energía', hours: 2.5 },
            { start: '11:00', end: '13:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '14:00', end: '18:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '18:00', end: '20:00', subject: 'Básquet (opcional)', task: '🏀 Si vas, perfecto. Si no, descansá', hours: 0 },
            { start: '20:00', end: '20:30', subject: 'Cena', task: '🍽️ Cenar', hours: 0.5 }
        ],
        '2025-10-30': [
            { start: '08:00', end: '10:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Comprender dinámica de partículas', hours: 2 },
            { start: '10:30', end: '12:00', subject: 'Estructuras III', task: '🎯 MICRO-OBJETIVO: Hacer 3 ejercicios de matrices', hours: 1.5 },
            { start: '12:00', end: '14:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '14:00', end: '17:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 3 },
            { start: '17:30', end: '18:00', subject: 'Estructuras III', task: 'Repaso de clase', hours: 0.5 },
            { start: '20:00', end: '20:30', subject: 'Cena', task: '🍽️ Cenar', hours: 0.5 }
        ],
        '2025-10-31': [
            { start: '08:00', end: '10:00', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Resolver 5 problemas de ciclos', hours: 2 },
            { start: '10:30', end: '12:30', subject: 'Mecánica Racional', task: '🎯 VARIEDAD: Mezcla teoría + 3 ejercicios prácticos', hours: 2 },
            { start: '13:00', end: '15:00', subject: 'Repaso Semanal', task: '📝 CONSOLIDACIÓN: Revisar lo que aprendiste esta semana', hours: 2 },
            { start: '20:00', end: '20:30', subject: 'Cena', task: '🍽️ Cenar', hours: 0.5 }
        ],
        '2025-11-01': [
            { start: '10:00', end: '12:00', subject: 'Repaso Semanal', task: '✅ BUFFER: Repasar lo que quedó pendiente (OPCIONAL)', hours: 2 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido (FIJO)', hours: 2 }
        ],
        '2025-11-02': [
            { start: '10:00', end: '12:00', subject: 'Descanso', task: '🌴 DESCANSO TOTAL - Disfrutá tu día libre', hours: 0 }
        ],
        '2025-11-03': [
            { start: '08:00', end: '10:00', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Dominar 2da Ley y entropía', hours: 2 },
            { start: '10:30', end: '12:30', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Comprender momento angular', hours: 2 },
            { start: '13:00', end: '15:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '16:00', end: '20:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '20:00', end: '21:00', subject: 'Termodinámica', task: 'Repaso rápido de clase', hours: 1 }
        ],
        '2025-11-04': [
            { start: '08:00', end: '10:00', subject: 'Estructuras III', task: '🎯 MICRO-OBJETIVO: Análisis matricial avanzado (teoría)', hours: 2 },
            { start: '10:30', end: '12:30', subject: 'Mecánica Racional', task: '🎯 VARIEDAD: 5 ejercicios mixtos (cinemática + dinámica)', hours: 2 },
            { start: '15:00', end: '18:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 3 },
            { start: '18:30', end: '19:30', subject: 'Estructuras III', task: 'Practicar lo visto en clase', hours: 1 }
        ],
        '2025-11-05': [
            { start: '08:00', end: '11:00', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Resolver 5 problemas de entropía', hours: 3 },
            { start: '11:00', end: '13:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '14:00', end: '18:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '18:00', end: '20:00', subject: 'Básquet (opcional)', task: '🏀 Si vas, perfecto', hours: 0 }
        ],
        '2025-11-06': [
            { start: '08:00', end: '10:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Dominar trabajo y energía', hours: 2 },
            { start: '10:30', end: '12:30', subject: 'Estructuras III', task: '🎯 VARIEDAD: Hacer 4 ejercicios de matrices', hours: 2 },
            { start: '12:30', end: '14:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 1.5 },
            { start: '14:00', end: '17:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 3 },
            { start: '17:30', end: '18:30', subject: 'Termodinámica', task: 'Repasar conceptos clave', hours: 1 }
        ],
        '2025-11-07': [
            { start: '08:00', end: '10:30', subject: 'Termodinámica', task: '🎯 VARIEDAD: Teoría (1h) + Práctica (1.5h)', hours: 2.5 },
            { start: '11:00', end: '13:30', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Resolver 7 ejercicios mixtos', hours: 2.5 },
            { start: '14:00', end: '16:00', subject: 'Repaso Semanal', task: '📝 CONSOLIDACIÓN: Revisar las 3 materias', hours: 2 }
        ],
        '2025-11-08': [
            { start: '10:00', end: '13:00', subject: 'Repaso General', task: '✅ BUFFER: Repasar lo pendiente + primer simulacro Termo', hours: 3 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido (FIJO)', hours: 2 }
        ],
        '2025-11-09': [
            { start: '10:00', end: '12:00', subject: 'Descanso', task: '🌴 DESCANSO TOTAL', hours: 0 }
        ],
        '2025-11-10': [
            { start: '08:00', end: '10:30', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Dominar exergía y disponibilidad', hours: 2.5 },
            { start: '11:00', end: '13:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Comprender movimiento oscilatorio', hours: 2 },
            { start: '13:00', end: '15:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '16:00', end: '20:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '20:00', end: '21:30', subject: 'Termodinámica', task: '📝 SIMULACRO: 3 ejercicios tipo parcial (30min)', hours: 1.5 }
        ],
        '2025-11-11': [
            { start: '08:00', end: '10:30', subject: 'Estructuras III', task: '🎯 MICRO-OBJETIVO: Dominar análisis de pórticos', hours: 2.5 },
            { start: '11:00', end: '13:00', subject: 'Mecánica Racional', task: '🎯 VARIEDAD: Teoría (45min) + Ejercicios (1h15min)', hours: 2 },
            { start: '15:00', end: '18:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 3 },
            { start: '18:30', end: '20:00', subject: 'Estructuras III', task: 'Practicar 3 ejercicios de clase', hours: 1.5 }
        ],
        '2025-11-12': [
            { start: '08:00', end: '11:30', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Mezclas y psicrometría (conceptos + 3 ejercicios)', hours: 3.5 },
            { start: '11:30', end: '13:30', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '14:00', end: '18:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '18:00', end: '20:00', subject: 'Básquet (opcional)', task: '🏀 Si vas, bien. Si no, descansá', hours: 0 }
        ],
        '2025-11-13': [
            { start: '08:00', end: '10:30', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Dominar dinámica de cuerpo rígido', hours: 2.5 },
            { start: '11:00', end: '13:00', subject: 'Estructuras III', task: '🎯 VARIEDAD: 4 ejercicios mixtos', hours: 2 },
            { start: '13:00', end: '14:30', subject: 'Gym', task: '💪 Entrenamiento', hours: 1.5 },
            { start: '14:30', end: '17:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 2.5 },
            { start: '17:30', end: '19:00', subject: 'Termodinámica', task: 'Repaso de conceptos clave', hours: 1.5 }
        ],
        '2025-11-14': [
            { start: '08:00', end: '11:00', subject: 'Termodinámica', task: '🎯 VARIEDAD: Teoría (1h) + Ejercicios complejos (2h)', hours: 3 },
            { start: '11:30', end: '14:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Introducción a Lagrange', hours: 2.5 },
            { start: '14:30', end: '17:00', subject: 'Repaso Semanal', task: '📝 CONSOLIDACIÓN + SIMULACRO', hours: 2.5 }
        ],
        '2025-11-15': [
            { start: '10:00', end: '13:00', subject: 'Repaso General', task: '✅ BUFFER + Simulacro Termo (1h)', hours: 3 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido (FIJO)', hours: 2 }
        ],
        '2025-11-16': [
            { start: '10:00', end: '12:00', subject: 'Descanso', task: '🌴 DESCANSO TOTAL', hours: 0 }
        ],
        '2025-11-17': [
            { start: '08:00', end: '11:00', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Dominar máquinas térmicas (compresores, turbinas)', hours: 3 },
            { start: '11:30', end: '13:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Dominar ecuaciones de Lagrange', hours: 1.5 },
            { start: '13:00', end: '15:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '16:00', end: '20:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '20:00', end: '21:30', subject: 'Termodinámica', task: '📝 Ejercicios post-clase', hours: 1.5 }
        ],
        '2025-11-18': [
            { start: '08:00', end: '11:00', subject: 'Estructuras III', task: '🎯 MICRO-OBJETIVO: Dominar análisis de vigas y pórticos', hours: 3 },
            { start: '11:30', end: '13:30', subject: 'Mecánica Racional', task: '🎯 VARIEDAD: Problemas de Lagrange (5 ejercicios)', hours: 2 },
            { start: '15:00', end: '18:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 3 },
            { start: '18:30', end: '19:30', subject: 'Estructuras III', task: 'Repaso de clase', hours: 1 }
        ],
        '2025-11-19': [
            { start: '08:00', end: '12:00', subject: 'Termodinámica', task: '🎯 VARIEDAD: Repaso integral todos los temas (teoría + práctica)', hours: 4 },
            { start: '12:00', end: '14:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '14:00', end: '18:00', subject: 'Termo (Cursada)', task: '📚 Clase teórica', hours: 4 },
            { start: '18:00', end: '20:00', subject: 'Básquet (opcional)', task: '🏀 Si vas, genial', hours: 0 }
        ],
        '2025-11-20': [
            { start: '08:00', end: '11:00', subject: 'Mecánica Racional', task: '🎯 MICRO-OBJETIVO: Estabilidad y equilibrio', hours: 3 },
            { start: '11:30', end: '13:30', subject: 'Termodinámica', task: '🎯 MICRO-OBJETIVO: Resolver 5 ejercicios difíciles', hours: 2 },
            { start: '13:30', end: '14:30', subject: 'Gym', task: '💪 Entrenamiento', hours: 1 },
            { start: '14:30', end: '17:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 2.5 },
            { start: '17:30', end: '18:30', subject: 'Estructuras III', task: 'Ejercicios finales', hours: 1 }
        ],
        '2025-11-21': [
            { start: '08:00', end: '11:00', subject: 'Termodinámica', task: '📝 SIMULACRO COMPLETO (3h como si fuera el parcial)', hours: 3 },
            { start: '11:30', end: '14:00', subject: 'Mecánica Racional', task: '🎯 VARIEDAD: Repaso integral + ejercicios', hours: 2.5 },
            { start: '14:30', end: '17:00', subject: 'Repaso Semanal', task: '📝 CONSOLIDACIÓN semanal', hours: 2.5 }
        ],
        '2025-11-22': [
            { start: '10:00', end: '13:00', subject: 'Repaso General', task: '✅ BUFFER: Repasar errores del simulacro + dudas', hours: 3 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido (FIJO)', hours: 2 }
        ],
        '2025-11-23': [
            { start: '10:00', end: '12:00', subject: 'Descanso', task: '🌴 DESCANSO TOTAL - Última semana viene intensiva', hours: 0 }
        ],
        '2025-11-24': [
            { start: '08:00', end: '11:30', subject: 'Termodinámica', task: '🔥 REPASO COMPLETO: Ciclos termodinámicos (Carnot, Otto, Diesel, Rankine)', hours: 3.5 },
            { start: '12:00', end: '13:00', subject: 'Mecánica Racional', task: '🎯 Mantener frescura: Repaso rápido Lagrange', hours: 1 },
            { start: '13:00', end: '15:00', subject: 'Gym', task: '💪 Entrenamiento (FUNDAMENTAL para manejar estrés)', hours: 2 },
            { start: '16:00', end: '20:00', subject: 'Termo (Cursada)', task: '📚 Última clase - Anotá todas las dudas', hours: 4 },
            { start: '20:00', end: '22:00', subject: 'Termodinámica', task: '📝 SIMULACRO: 5 ejercicios tipo parcial cronometrados', hours: 2 }
        ],
        '2025-11-25': [
            { start: '08:00', end: '11:30', subject: 'Termodinámica', task: '🔥 REPASO: 2da Ley, entropía, procesos irreversibles', hours: 3.5 },
            { start: '12:00', end: '14:00', subject: 'Termodinámica', task: '🔥 PRÁCTICA: Resolver 10 ejercicios de entropía', hours: 2 },
            { start: '15:00', end: '18:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica (ir para no perder continuidad)', hours: 3 },
            { start: '18:30', end: '20:30', subject: 'Termodinámica', task: '🔥 Ejercicios difíciles de parciales viejos', hours: 2 }
        ],
        '2025-11-26': [
            { start: '08:00', end: '12:00', subject: 'Termodinámica', task: '🔥 REPASO: Exergía, disponibilidad, máquinas térmicas', hours: 4 },
            { start: '12:00', end: '14:00', subject: 'Gym', task: '💪 Entrenamiento (descargá tensión)', hours: 2 },
            { start: '14:00', end: '18:00', subject: 'Termodinámica', task: '📝 SIMULACRO COMPLETO (3h como el parcial real + corrección)', hours: 4 },
            { start: '18:00', end: '20:00', subject: 'Básquet (opcional)', task: '🏀 SOLO si te sentís bien. Si no, descansá', hours: 0 }
        ],
        '2025-11-27': [
            { start: '08:00', end: '11:30', subject: 'Termodinámica', task: '🔥 CORREGIR errores del simulacro de ayer + teoría faltante', hours: 3.5 },
            { start: '12:00', end: '13:00', subject: 'Mecánica Racional', task: '🎯 Repaso ligero para no perder práctica', hours: 1 },
            { start: '13:00', end: '14:30', subject: 'Gym', task: '💪 Entrenamiento', hours: 1.5 },
            { start: '14:30', end: '17:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 2.5 },
            { start: '17:30', end: '20:30', subject: 'Termodinámica', task: '🔥 PRÁCTICA INTENSIVA: Ejercicios mixtos', hours: 3 }
        ],
        '2025-11-28': [
            { start: '08:00', end: '13:00', subject: 'Termodinámica', task: '🔥 REPASO FINAL: Todos los temas (teoría + fórmulas clave)', hours: 5 },
            { start: '14:00', end: '17:00', subject: 'Termodinámica', task: '📝 SIMULACRO 2: Parcial completo cronometrado', hours: 3 },
            { start: '17:30', end: '19:30', subject: 'Mecánica Racional', task: '🎯 Mantener: Ejercicios clave', hours: 2 }
        ],
        '2025-11-29': [
            { start: '09:00', end: '13:00', subject: 'Termodinámica', task: '🔥 CORREGIR SIMULACRO 2 + Reforzar puntos débiles', hours: 4 },
            { start: '14:00', end: '16:00', subject: 'Termodinámica', task: '🔥 Últimos ejercicios difíciles', hours: 2 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido (FIJO) - Despejá la mente', hours: 2 }
        ],
        '2025-11-30': [
            { start: '08:00', end: '12:00', subject: 'Termodinámica', task: '🔥 REPASO LIGERO: Fórmulas, conceptos clave, NO hagas nada nuevo', hours: 4 },
            { start: '13:00', end: '15:00', subject: 'Descanso', task: '🧘 RELAJATE - Prepará tus cosas para mañana', hours: 0 },
            { start: '20:00', end: '23:00', subject: 'Descanso', task: '💤 DORMIR TEMPRANO (23hs) - El cerebro necesita descanso', hours: 0 }
        ],
        '2025-12-01': [
            { start: '08:00', end: '11:00', subject: 'Repaso', task: '📖 Repaso MUY LIGERO de fórmulas (SIN practicar ejercicios nuevos)', hours: 3 },
            { start: '12:00', end: '15:00', subject: 'TERMO PARCIAL', task: '📝 PRIMERA FECHA - CONCENTRATE Y DA LO MEJOR', hours: 3 },
            { start: '16:00', end: '20:00', subject: 'Descanso', task: '🎉 CELEBRÁ - Ya pasó! Descansá y NO pienses en el examen', hours: 0 }
        ],
        '2025-12-02': [
            { start: '08:00', end: '13:00', subject: 'Mecánica Racional', task: '🔥 REPASO COMPLETO: Cinemática, dinámica, trabajo-energía', hours: 5 },
            { start: '13:30', end: '14:30', subject: 'Gym', task: '💪 Entrenamiento rápido', hours: 1 },
            { start: '15:00', end: '18:00', subject: 'Estructuras (Cursada)', task: '📚 Clase práctica', hours: 3 },
            { start: '18:30', end: '21:30', subject: 'Mecánica Racional', task: '🔥 EJERCICIOS TIPO PARCIAL: 10 ejercicios cronometrados', hours: 3 }
        ],
        '2025-12-03': [
            { start: '08:00', end: '12:00', subject: 'Mecánica Racional', task: '🔥 REPASO: Lagrange, osciladores, cuerpo rígido', hours: 4 },
            { start: '12:00', end: '14:00', subject: 'Gym', task: '💪 Entrenamiento', hours: 2 },
            { start: '14:00', end: '18:00', subject: 'Mecánica Racional', task: '📝 SIMULACRO COMPLETO cronometrado + corrección', hours: 4 },
            { start: '18:00', end: '20:00', subject: 'Básquet (opcional)', task: '🏀 SOLO si te sobra energía', hours: 0 }
        ],
        '2025-12-04': [
            { start: '08:00', end: '09:30', subject: 'Repaso', task: '📖 Repaso ligero de fórmulas y conceptos clave', hours: 1.5 },
            { start: '10:00', end: '13:00', subject: 'RACIONAL PARCIAL', task: '📝 PRIMERA FECHA - CONCENTRATE', hours: 3 },
            { start: '14:00', end: '20:00', subject: 'Descanso', task: '🎉 CELEBRÁ - 2 parciales hechos!', hours: 0 }
        ],
        '2025-12-05': [
            { start: '08:00', end: '13:00', subject: 'Estructuras III', task: '🔥 REPASO COMPLETO: Métodos matriciales, análisis de vigas', hours: 5 },
            { start: '13:30', end: '14:30', subject: 'Gym', task: '💪 Entrenamiento', hours: 1 },
            { start: '15:00', end: '18:00', subject: 'Estructuras (Cursada)', task: '📚 Última clase - Preguntá TODAS tus dudas', hours: 3 },
            { start: '18:30', end: '21:30', subject: 'Estructuras III', task: '🔥 PRÁCTICA: 8 ejercicios avanzados', hours: 3 }
        ],
        '2025-12-06': [
            { start: '09:00', end: '13:00', subject: 'Estructuras III', task: '🔥 REPASO: Análisis de pórticos y marcos', hours: 4 },
            { start: '14:00', end: '17:00', subject: 'Estructuras III', task: '📝 SIMULACRO COMPLETO cronometrado', hours: 3 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido (FIJO) - Despejá la mente', hours: 2 }
        ],
        '2025-12-07': [
            { start: '10:00', end: '14:00', subject: 'Estructuras III', task: '🔥 CORREGIR simulacro + Reforzar puntos débiles', hours: 4 },
            { start: '15:00', end: '20:00', subject: 'Descanso', task: '🧘 Descansá, no te sobrecargues antes del lunes', hours: 0 }
        ],
        '2025-12-08': [
            { start: '08:00', end: '12:00', subject: 'Estructuras III', task: '🔥 REPASO FINAL: Teoría + fórmulas + trucos', hours: 4 },
            { start: '13:00', end: '15:00', subject: 'Estructuras III', task: '🔥 Últimos 5 ejercicios tipo parcial', hours: 2 },
            { start: '16:00', end: '20:00', subject: 'Descanso', task: '🧘 RELAJATE - Prepará materiales para mañana', hours: 0 },
            { start: '20:00', end: '23:00', subject: 'Descanso', task: '💤 DORMIR 23hs', hours: 0 }
        ],
        '2025-12-09': [
            { start: '08:00', end: '13:00', subject: 'Repaso', task: '📖 Repaso ligero de conceptos y fórmulas clave', hours: 5 },
            { start: '14:00', end: '17:00', subject: 'ESTRUCTURAS PARCIAL', task: '📝 PRIMERA FECHA - ÚLTIMO ESFUERZO!', hours: 3 },
            { start: '18:00', end: '23:00', subject: 'Descanso', task: '🎉🎉 CELEBRACIÓN - LO LOGRASTE! 3 parciales rendidos!', hours: 0 }
        ],
        '2025-12-10': [
            { start: '09:00', end: '12:00', subject: 'Repaso General', task: 'Análisis de resultados y planificación', hours: 3 }
        ],
        '2025-12-13': [
            { start: '09:00', end: '13:00', subject: 'Termodinámica', task: 'Preparación 2da fecha (si desaprobaste)', hours: 4 },
            { start: '14:00', end: '17:00', subject: 'Mecánica Racional', task: 'Preparación 2da fecha (si desaprobaste)', hours: 3 },
            { start: '18:00', end: '20:00', subject: 'Básquet', task: '🏀 Partido/Entrenamiento', hours: 2 }
        ],
        '2025-12-14': [
            { start: '08:00', end: '12:00', subject: 'Termodinámica', task: 'Repaso intensivo 2da fecha', hours: 4 },
            { start: '13:30', end: '17:00', subject: 'Mecánica Racional', task: 'Ejercicios 2da fecha', hours: 3.5 }
        ],
        '2025-12-15': [
            { start: '08:00', end: '09:30', subject: 'Repaso', task: 'Repaso pre-parciales', hours: 1.5 },
            { start: '10:00', end: '13:00', subject: 'RACIONAL PARCIAL', task: '📝 SEGUNDA FECHA', hours: 3 },
            { start: '12:00', end: '15:00', subject: 'TERMO PARCIAL', task: '📝 SEGUNDA FECHA', hours: 3 }
        ],
        '2025-12-16': [
            { start: '08:00', end: '12:00', subject: 'Estructuras III', task: 'Preparación 2da fecha (si desaprobaste)', hours: 4 },
            { start: '13:30', end: '17:00', subject: 'Estructuras III', task: 'Ejercicios avanzados', hours: 3.5 }
        ],
        '2025-12-17': [
            { start: '08:00', end: '13:00', subject: 'Estructuras III', task: 'Repaso intensivo 2da fecha', hours: 5 }
        ],
        '2025-12-18': [
            { start: '08:00', end: '13:00', subject: 'Repaso', task: 'Repaso Estructuras', hours: 5 },
            { start: '14:00', end: '17:00', subject: 'ESTRUCTURAS PARCIAL', task: '📝 SEGUNDA FECHA', hours: 3 }
        ],
        '2026-01-15': [
            { start: '09:00', end: '12:00', subject: 'Mecánica Racional', task: 'Repaso suave para flotante', hours: 3 },
            { start: '14:00', end: '17:00', subject: 'Estructuras III', task: 'Repaso suave flotante', hours: 3 }
        ],
        '2026-01-20': [
            { start: '09:00', end: '12:00', subject: 'Termodinámica', task: 'Repaso integral', hours: 3 },
            { start: '14:00', end: '17:00', subject: 'Mecánica Racional', task: 'Práctica general', hours: 3 }
        ],
        '2026-02-05': [
            { start: '08:00', end: '12:00', subject: 'Mecánica Racional', task: 'Preparación flotante', hours: 4 },
            { start: '13:30', end: '17:00', subject: 'Estructuras III', task: 'Repaso pre-flotante', hours: 3.5 }
        ],
        '2026-02-10': [
            { start: '08:00', end: '12:00', subject: 'Estructuras III', task: 'Últimos ejercicios', hours: 4 },
            { start: '13:30', end: '17:00', subject: 'Mecánica Racional', task: 'Simulacro completo', hours: 3.5 }
        ],
        '2026-02-11': [
            { start: '08:00', end: '12:00', subject: 'Mecánica Racional', task: 'REPASO PRE-PARCIAL', hours: 4 },
            { start: '13:30', end: '17:00', subject: 'Estructuras III', task: 'REPASO PRE-PARCIAL', hours: 3.5 }
        ],
        '2026-02-12': [
            { start: '08:00', end: '09:30', subject: 'Repaso', task: 'Repaso ligero pre-parciales', hours: 1.5 },
            { start: '10:00', end: '13:00', subject: 'RACIONAL PARCIAL', task: '📝 FLOTANTE', hours: 3 },
            { start: '14:00', end: '17:00', subject: 'ESTRUCTURAS PARCIAL', task: '📝 FLOTANTE', hours: 3 }
        ],
        '2026-02-15': [
            { start: '08:00', end: '12:00', subject: 'Termodinámica', task: 'Preparación flotante', hours: 4 },
            { start: '13:30', end: '17:00', subject: 'Termodinámica', task: 'Ejercicios integradores', hours: 3.5 }
        ],
        '2026-02-17': [
            { start: '08:00', end: '12:00', subject: 'Termodinámica', task: 'REPASO PRE-PARCIAL', hours: 4 },
            { start: '13:30', end: '17:00', subject: 'Termodinámica', task: 'Últimos ejercicios', hours: 3.5 }
        ],
        '2026-02-18': [
            { start: '08:00', end: '11:00', subject: 'Repaso', task: 'Repaso ligero Termodinámica', hours: 3 },
            { start: '12:00', end: '15:00', subject: 'TERMO PARCIAL', task: '📝 FLOTANTE', hours: 3 }
        ],
        '2026-02-19': [
            { start: '08:00', end: '09:30', subject: 'Repaso', task: 'Repaso teórica Racional', hours: 1.5 },
            { start: '10:00', end: '13:00', subject: 'RACIONAL PARCIAL', task: '📝 INSTANCIA TEÓRICA', hours: 3 }
        ]
    }
});
