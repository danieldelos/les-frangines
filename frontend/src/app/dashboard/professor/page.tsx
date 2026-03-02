"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import { addHours, parseISO } from "date-fns";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { useCalendarSetEvents, useCalendarSetResources } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/types/calendar";


type ProgressStatus = "inicial" | "intermediario" | "avancado";
type MaterialType = "pdf" | "video" | "audio" | "link";
type LessonStatus = "agendada" | "concluida" | "cancelada";

type StudentCard = {
  id: number;
  name: string;
  avatarUrl: string;
  progressStatus: ProgressStatus;
  lastLesson: string;
  nextLesson: string;
};

type MaterialItem = {
  id: number;
  studentId: number;
  title: string;
  type: MaterialType;
  status: "pendente" | "concluido";
  updatedAt: string;
};

type LessonItem = {
  id: number;
  studentId: number;
  title: string;
  start: string;
  end: string;
  status: LessonStatus;
  blocked?: boolean;
};

type ProfessorStore = {
  students: StudentCard[];
  materials: MaterialItem[];
  lessons: LessonItem[];
  availability: LessonItem[];
  loading: boolean;
  error: string | null;
  setMaterials: (materials: MaterialItem[]) => void;
  setAvailability: (availability: LessonItem[]) => void;
  load: () => Promise<void>;
};

const mockStudents: StudentCard[] = [
  {
    id: 4,
    name: "Ana Silva",
    avatarUrl: "/images/placeholder.jpg",
    progressStatus: "intermediario",
    lastLesson: "2026-03-05",
    nextLesson: "2026-03-10"
  },
  {
    id: 5,
    name: "Lucas Martins",
    avatarUrl: "/images/placeholder.jpg",
    progressStatus: "inicial",
    lastLesson: "2026-03-01",
    nextLesson: "2026-03-09"
  }
];

const mockMaterials: MaterialItem[] = [
  {
    id: 1,
    studentId: 4,
    title: "Unit 3 - Listening",
    type: "audio",
    status: "pendente",
    updatedAt: "2026-03-03"
  },
  {
    id: 2,
    studentId: 4,
    title: "Pronoms personnels",
    type: "pdf",
    status: "concluido",
    updatedAt: "2026-03-01"
  },
  {
    id: 3,
    studentId: 5,
    title: "Verbos regulares",
    type: "video",
    status: "pendente",
    updatedAt: "2026-02-28"
  }
];

const mockLessons: LessonItem[] = [
  {
    id: 1,
    studentId: 4,
    title: "Aula com Ana",
    start: "2026-03-10T10:00:00",
    end: "2026-03-10T11:00:00",
    status: "agendada"
  },
  {
    id: 2,
    studentId: 5,
    title: "Aula com Lucas",
    start: "2026-03-11T15:00:00",
    end: "2026-03-11T16:00:00",
    status: "agendada"
  },
  {
    id: 3,
    studentId: 0,
    title: "Feriado",
    start: "2026-03-12T00:00:00",
    end: "2026-03-12T23:59:00",
    status: "cancelada",
    blocked: true
  }
];

const mockAvailability: LessonItem[] = [
  {
    id: 11,
    studentId: 0,
    title: "Disponível",
    start: "2026-03-08T09:00:00",
    end: "2026-03-08T12:00:00",
    status: "agendada"
  },
  {
    id: 12,
    studentId: 0,
    title: "Ausência",
    start: "2026-03-13T14:00:00",
    end: "2026-03-13T18:00:00",
    status: "cancelada",
    blocked: true
  }
];

