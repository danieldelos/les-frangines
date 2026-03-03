"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  FiActivity,
  FiAlertTriangle,
  FiBook,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiTrendingDown,
  FiTrendingUp,
  FiUsers,
  FiX
} from "react-icons/fi";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth";


type Tab = "overview" | "students" | "professors" | "turmas";
type Role = "admin" | "professor" | "aluno";
type UserStatus = "ativo" | "inativo";

type UserRow = {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  status: UserStatus;
  created_at: string;
  professor_id?: number | null;
  turma_id?: number | null;
};

type TurmaRow = {
  id: number;
  name: string;
  description: string;
  professor: number | null;
  professor_name: string;
  student_count: number;
  created_at: string;
};

type RevenuePoint = { month: string; total: number };

const revenueData: RevenuePoint[] = [
  { month: "Nov", total: 32000 },
  { month: "Dez", total: 41000 },
  { month: "Jan", total: 38000 },
  { month: "Fev", total: 46000 }
];

const financeModules = [
  {
    title: "Contas a pagar",
    description: "Controle de boletos, fornecedores e recorrências.",
    value: "R$ 18.400",
    href: "/dashboard/admin/finance/contas-pagar",
    icon: FiTrendingDown,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600"
  },
  {
    title: "Contas a receber",
    description: "Cobranças em aberto e recebimentos agendados.",
    value: "R$ 31.250",
    href: "/dashboard/admin/finance/contas-receber",
    icon: FiTrendingUp,
    iconBg: "bg-green-50",
    iconColor: "text-green-600"
  },
  {
    title: "Fluxo de caixa",
    description: "Entradas x saídas com saldo projetado.",
    value: "R$ 12.850",
    href: "/dashboard/admin/finance/fluxo-caixa",
    icon: FiActivity,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600"
  }
];

type UserFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  professor_id: string;
  turma_id: string;
};

type TurmaFormData = {
  name: string;
  description: string;
  professor_id: string;
};

