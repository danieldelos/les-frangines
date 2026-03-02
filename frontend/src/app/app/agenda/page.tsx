"use client";

import { useEffect, useMemo } from "react";
import { addMinutes } from "date-fns";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { useCalendarSetEvents } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/types/calendar";

interface Lesson {
  id: string;
  title: string;
  student: string;
  teacher: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: "scheduled" | "completed" | "cancelled";
  description?: string;
}

const mockLessons: Lesson[] = [
  {
    id: "1",
    title: "Aula de Conversação em Francês",
    student: "João Silva",
    teacher: "Marie Dubois",
    date: "2024-03-15",
    time: "14:00",
    duration: "1h30min",
    location: "Online - Zoom",
    status: "scheduled",
    description: "Foco em conversação sobre temas do dia a dia e prática de pronúncia."
  },
  {
    id: "2",
    title: "Gramática Francesa Avançada",
    student: "Ana Santos",
    teacher: "Pierre Martin",
    date: "2024-03-16",
    time: "10:00",
    duration: "2h",
    location: "Presencial - Sala 201",
    status: "scheduled",
    description: "Estudo dos tempos verbais complexos e subjuntivo."
  },
  {
    id: "3",
    title: "Preparação para DELF B2",
    student: "Carlos Oliveira",
    teacher: "Marie Dubois",
    date: "2024-03-14",
    time: "16:00",
    duration: "1h30min",
    location: "Online - Teams",
    status: "completed",
    description: "Simulado de leitura e escrita para o exame DELF B2."
  },
  {
    id: "4",
    title: "Francês para Negócios",
    student: "Pedro Costa",
    teacher: "Pierre Martin",
    date: "2024-03-17",
    time: "09:00",
    duration: "1h",
    location: "Presencial - Sala 105",
    status: "cancelled",
    description: "Vocabulário empresarial e redação de e-mails profissionais."
  }
];

export default function AgendaPage() {
  const setEvents = useCalendarSetEvents();

  const events: CalendarEvent[] = useMemo(() => {
    return mockLessons.map((lesson) => {
      const start = new Date(`${lesson.date}T${lesson.time}:00`);
      const hoursMatch = lesson.duration.match(/(\d+)h/);
      const minutesMatch = lesson.duration.match(/(\d+)\s*min/);
      const hours = hoursMatch ? Number(hoursMatch[1]) : 1;
      const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
      const end = addMinutes(start, hours * 60 + minutes);
      const status =
        lesson.status === "cancelled"
          ? "cancelled"
          : lesson.status === "scheduled"
            ? "tentative"
            : "confirmed";
      const color =
        lesson.status === "completed"
          ? "#16a34a"
          : lesson.status === "cancelled"
            ? "#f97316"
            : "#0b0b0b";
      return {
        id: lesson.id,
        title: `${lesson.title} • ${lesson.student}`,
        description: lesson.description,
        start,
        end,
        status,
        color,
        textColor: "#ffffff",
        location: lesson.location
      };
    });
  }, []);

  useEffect(() => {
    setEvents(events);
  }, [events, setEvents]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Agenda</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Gerencie suas aulas, visualize horários e acompanhe o progresso dos alunos.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <div className="h-[700px] rounded-lg border border-slate-200 overflow-hidden">
          <CalendarView
            className="w-full"
            height="100%"
            enableFilters={true}
            enableResources={false}
          />
        </div>
      </div>
    </div>
  );
}