const useProfessorStore = create<ProfessorStore>((set) => ({
  students: mockStudents,
  materials: mockMaterials,
  lessons: mockLessons,
  availability: mockAvailability,
  loading: false,
  error: null,
  setMaterials: (materials: MaterialItem[]) => set({ materials }),
  setAvailability: (availability: LessonItem[]) => set({ availability }),
  load: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/professor/students/", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Falha ao carregar alunos.");
      }
      const data = (await res.json()) as unknown;
      if (Array.isArray(data)) {
        const normalized = data.map((item: unknown, index: number) => {
          const raw = item as Partial<StudentCard> & {
            first_name?: string;
            last_name?: string;
            progress?: number;
            last_lesson?: string | null;
            next_lesson?: string | null;
          };
          const nameFromParts = `${raw.first_name ?? ""} ${raw.last_name ?? ""}`.trim();
          const name = raw.name ?? (nameFromParts || `Aluno ${index + 1}`);
          const progress = typeof raw.progress === "number" ? raw.progress : 0;
          const progressStatus: ProgressStatus =
            progress >= 70 ? "avancado" : progress >= 40 ? "intermediario" : "inicial";
          const lastLesson = raw.lastLesson ?? raw.last_lesson ?? null;
          const nextLesson = raw.nextLesson ?? raw.next_lesson ?? null;
          return {
            id: typeof raw.id === "number" ? raw.id : index + 1,
            name,
            avatarUrl: raw.avatarUrl ?? "/images/placeholder.jpg",
            progressStatus,
            lastLesson: lastLesson ? lastLesson.slice(0, 10) : "—",
            nextLesson: nextLesson ? nextLesson.slice(0, 10) : "—"
          };
        });
        set({ students: normalized });
      } else {
        set({ students: mockStudents });
      }
    } catch (err) {
      set({
        students: mockStudents,
        error: err instanceof Error ? err.message : "Erro ao carregar alunos."
      });
    } finally {
      set({ loading: false });
    }
  }
}));

type FilterForm = {
  progress: "all" | ProgressStatus;
  materialType: "all" | MaterialType;
};

type MaterialForm = {
  studentId: string;
  title: string;
  type: MaterialType;
};

