"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import {
  differenceInHours,
  parseISO
} from "date-fns";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { useAuth } from "@/lib/auth";
import { DashboardCard } from "@/components/DashboardCard";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { LogoutButton } from "@/components/LogoutButton";
import { useCalendarSetEvents } from "@/hooks/useCalendar";
import { CalendarEvent } from "@/types/calendar";
import { 
  FiBook, 
  FiCalendar, 
  FiCheckCircle, 
  FiClock, 
  FiDownload, 
  FiFileText,
  FiPlay,
  FiHeadphones,
  FiLink,
  FiUser,
  FiTrendingUp,
  FiX
} from "react-icons/fi";

type MaterialType = "pdf" | "video" | "audio" | "link";
type MaterialStatus = "concluido" | "nao_concluido";
type LessonStatus = "agendada" | "concluida" | "cancelada";

type StudentProfile = {
  id: number;
  name: string;
  email: string;
  role: "aluno";
  progress: number;
  lastLesson: string;
  nextLesson: string;
  professor: string;
  totalLessons: number;
  completedLessons: number;
};

type MaterialItem = {
  id: number;
  title: string;
  type: MaterialType;
  uploadedAt: string;
  status: MaterialStatus;
};

type LessonItem = {
  id: number;
  start: string;
  end: string;
  status: LessonStatus;
  professor: string;
  title: string;
};

type StudentStore = {
  profile: StudentProfile;
  materials: MaterialItem[];
  lessons: LessonItem[];
  loading: boolean;
  error: string | null;
  setMaterials: (materials: MaterialItem[]) => void;
  setLessons: (lessons: LessonItem[]) => void;
  load: () => Promise<void>;
};

const mockProfile: StudentProfile = {
  id: 4,
  name: "Ana Silva",
  email: "ana@example.com",
  role: "aluno",
  progress: 65,
  lastLesson: "2026-03-05",
  nextLesson: "2026-03-10",
  professor: "Prof. Jean",
  totalLessons: 24,
  completedLessons: 16
};

const mockMaterials: MaterialItem[] = [
  {
    id: 1,
    title: "Pronoms personnels - Guia Completo",
    type: "pdf",
    uploadedAt: "2026-03-01",
    status: "concluido"
  },
  {
    id: 2,
    title: "Verbos regulares - Presente",
    type: "video",
    uploadedAt: "2026-03-02",
    status: "nao_concluido"
  },
  {
    id: 3,
    title: "Unit 3 - Listening Practice",
    type: "audio",
    uploadedAt: "2026-03-04",
    status: "nao_concluido"
  },
  {
    id: 4,
    title: "Recursos adicionais - Gramática",
    type: "link",
    uploadedAt: "2026-03-05",
    status: "concluido"
  }
];

const mockLessons: LessonItem[] = [
  {
    id: 11,
    start: "2026-03-10T10:00:00",
    end: "2026-03-10T11:00:00",
    status: "agendada",
    professor: "Prof. Jean",
    title: "Aula de Conversação"
  },
  {
    id: 12,
    start: "2026-03-05T10:00:00",
    end: "2026-03-05T11:00:00",
    status: "concluida",
    professor: "Prof. Jean",
    title: "Gramática Avançada"
  },
  {
    id: 13,
    start: "2026-03-01T10:00:00",
    end: "2026-03-01T11:00:00",
    status: "cancelada",
    professor: "Prof. Jean",
    title: "Pronúncia"
  }
];