function roleBadge(role: Role) {
  const map: Record<Role, string> = {
    admin: "bg-slate-100 text-slate-700 border-slate-200",
    professor: "bg-blue-50 text-blue-700 border-blue-200",
    aluno: "bg-amber-50 text-amber-700 border-amber-200"
  };
  const labels: Record<Role, string> = { admin: "Admin", professor: "Professor", aluno: "Aluno" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${map[role]}`}>
      {labels[role]}
    </span>
  );
}

function statusBadge(status: UserStatus) {
  return status === "ativo" ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-green-700">
      Ativo
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
      Inativo
    </span>
  );
}

type ModalState =
  | { type: "none" }
  | { type: "createUser"; role: "aluno" | "professor" }
  | { type: "editUser"; user: UserRow }
  | { type: "deleteUser"; user: UserRow }
  | { type: "createTurma" }
  | { type: "editTurma"; turma: TurmaRow }
  | { type: "deleteTurma"; turma: TurmaRow };

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam && ["overview", "students", "professors", "turmas"].includes(tabParam)
      ? tabParam
      : "overview"
  );

  useEffect(() => {
    if (tabParam && ["overview", "students", "professors", "turmas"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [turmas, setTurmas] = useState<TurmaRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [searchStudents, setSearchStudents] = useState("");
  const [searchProfessors, setSearchProfessors] = useState("");
  const [searchTurmas, setSearchTurmas] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 10;
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const userForm = useForm<UserFormData>({
    defaultValues: { first_name: "", last_name: "", email: "", password: "", role: "aluno", status: "ativo", professor_id: "", turma_id: "" }
  });
  const turmaForm = useForm<TurmaFormData>({
    defaultValues: { name: "", description: "", professor_id: "" }
  });

  const loadUsers = useCallback(async (pg = 1) => {
    setDataLoading(true);
    setDataError(null);
    try {
      const q = new URLSearchParams({ page: String(pg), page_size: String(perPage) });
      const res = await fetch(`/api/users/?${q}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao carregar usuários.");
      const data = (await res.json()) as { count?: number; results?: unknown[] };
      const raw = Array.isArray(data.results) ? data.results : [];
      const normalized: UserRow[] = raw.map((item: unknown, i) => {
        const r = item as Record<string, unknown>;
        const fn = (r.first_name as string) ?? "";
        const ln = (r.last_name as string) ?? "";
        return {
          id: (r.id as number) ?? i,
          name: (r.name as string) ?? (`${fn} ${ln}`.trim() || `Usuário ${i + 1}`),
          first_name: fn,
          last_name: ln,
          email: (r.email as string) ?? "",
          role: (r.role as Role) ?? "aluno",
          status: (r.status as UserStatus) ?? "ativo",
          created_at: (r.created_at as string) ?? "",
          professor_id: (r.professor_id as number | null) ?? null,
          turma_id: (r.turma_id as number | null) ?? null
        };
      });
      setUsers(normalized);
      setTotal(typeof data.count === "number" ? data.count : normalized.length);
    } catch (err) {
      setDataError(err instanceof Error ? err.message : "Erro ao carregar usuários.");
    } finally {
      setDataLoading(false);
    }
  }, []);

  const loadTurmas = useCallback(async () => {
    try {
      const res = await fetch("/api/turmas/", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as unknown[];
      if (Array.isArray(data)) {
        setTurmas(data.map((item: unknown) => {
          const r = item as Record<string, unknown>;
          return {
            id: r.id as number,
            name: (r.name as string) ?? "",
            description: (r.description as string) ?? "",
            professor: (r.professor as number | null) ?? null,
            professor_name: (r.professor_name as string) ?? "",
            student_count: (r.student_count as number) ?? 0,
            created_at: (r.created_at as string) ?? ""
          };
        }));
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    void loadUsers(1);
    void loadTurmas();
  }, [loadUsers, loadTurmas]);

  useEffect(() => {
    void loadUsers(page);
  }, [page, loadUsers]);

  const professors = users.filter((u) => u.role === "professor");
  const students = users.filter((u) => u.role === "aluno");

  const filteredStudents = students.filter((u) =>
    !searchStudents || u.name.toLowerCase().includes(searchStudents.toLowerCase()) || u.email.toLowerCase().includes(searchStudents.toLowerCase())
  );
  const filteredProfessors = professors.filter((u) =>
    !searchProfessors || u.name.toLowerCase().includes(searchProfessors.toLowerCase()) || u.email.toLowerCase().includes(searchProfessors.toLowerCase())
  );
  const filteredTurmas = turmas.filter((t) =>
    !searchTurmas || t.name.toLowerCase().includes(searchTurmas.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const openCreate = (role: "aluno" | "professor") => {
    userForm.reset({ first_name: "", last_name: "", email: "", password: "", role, status: "ativo", professor_id: "", turma_id: "" });
    setModalError(null);
    setModal({ type: "createUser", role });
  };

  const openEdit = (u: UserRow) => {
    userForm.reset({
      first_name: u.first_name,
      last_name: u.last_name,
      email: u.email,
      password: "",
      role: u.role,
      status: u.status,
      professor_id: u.professor_id ? String(u.professor_id) : "",
      turma_id: u.turma_id ? String(u.turma_id) : ""
    });
    setModalError(null);
    setModal({ type: "editUser", user: u });
  };

  const openCreateTurma = () => {
    turmaForm.reset({ name: "", description: "", professor_id: "" });
    setModalError(null);
    setModal({ type: "createTurma" });
  };

  const openEditTurma = (t: TurmaRow) => {
    turmaForm.reset({ name: t.name, description: t.description, professor_id: t.professor ? String(t.professor) : "" });
    setModalError(null);
    setModal({ type: "editTurma", turma: t });
  };

  const closeModal = () => { setModal({ type: "none" }); setModalError(null); };

  const handleUserSubmit = userForm.handleSubmit(async (values) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const isEdit = modal.type === "editUser";
      const body: Record<string, unknown> = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        role: values.role
      };
      if (!isEdit) body.password = values.password;
      if (isEdit) body.status = values.status;
      if (values.role === "aluno") {
        body.professor_id = values.professor_id ? Number(values.professor_id) : null;
        body.turma_id = values.turma_id ? Number(values.turma_id) : null;
      }
      const url = isEdit && modal.type === "editUser" ? `/api/users/${modal.user.id}` : "/api/users/";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) throw new Error((data.detail as string) ?? "Erro ao salvar usuário.");
      await loadUsers(page);
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setModalLoading(false);
    }
  });

  const handleDeleteUser = async () => {
    if (modal.type !== "deleteUser") return;
    setModalLoading(true);
    try {
      await fetch(`/api/users/${modal.user.id}`, { method: "DELETE" });
      await loadUsers(page);
      closeModal();
    } catch { setModalError("Erro ao excluir."); }
    finally { setModalLoading(false); }
  };

  const handleTurmaSubmit = turmaForm.handleSubmit(async (values) => {
    setModalLoading(true);
    setModalError(null);
    try {
      const body: Record<string, unknown> = {
        name: values.name,
        description: values.description,
        professor: values.professor_id ? Number(values.professor_id) : null
      };
      const isEdit = modal.type === "editTurma";
      const url = isEdit && modal.type === "editTurma" ? `/api/turmas/${modal.turma.id}` : "/api/turmas/";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) throw new Error((data.detail as string) ?? "Erro ao salvar turma.");
      await loadTurmas();
      closeModal();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally { setModalLoading(false); }
  });

  const handleDeleteTurma = async () => {
    if (modal.type !== "deleteTurma") return;
    setModalLoading(true);
    try {
      await fetch(`/api/turmas/${modal.turma.id}`, { method: "DELETE" });
      await loadTurmas();
      closeModal();
    } catch { setModalError("Erro ao excluir."); }
    finally { setModalLoading(false); }
  };

  if (loading || !user) return <LoadingState />;
  if (user.role !== "admin") return <ErrorMessage message="Acesso negado" />;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Visão Geral", icon: <FiActivity className="h-4 w-4" /> },
    { id: "students", label: `Alunos (${students.length})`, icon: <FiBook className="h-4 w-4" /> },
    { id: "professors", label: `Professores (${professors.length})`, icon: <FiUsers className="h-4 w-4" /> },
    { id: "turmas", label: `Turmas (${turmas.length})`, icon: <FiBook className="h-4 w-4" /> }
  ];

  const inputCls = "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-colors";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1";
  const btnPrimary = "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90 transition-colors disabled:opacity-60";
  const btnSecondary = "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors";
  const btnDanger = "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-60";

  return (
    <div className="px-4 pt-6 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-80px)] flex-col gap-6 lg:flex-row lg:items-stretch">
        <Sidebar />
        <div className="flex-1 min-w-0 space-y-4">

          {/* Page header */}
          <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Painel Administrativo
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Gerencie alunos, professores, turmas e financeiro.
                </p>
              </div>
              <Link
                href="/dashboard/admin/finance"
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <FiDollarSign className="h-4 w-4" />
                Financeiro
              </Link>
            </div>

            {/* Tab navigation */}
            <div className="mt-5 flex gap-1 flex-wrap">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-belgium-black text-white shadow-sm"
                      : "bg-white border border-border text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Alunos ativos", value: students.filter(s => s.status === "ativo").length, icon: FiBook, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
                  { label: "Professores", value: professors.length, icon: FiUsers, iconBg: "bg-blue-50", iconColor: "text-blue-600" },
                  { label: "Turmas criadas", value: turmas.length, icon: FiActivity, iconBg: "bg-brand-primary/10", iconColor: "text-brand-primary" }
                ].map((m) => (
                  <div key={m.label} className="rounded-2xl border border-border bg-white/70 p-5 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold tracking-wide text-slate-500">{m.label}</span>
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${m.iconBg}`}>
                        <m.icon className={`h-4 w-4 ${m.iconColor}`} />
                      </div>
                    </div>
                    <div className="mt-3 text-2xl font-bold text-slate-900">{m.value}</div>
                  </div>
                ))}
              </div>

              <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Módulos financeiros</h2>
                    <p className="text-sm text-slate-600">Acompanhe contas a pagar, receber e projeções.</p>
                  </div>
                  <Link href="/dashboard/admin/finance" className="text-sm font-semibold text-slate-900 underline decoration-border underline-offset-4">
                    Ver painel completo
                  </Link>
                </div>
                <div className="mt-5 grid gap-4 lg:grid-cols-3">
                  {financeModules.map((module) => (
                    <Link key={module.title} href={module.href}
                      className="group rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${module.iconBg}`}>
                          <module.icon className={`h-5 w-5 ${module.iconColor}`} />
                        </div>
                        <span className="text-sm font-semibold text-slate-800">{module.title}</span>
                      </div>
                      <div className="mt-3 text-xl font-bold text-slate-900">{module.value}</div>
                      <p className="mt-1 text-xs text-slate-500">{module.description}</p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Receita mensal</h2>
                    <p className="text-sm text-slate-600">Resumo financeiro por mês.</p>
                  </div>
                  <Link href="/dashboard/admin/finance" className="text-sm font-semibold text-slate-900 underline decoration-border underline-offset-4">
                    Ver detalhes
                  </Link>
                </div>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => [`R$ ${Number(v).toLocaleString("pt-BR")}`, "Receita"]} />
                      <Bar dataKey="total" fill="#0b1f3b" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </>
          )}

          {/* STUDENTS TAB */}
          {activeTab === "students" && (
            <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Alunos</h2>
                  <p className="text-sm text-slate-600">Cadastre e gerencie os alunos do sistema.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      placeholder="Buscar aluno…"
                      value={searchStudents}
                      onChange={(e) => setSearchStudents(e.target.value)}
                      className="h-9 w-52 rounded-xl border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                  <button type="button" onClick={() => openCreate("aluno")} className={btnPrimary}>
                    <FiPlus className="h-4 w-4" /> Criar Aluno
                  </button>
                </div>
              </div>

              {dataLoading ? <div className="mt-6"><LoadingState /></div> : dataError ? <div className="mt-6"><ErrorMessage message={dataError} /></div> : (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Nome</th>
                        <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                        <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Professor</th>
                        <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Turma</th>
                        <th className="pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredStudents.length === 0 ? (
                        <tr><td colSpan={6} className="py-8 text-center text-sm text-slate-500">Nenhum aluno encontrado.</td></tr>
                      ) : filteredStudents.map((u) => {
                        const prof = professors.find((p) => p.id === u.professor_id);
                        const turma = turmas.find((t) => t.id === u.turma_id);
                        return (
                          <tr key={u.id} className="group hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 font-medium text-slate-900">{u.name}</td>
                            <td className="py-3 text-slate-500">{u.email}</td>
                            <td className="py-3 text-slate-500">{prof?.name ?? <span className="text-slate-400 italic">Sem professor</span>}</td>
                            <td className="py-3 text-slate-500">{turma?.name ?? <span className="text-slate-400 italic">Sem turma</span>}</td>
                            <td className="py-3">{statusBadge(u.status)}</td>
                            <td className="py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button onClick={() => openEdit(u)} className="rounded-lg border border-border p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 transition-colors" title="Editar">
                                  <FiEdit2 className="h-3.5 w-3.5" />
                                </button>
                                <button onClick={() => { setModalError(null); setModal({ type: "deleteUser", user: u }); }} className="rounded-lg border border-border p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors" title="Excluir">
                                  <FiTrash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                    <span>{total} aluno{total !== 1 ? "s" : ""} no total</span>
                    <div className="flex gap-1">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-slate-50">
                        <FiChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="flex h-8 items-center px-3 text-xs">{page}/{totalPages}</span>
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-border disabled:opacity-40 hover:bg-slate-50">
                        <FiChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* PROFESSORS TAB */}
          {activeTab === "professors" && (
            <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Professores</h2>
                  <p className="text-sm text-slate-600">Cadastre e gerencie os professores.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      placeholder="Buscar professor…"
                      value={searchProfessors}
                      onChange={(e) => setSearchProfessors(e.target.value)}
                      className="h-9 w-52 rounded-xl border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                  <button type="button" onClick={() => openCreate("professor")} className={btnPrimary}>
                    <FiPlus className="h-4 w-4" /> Criar Professor
                  </button>
                </div>
              </div>

              {dataLoading ? <div className="mt-6"><LoadingState /></div> : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProfessors.length === 0 ? (
                    <div className="col-span-3 py-8 text-center text-sm text-slate-500">Nenhum professor encontrado.</div>
                  ) : filteredProfessors.map((u) => {
                    const studentCount = students.filter((s) => s.professor_id === u.id).length;
                    return (
                      <div key={u.id} className="rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                            <FiUsers className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => openEdit(u)} className="rounded-lg border border-border p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 transition-colors" title="Editar">
                              <FiEdit2 className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => { setModalError(null); setModal({ type: "deleteUser", user: u }); }} className="rounded-lg border border-border p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors" title="Excluir">
                              <FiTrash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="font-semibold text-slate-900">{u.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{u.email}</div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          {statusBadge(u.status)}
                          <span className="text-xs text-slate-500">{studentCount} aluno{studentCount !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* TURMAS TAB */}
          {activeTab === "turmas" && (
            <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Turmas</h2>
                  <p className="text-sm text-slate-600">Organize alunos em grupos e atribua professores.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="search"
                      placeholder="Buscar turma…"
                      value={searchTurmas}
                      onChange={(e) => setSearchTurmas(e.target.value)}
                      className="h-9 w-52 rounded-xl border border-border bg-white pl-9 pr-3 text-sm outline-none focus:border-slate-400"
                    />
                  </div>
                  <button type="button" onClick={openCreateTurma} className={btnPrimary}>
                    <FiPlus className="h-4 w-4" /> Criar Turma
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTurmas.length === 0 ? (
                  <div className="col-span-3 py-8 text-center text-sm text-slate-500">
                    Nenhuma turma encontrada.{" "}
                    <button onClick={openCreateTurma} className="font-semibold text-slate-900 underline underline-offset-2">Criar primeira turma</button>
                  </div>
                ) : filteredTurmas.map((t) => (
                  <div key={t.id} className="rounded-2xl border border-border bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-amber-50">
                        <FiBook className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditTurma(t)} className="rounded-lg border border-border p-1.5 text-slate-500 hover:bg-white hover:text-slate-900 transition-colors" title="Editar">
                          <FiEdit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => { setModalError(null); setModal({ type: "deleteTurma", turma: t }); }} className="rounded-lg border border-border p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors" title="Excluir">
                          <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      {t.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{t.description}</p>}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{t.professor_name || <span className="italic">Sem professor</span>}</span>
                      <span>{t.student_count} aluno{t.student_count !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* USER FORM MODAL */}
      {(modal.type === "createUser" || modal.type === "editUser") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-900">
                {modal.type === "createUser" ? `Criar ${modal.role === "aluno" ? "Aluno" : "Professor"}` : "Editar Usuário"}
              </h3>
              <button type="button" onClick={closeModal} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nome</label>
                  <input className={inputCls} placeholder="Jean" {...userForm.register("first_name")} />
                </div>
                <div>
                  <label className={labelCls}>Sobrenome</label>
                  <input className={inputCls} placeholder="Dupont" {...userForm.register("last_name")} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} placeholder="jean@lesfrangines.fr" {...userForm.register("email")} required />
              </div>
              {modal.type === "createUser" && (
                <div>
                  <label className={labelCls}>Senha</label>
                  <input type="password" className={inputCls} placeholder="Mínimo 8 caracteres" {...userForm.register("password")} required minLength={8} />
                </div>
              )}
              {modal.type === "editUser" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Role</label>
                    <select className={inputCls} {...userForm.register("role")}>
                      <option value="aluno">Aluno</option>
                      <option value="professor">Professor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Status</label>
                    <select className={inputCls} {...userForm.register("status")}>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>
              )}
              {(modal.type === "createUser" ? modal.role === "aluno" : userForm.watch("role") === "aluno") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Professor</label>
                    <select className={inputCls} {...userForm.register("professor_id")}>
                      <option value="">Nenhum</option>
                      {professors.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Turma</label>
                    <select className={inputCls} {...userForm.register("turma_id")}>
                      <option value="">Nenhuma</option>
                      {turmas.map((t) => <option key={t.id} value={String(t.id)}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
              )}
              {modal.type === "editUser" && modal.user.role === "professor" && (
                <div>
                  <label className={labelCls}>Alunos atribuídos ({students.filter(s => s.professor_id === modal.user.id).length})</label>
                  <div className="max-h-32 overflow-y-auto rounded-xl border border-border bg-slate-50 p-3">
                    {students.filter(s => s.professor_id === modal.user.id).length === 0 ? (
                      <p className="text-sm text-slate-500 italic">Nenhum aluno atribuído a este professor.</p>
                    ) : (
                      <div className="space-y-1">
                        {students.filter(s => s.professor_id === modal.user.id).map((student) => (
                          <div key={student.id} className="flex items-center justify-between text-sm">
                            <span className="text-slate-700">{student.name}</span>
                            <span className="text-xs text-slate-500">{student.email}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {modalError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  <FiAlertTriangle className="h-4 w-4 flex-shrink-0" />{modalError}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={closeModal} className={btnSecondary}>Cancelar</button>
                <button type="submit" disabled={modalLoading} className={btnPrimary}>
                  {modalLoading ? "Salvando…" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE USER MODAL */}
      {modal.type === "deleteUser" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <FiAlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Excluir usuário</h3>
            </div>
            <p className="text-sm text-slate-600">
              Tem certeza que deseja excluir <strong>{modal.user.name}</strong>? Esta ação não pode ser desfeita.
            </p>
            {modalError && <p className="mt-3 text-sm text-rose-700">{modalError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={closeModal} className={btnSecondary}>Cancelar</button>
              <button type="button" onClick={handleDeleteUser} disabled={modalLoading} className={btnDanger}>
                {modalLoading ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TURMA FORM MODAL */}
      {(modal.type === "createTurma" || modal.type === "editTurma") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-slate-900">
                {modal.type === "createTurma" ? "Criar Turma" : "Editar Turma"}
              </h3>
              <button type="button" onClick={closeModal} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleTurmaSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Nome da turma</label>
                <input className={inputCls} placeholder="Ex: Turma A1 — Básico" {...turmaForm.register("name")} required />
              </div>
              <div>
                <label className={labelCls}>Descrição</label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-colors resize-none"
                  placeholder="Descreva o nível ou objetivo da turma…"
                  {...turmaForm.register("description")}
                />
              </div>
              <div>
                <label className={labelCls}>Professor responsável</label>
                <select className={inputCls} {...turmaForm.register("professor_id")}>
                  <option value="">Nenhum</option>
                  {professors.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
                </select>
              </div>
              {modal.type === "editTurma" && (
                <div>
                  <label className={labelCls}>Alunos na turma ({students.filter(s => s.turma_id === modal.turma.id).length})</label>
                  <div className="max-h-32 overflow-y-auto rounded-xl border border-border bg-slate-50 p-3">
                    {students.filter(s => s.turma_id === modal.turma.id).length === 0 ? (
                      <p className="text-sm text-slate-500 italic">Nenhum aluno nesta turma.</p>
                    ) : (
                      <div className="space-y-1">
                        {students.filter(s => s.turma_id === modal.turma.id).map((student) => {
                          const professor = professors.find(p => p.id === student.professor_id);
                          return (
                            <div key={student.id} className="flex items-center justify-between text-sm">
                              <span className="text-slate-700">{student.name}</span>
                              <div className="text-right">
                                <div className="text-xs text-slate-500">{student.email}</div>
                                {professor && <div className="text-xs text-blue-600">{professor.name}</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {modalError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  <FiAlertTriangle className="h-4 w-4 flex-shrink-0" />{modalError}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={closeModal} className={btnSecondary}>Cancelar</button>
                <button type="submit" disabled={modalLoading} className={btnPrimary}>
                  {modalLoading ? "Salvando…" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE TURMA MODAL */}
      {modal.type === "deleteTurma" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <FiAlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Excluir turma</h3>
            </div>
            <p className="text-sm text-slate-600">
              Tem certeza que deseja excluir a turma <strong>{modal.turma.name}</strong>?
            </p>
            {modalError && <p className="mt-3 text-sm text-rose-700">{modalError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={closeModal} className={btnSecondary}>Cancelar</button>
              <button type="button" onClick={handleDeleteTurma} disabled={modalLoading} className={btnDanger}>
                {modalLoading ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