type AvailabilityForm = {
  date: string;
  start: string;
  duration: number;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [materialOpen, setMaterialOpen] = useState(false);
  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const {
    students,
    materials,
    lessons,
    availability,
    loading: dataLoading,
    error,
    setMaterials,
    setAvailability,
    load
  } = useProfessorStore();

  const filterForm = useForm<FilterForm>({
    defaultValues: { progress: "all", materialType: "all" }
  });

  const materialForm = useForm<MaterialForm>({
    defaultValues: { studentId: "", title: "", type: "pdf" }
  });

  const availabilityForm = useForm<AvailabilityForm>({
    defaultValues: { date: "2026-03-08", start: "09:00", duration: 2 }
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const progressFilter = filterForm.watch("progress");
  const materialFilter = filterForm.watch("materialType");

  const filteredStudents = useMemo(() => {
    return students.filter((student: StudentCard) => {
      if (progressFilter === "all") {
        return true;
      }
      return student.progressStatus === progressFilter;
    });
  }, [students, progressFilter]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material: MaterialItem) => {
      if (materialFilter === "all") {
        return true;
      }
      return material.type === materialFilter;
    });
  }, [materials, materialFilter]);

  const lessonEvents: CalendarEvent[] = useMemo(() => {
    return lessons.map((lesson) => {
      const status =
        lesson.status === "cancelada"
          ? "cancelled"
          : lesson.status === "agendada"
            ? "tentative"
            : "confirmed";
      const color =
        lesson.status === "concluida"
          ? "#16a34a"
          : lesson.status === "cancelada"
            ? "#f97316"
            : "#0b0b0b";
      return {
        id: `lesson-${lesson.id}`,
        title: lesson.title,
        start: parseISO(lesson.start),
        end: parseISO(lesson.end),
        status,
        color,
        textColor: "#ffffff",
        resourceId: String(lesson.studentId)
      };
    });
  }, [lessons]);

  const setEvents = useCalendarSetEvents();
  const setResources = useCalendarSetResources();

  const availabilityEvents: CalendarEvent[] = useMemo(() => {
    return availability.map((slot) => ({
      id: `availability-${slot.id}`,
      title: slot.title,
      start: parseISO(slot.start),
      end: parseISO(slot.end),
      status: "confirmed",
      color: slot.blocked ? "#e2e8f0" : "#0b0b0b",
      textColor: slot.blocked ? "#64748b" : "#ffffff",
      tags: ["availability"]
    }));
  }, [availability]);

  const calendarResources = useMemo(() => {
    return students.map((student) => ({
      id: String(student.id),
      name: student.name,
      color: "#0b0b0b",
      textColor: "#ffffff",
      type: "person" as const
    }));
  }, [students]);

  useEffect(() => {
    setEvents([...lessonEvents, ...availabilityEvents]);
    setResources(calendarResources);
  }, [availabilityEvents, calendarResources, lessonEvents, setEvents, setResources]);

  if (loading || !user) {
    return <LoadingState />;
  }

  if (user.role !== "professor") {
    return <ErrorMessage message="Acesso negado" />;
  }

  const onMaterialSubmit = materialForm.handleSubmit((values: MaterialForm) => {
    const studentId = Number(values.studentId);
    if (!studentId) {
      return;
    }
    const nextMaterial: MaterialItem = {
      id: Date.now(),
      studentId,
      title: values.title,
      type: values.type,
      status: "pendente",
      updatedAt: new Date().toISOString().slice(0, 10)
    };
    setMaterials([nextMaterial, ...materials]);
    materialForm.reset({ studentId: "", title: "", type: "pdf" });
    setMaterialOpen(false);
  });

  const onAvailabilitySubmit = availabilityForm.handleSubmit((values: AvailabilityForm) => {
    const startDate = parseISO(`${values.date}T${values.start}:00`);
    const endDate = addHours(startDate, Number(values.duration) || 1);
    const nextAvailability: LessonItem = {
      id: Date.now(),
      studentId: 0,
      title: "Disponível",
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      status: "agendada"
    };
    setAvailability([nextAvailability, ...availability]);
    availabilityForm.reset({ date: values.date, start: values.start, duration: values.duration });
    setAvailabilityOpen(false);
  });

  const onRepositoryRedirect = (studentId: number) => {
    router.push(`/repository/${studentId}`);
  };

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-80px)] flex-col gap-6 lg:flex-row lg:items-stretch">
        <Sidebar />
        <div className="flex-1 space-y-6">
        <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Dashboard do professor
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Gestão de alunos, repositório e agenda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAvailabilityOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
            >
              Adicionar Disponibilidade
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="text-xs font-semibold tracking-wide text-slate-500">
                Aulas agendadas
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {lessons.filter((lesson: LessonItem) => lesson.status === "agendada").length}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="text-xs font-semibold tracking-wide text-slate-500">
                Aulas concluídas
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {lessons.filter((lesson: LessonItem) => lesson.status === "concluida").length}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-white p-4">
              <div className="text-xs font-semibold tracking-wide text-slate-500">
                Aulas canceladas
              </div>
              <div className="mt-2 text-lg font-semibold text-slate-900">
                {lessons.filter((lesson: LessonItem) => lesson.status === "cancelada").length}
              </div>
            </div>
          </div>
        </section>

        {dataLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Alunos atribuídos
                  </h2>
                  <p className="text-sm text-slate-600">
                    Evolução individual e acesso ao repositório.
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Progresso
                    </label>
                    <select
                      className="h-9 rounded-xl border border-border bg-white px-3 text-sm"
                      {...filterForm.register("progress")}
                    >
                      <option value="all">Todos</option>
                      <option value="inicial">Inicial</option>
                      <option value="intermediario">Intermediário</option>
                      <option value="avancado">Avançado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {filteredStudents.map((student: StudentCard) => (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-white p-4"
                  >
                    <Image
                      src={student.avatarUrl}
                      alt={student.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">
                        {student.name}
                      </div>
                      <div className="text-xs text-slate-600">
                        Progresso: {student.progressStatus}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Última aula: {student.lastLesson} • Próxima aula:{" "}
                        {student.nextLesson}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRepositoryRedirect(student.id)}
                      className="inline-flex h-9 items-center justify-center rounded-xl border border-border px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Ver Repositório
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Repositório por aluno
                  </h2>
                  <p className="text-sm text-slate-600">
                    Materiais atribuídos e status de acompanhamento.
                  </p>
                </div>
                <div className="flex items-end gap-2">
                  <div className="grid gap-1">
                    <label className="text-xs font-semibold text-slate-600">
                      Tipo de material
                    </label>
                    <select
                      className="h-9 rounded-xl border border-border bg-white px-3 text-sm"
                      {...filterForm.register("materialType")}
                    >
                      <option value="all">Todos</option>
                      <option value="pdf">PDF</option>
                      <option value="video">Vídeo</option>
                      <option value="audio">Áudio</option>
                      <option value="link">Link</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaterialOpen(true)}
                    className="inline-flex h-9 items-center justify-center rounded-xl bg-belgium-black px-4 text-xs font-semibold text-white hover:bg-belgium-black/90"
                  >
                    Adicionar Material
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {filteredMaterials.map((material: MaterialItem) => {
                  const student = students.find((item: StudentCard) => item.id === material.studentId);
                  return (
                    <div
                      key={material.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {material.title}
                        </div>
                        <div className="text-xs text-slate-600">
                          {student?.name ?? "Aluno"} • {material.type.toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-500">
                          Atualizado em {material.updatedAt}
                        </div>
                      </div>
                      <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-slate-700">
                        {material.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Calendário de disponibilidade
                  </h2>
                  <p className="text-sm text-slate-600">
                    Slots disponíveis e bloqueios.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAvailabilityOpen(true)}
                  className="inline-flex h-9 items-center justify-center rounded-xl border border-border px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Adicionar Disponibilidade
                </button>
              </div>
              <div className="mt-4 h-[420px] sm:h-[480px] lg:h-[560px] xl:h-[640px] rounded-2xl border border-border bg-white p-3 sm:p-4 overflow-hidden">
            <CalendarView
              className="w-full h-full"
              height="100%"
              enableFilters={false}
              enableResources={false}
            />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Agendamento</h2>
                <p className="text-sm text-slate-600">
                  Visualize slots e aulas marcadas.
                </p>
              </div>
              <div className="mt-4 h-[420px] sm:h-[480px] lg:h-[560px] xl:h-[640px] rounded-2xl border border-border bg-white p-3 sm:p-4 overflow-hidden">
            <CalendarView
              className="w-full h-full"
              height="100%"
              enableFilters={true}
              enableResources={true}
            />
              </div>
            </section>
          </>
        )}
        </div>
      </div>

      {materialOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Adicionar Material</h3>
              <button
                type="button"
                onClick={() => setMaterialOpen(false)}
                className="text-sm text-slate-600"
              >
                Fechar
              </button>
            </div>
            <form onSubmit={onMaterialSubmit} className="mt-4 grid gap-4">
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Aluno</label>
                <select
                  className="h-10 rounded-xl border border-border bg-white px-3 text-sm"
                  {...materialForm.register("studentId")}
                >
                  <option value="">Selecione</option>
                  {students.map((student: StudentCard) => (
                    <option key={student.id} value={String(student.id)}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Título</label>
                <input
                  className="h-10 rounded-xl border border-border bg-white px-3 text-sm"
                  {...materialForm.register("title")}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Tipo</label>
                <select
                  className="h-10 rounded-xl border border-border bg-white px-3 text-sm"
                  {...materialForm.register("type")}
                >
                  <option value="pdf">PDF</option>
                  <option value="video">Vídeo</option>
                  <option value="audio">Áudio</option>
                  <option value="link">Link</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMaterialOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {availabilityOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">
                Adicionar Disponibilidade
              </h3>
              <button
                type="button"
                onClick={() => setAvailabilityOpen(false)}
                className="text-sm text-slate-600"
              >
                Fechar
              </button>
            </div>
            <form onSubmit={onAvailabilitySubmit} className="mt-4 grid gap-4">
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Data</label>
                <input
                  type="date"
                  className="h-10 rounded-xl border border-border bg-white px-3 text-sm"
                  {...availabilityForm.register("date")}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Início</label>
                <input
                  type="time"
                  className="h-10 rounded-xl border border-border bg-white px-3 text-sm"
                  {...availabilityForm.register("start")}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">
                  Duração (h)
                </label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="h-10 rounded-xl border border-border bg-white px-3 text-sm"
                  {...availabilityForm.register("duration", { valueAsNumber: true })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAvailabilityOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