const useStudentStore = create<StudentStore>((set) => ({
  profile: mockProfile,
  materials: mockMaterials,
  lessons: mockLessons,
  loading: false,
  error: null,
  setMaterials: (materials: MaterialItem[]) => set({ materials }),
  setLessons: (lessons: LessonItem[]) => set({ lessons }),
  load: async () => {
    set({ loading: true, error: null });
    try {
      const profileRes = await fetch("/api/student/profile/", { cache: "no-store" });
      const repositoryRes = await fetch("/api/student/repository/", { cache: "no-store" });
      const lessonsRes = await fetch("/api/student/lessons/", { cache: "no-store" });
      if (profileRes.ok) {
        const data = (await profileRes.json()) as Partial<StudentProfile> & {
          last_lesson?: string | null;
          next_lesson?: string | null;
        };
        const lastLesson = data.lastLesson ?? data.last_lesson ?? null;
        const nextLesson = data.nextLesson ?? data.next_lesson ?? null;
        set({
          profile: {
            id: data.id ?? mockProfile.id,
            name: data.name ?? mockProfile.name,
            email: data.email ?? mockProfile.email,
            role: "aluno",
            progress: typeof data.progress === "number" ? data.progress : mockProfile.progress,
            lastLesson: lastLesson ? lastLesson.slice(0, 10) : mockProfile.lastLesson,
            nextLesson: nextLesson ? nextLesson.slice(0, 10) : mockProfile.nextLesson,
            professor: data.professor ?? mockProfile.professor,
            totalLessons: data.totalLessons ?? mockProfile.totalLessons,
            completedLessons: data.completedLessons ?? mockProfile.completedLessons
          }
        });
      }
      if (repositoryRes.ok) {
        const data = (await repositoryRes.json()) as unknown;
        if (Array.isArray(data)) {
          const normalized = data.map((item: unknown, index: number) => {
            const raw = item as Partial<MaterialItem>;
            return {
              id: raw.id ?? index + 1,
              title: raw.title ?? `Material ${index + 1}`,
              type: (raw.type as MaterialType) ?? "pdf",
              uploadedAt: raw.uploadedAt ?? "2026-03-01",
              status: (raw.status as MaterialStatus) ?? "nao_concluido"
            };
          });
          set({ materials: normalized });
        }
      }
      if (lessonsRes.ok) {
        const data = (await lessonsRes.json()) as unknown;
        if (Array.isArray(data)) {
          const normalized = data.map((item: unknown, index: number) => {
            const raw = item as Partial<LessonItem>;
            return {
              id: raw.id ?? index + 1,
              start: raw.start ?? "2026-03-10T10:00:00",
              end: raw.end ?? "2026-03-10T11:00:00",
              status: (raw.status as LessonStatus) ?? "agendada",
              professor: raw.professor ?? "Professor",
              title: raw.title ?? `Aula ${index + 1}`
            };
          });
          set({ lessons: normalized });
        }
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Erro ao carregar dados." });
    } finally {
      set({ loading: false });
    }
  }
}));

type FilterForm = {
  materialType: "all" | MaterialType;
};

const getMaterialIcon = (type: MaterialType) => {
  switch (type) {
    case "pdf":
      return <FiFileText className="w-5 h-5 text-blue-600" />;
    case "video":
      return <FiPlay className="w-5 h-5 text-red-600" />;
    case "audio":
      return <FiHeadphones className="w-5 h-5 text-green-600" />;
    case "link":
      return <FiLink className="w-5 h-5 text-purple-600" />;
    default:
      return <FiBook className="w-5 h-5 text-slate-600" />;
  }
};

const getStatusColor = (status: MaterialStatus) => {
  switch (status) {
    case "concluido":
      return "text-green-700 bg-green-100 border-green-200";
    case "nao_concluido":
      return "text-orange-700 bg-orange-100 border-orange-200";
    default:
      return "text-slate-700 bg-slate-100 border-slate-200";
  }
};

const getStatusLabel = (status: MaterialStatus) => {
  switch (status) {
    case "concluido":
      return "Concluído";
    case "nao_concluido":
      return "Pendente";
    default:
      return "Desconhecido";
  }
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { profile, materials, lessons, loading: dataLoading, error, setMaterials, setLessons, load } =
    useStudentStore();

  const filterForm = useForm<FilterForm>({ defaultValues: { materialType: "all" } });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    void load();
  }, [load]);

  const materialFilter = filterForm.watch("materialType");

  const filteredMaterials = useMemo(() => {
    if (materialFilter === "all") {
      return materials;
    }
    return materials.filter((item: MaterialItem) => item.type === materialFilter);
  }, [materials, materialFilter]);

  const setEvents = useCalendarSetEvents();

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
        title: `${lesson.title} • ${lesson.professor}`,
        start: parseISO(lesson.start),
        end: parseISO(lesson.end),
        status,
        color,
        textColor: "#ffffff"
      };
    });
  }, [lessons]);

  useEffect(() => {
    setEvents(lessonEvents);
  }, [lessonEvents, setEvents]);

  const upcomingLessons = lessons.filter(lesson => lesson.status === "agendada").slice(0, 3);
  const completedMaterialsCount = materials.filter(m => m.status === "concluido").length;

  if (loading || !user) {
    return <LoadingState />;
  }

  if (user.role !== "aluno") {
    return <ErrorMessage message="Acesso negado" />;
  }

  const onCompleteMaterial = async (materialId: number) => {
    try {
      const res = await fetch(`/api/materials/${materialId}/complete`, { method: "PUT" });
      if (!res.ok) {
        throw new Error("Falha ao marcar material.");
      }
      const updated = materials.map((item: MaterialItem) =>
        item.id === materialId ? { ...item, status: "concluido" } : item
      );
      setMaterials(updated as MaterialItem[]);
    } catch {
      setMaterials(materials);
    }
  };

  const onScheduleLesson = () => {
    const nextLesson: LessonItem = {
      id: Date.now(),
      start: "2026-03-15T10:00:00",
      end: "2026-03-15T11:00:00",
      status: "agendada",
      professor: profile.professor,
      title: "Nova Aula"
    };
    setLessons([nextLesson, ...lessons]);
  };

  const onCancelLesson = (lessonId: number) => {
    const updated = lessons.map((lesson: LessonItem) =>
      lesson.id === lessonId ? { ...lesson, status: "cancelada" } : lesson
    );
    setLessons(updated as LessonItem[]);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Bem-vindo(a), {profile.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Acompanhe seu progresso e próximas atividades
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LogoutButton redirectTo="/" fullWidth={false} />
            <div className="text-right">
              <p className="text-sm text-slate-600">Professor(a)</p>
              <p className="font-semibold text-slate-900">{profile.professor}</p>
            </div>
            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
              <FiUser className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <DashboardCard
          title="Progresso Geral"
          value={`${profile.progress}%`}
          subtitle="do curso completo"
          icon={<FiTrendingUp className="w-5 h-5 text-blue-600" />}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Total de Aulas"
          value={profile.totalLessons}
          subtitle={`${profile.completedLessons} completadas`}
          icon={<FiBook className="w-5 h-5 text-green-600" />}
        />
        <DashboardCard
          title="Materiais Completos"
          value={completedMaterialsCount}
          subtitle={`de ${materials.length} disponíveis`}
          icon={<FiCheckCircle className="w-5 h-5 text-purple-600" />}
        />
        <DashboardCard
          title="Próxima Aula"
          value={new Date(profile.nextLesson).toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'short' 
          })}
          subtitle={new Date(profile.nextLesson).toLocaleDateString('pt-BR', { 
            weekday: 'long' 
          })}
          icon={<FiCalendar className="w-5 h-5 text-orange-600" />}
        />
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Seu Progresso</h2>
          <span className="text-sm font-medium text-slate-600">{profile.progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${profile.progress}%` }}
          />
        </div>
        <p className="text-sm text-slate-600 mt-2">
          Você está a {100 - profile.progress}% de concluir seu curso!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materials Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Materiais Pedagógicos</h2>
            <select
              className="text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...filterForm.register("materialType")}
            >
              <option value="all">Todos</option>
              <option value="pdf">PDF</option>
              <option value="video">Vídeo</option>
              <option value="audio">Áudio</option>
              <option value="link">Link</option>
            </select>
          </div>

          <div className="space-y-3">
            {filteredMaterials.map((material) => (
              <div 
                key={material.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getMaterialIcon(material.type)}
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-slate-900 truncate">
                      {material.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {material.type.toUpperCase()} • {material.uploadedAt}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  <span className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                    ${getStatusColor(material.status)}
                  `}>
                    {getStatusLabel(material.status)}
                  </span>
                  
                  <button
                    onClick={() => onCompleteMaterial(material.id)}
                    disabled={material.status === "concluido"}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={material.status === "concluido" ? "Concluído" : "Marcar como concluído"}
                  >
                    <FiCheckCircle className="w-4 h-4" />
                  </button>
                  
                  <button
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <FiDownload className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Lessons Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Próximas Aulas</h2>
            <button
              onClick={onScheduleLesson}
              className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agendar Aula
            </button>
          </div>

          <div className="space-y-4">
            {upcomingLessons.map((lesson) => (
              <div 
                key={lesson.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FiCalendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-slate-900 truncate">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {new Date(lesson.start).toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })} • {lesson.professor}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-2">
                  <button
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Entrar na aula"
                  >
                    <FiPlay className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => onCancelLesson(lesson.id)}
                    className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancelar aula"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Calendário de Aulas</h2>
        <div className="h-96 rounded-lg border border-slate-200 overflow-hidden">
          <CalendarView
            className="w-full"
            height="100%"
            enableFilters={false}
            enableResources={false}
          />
        </div>
      </div>
    </div>
  );
}
