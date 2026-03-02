"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { create } from "zustand";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ErrorMessage } from "@/components/ErrorMessage";
import { LoadingState } from "@/components/LoadingState";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/lib/auth";


type Role = "admin" | "professor" | "aluno";
type UserStatus = "ativo" | "inativo";

type UserRow = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  professorId?: number | null;
};

type RevenuePoint = { month: string; total: number };

type AdminStore = {
  users: UserRow[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  perPage: number;
  roleFilter: "all" | Role;
  search: string;
  setPage: (page: number) => void;
  setRoleFilter: (role: "all" | Role) => void;
  setSearch: (search: string) => void;
  setUsers: (users: UserRow[]) => void;
  loadUsers: (params?: {
    page?: number;
    pageSize?: number;
    role?: "all" | Role;
    search?: string;
  }) => Promise<void>;
};

const mockUsers: UserRow[] = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean@lesfrangines.fr",
    role: "admin",
    status: "ativo",
    createdAt: "2026-02-15",
    professorId: null
  },
  {
    id: 2,
    name: "Prof. Claire",
    email: "claire@lesfrangines.fr",
    role: "professor",
    status: "ativo",
    createdAt: "2026-02-01",
    professorId: null
  },
  {
    id: 3,
    name: "Prof. Jean",
    email: "jean.prof@lesfrangines.fr",
    role: "professor",
    status: "ativo",
    createdAt: "2026-02-05",
    professorId: null
  },
  {
    id: 4,
    name: "Ana Silva",
    email: "ana@example.com",
    role: "aluno",
    status: "ativo",
    createdAt: "2026-02-20",
    professorId: 3
  },
  {
    id: 5,
    name: "Lucas Martins",
    email: "lucas@example.com",
    role: "aluno",
    status: "ativo",
    createdAt: "2026-02-18",
    professorId: 2
  },
  {
    id: 6,
    name: "Maria Souza",
    email: "maria@example.com",
    role: "aluno",
    status: "inativo",
    createdAt: "2026-02-10",
    professorId: null
  }
];

const revenueData: RevenuePoint[] = [
  { month: "Nov", total: 32000 },
  { month: "Dez", total: 41000 },
  { month: "Jan", total: 38000 },
  { month: "Fev", total: 46000 }
];

const useAdminStore = create<AdminStore>((set) => ({
  users: mockUsers,
  loading: false,
  error: null,
  total: mockUsers.length,
  page: 1,
  perPage: 10,
  roleFilter: "all",
  search: "",
  setPage: (page: number) => set({ page }),
  setRoleFilter: (roleFilter: "all" | Role) => set({ roleFilter, page: 1 }),
  setSearch: (search: string) => set({ search, page: 1 }),
  setUsers: (users: UserRow[]) => set({ users }),
  loadUsers: async (params) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams();
      const page = params?.page ?? 1;
      const pageSize = params?.pageSize ?? 10;
      const role = params?.role ?? "all";
      const search = params?.search ?? "";
      query.set("page", String(page));
      query.set("page_size", String(pageSize));
      if (role !== "all") {
        query.set("role", role);
      }
      if (search.trim()) {
        query.set("search", search.trim());
      }
      const res = await fetch(`/api/users/?${query.toString()}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Falha ao carregar usuários.");
      }
      const data = (await res.json()) as unknown;
      const results = (data as { results?: unknown[] }).results;
      if (Array.isArray(results)) {
        const normalized = results.map((item: unknown, index: number) => {
          const raw = item as Partial<UserRow> & {
            first_name?: string;
            last_name?: string;
            created_at?: string;
            professor_id?: number | null;
          };
          const nameFromParts = `${raw.first_name ?? ""} ${raw.last_name ?? ""}`.trim();
          const name = raw.name ?? (nameFromParts || `Usuário ${index + 1}`);
          return {
            id: typeof raw.id === "number" ? raw.id : index + 1,
            name,
            email: raw.email ?? `user${index + 1}@example.com`,
            role: (raw.role as Role) ?? "aluno",
            status: (raw.status as UserStatus) ?? "ativo",
            createdAt: raw.createdAt ?? raw.created_at ?? "2026-02-01",
            professorId: raw.professorId ?? raw.professor_id ?? null
          };
        });
        set({
          users: normalized,
          total: typeof (data as { count?: number }).count === "number" ? (data as { count?: number }).count! : normalized.length
        });
      } else {
        set({ users: [], total: 0 });
      }
    } catch (err) {
      set({
        users: [],
        total: 0,
        error: err instanceof Error ? err.message : "Erro ao carregar usuários."
      });
    } finally {
      set({ loading: false });
    }
  }
}));

type FilterForm = {
  search: string;
  role: "all" | Role;
};

type AssignForm = {
  professorId: string;
  studentIds: Record<string, boolean>;
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const {
    users,
    loading: tableLoading,
    error,
    total,
    page,
    perPage,
    roleFilter,
    search,
    setPage,
    setRoleFilter,
    setSearch,
    loadUsers
  } = useAdminStore();

  const filterForm = useForm<FilterForm>({
    defaultValues: { search: "", role: "all" }
  });

  const assignForm = useForm<AssignForm>({
    defaultValues: { professorId: "", studentIds: {} }
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    void loadUsers({ page, pageSize: perPage, role: roleFilter, search });
  }, [loadUsers, page, perPage, roleFilter, search]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pageUsers = users;

  const professors = users.filter((item: UserRow) => item.role === "professor");
  const unassignedStudents = users.filter(
    (item: UserRow) => item.role === "aluno" && !item.professorId
  );

  const studentsByProfessor: Array<{ professor: UserRow; count: number }> = professors.map(
    (professor: UserRow) => ({
    professor,
    count: users.filter(
      (item: UserRow) => item.role === "aluno" && item.professorId === professor.id
    ).length
  }));

  const metrics = [
    { label: "Ticket médio", value: "R$ 320" },
    { label: "Receita mensal", value: "R$ 46.000" },
    { label: "Alunos ativos", value: users.filter((u: UserRow) => u.role === "aluno").length }
  ];
  const financeModules = [
    {
      title: "Contas a pagar",
      description: "Controle de boletos, fornecedores e recorrências.",
      value: "R$ 18.400",
      href: "/dashboard/admin/finance/contas-pagar"
    },
    {
      title: "Contas a receber",
      description: "Cobranças em aberto e recebimentos agendados.",
      value: "R$ 31.250",
      href: "/dashboard/admin/finance/contas-receber"
    },
    {
      title: "Fluxo de caixa",
      description: "Entradas x saídas com saldo projetado.",
      value: "R$ 12.850",
      href: "/dashboard/admin/finance/fluxo-caixa"
    }
  ];

  if (loading || !user) {
    return <LoadingState />;
  }

  if (user.role !== "admin") {
    return <ErrorMessage message="Acesso negado" />;
  }

  const onFilterSubmit = filterForm.handleSubmit((values: FilterForm) => {
    setSearch(values.search);
    setRoleFilter(values.role);
  });

  const onAssignSubmit = assignForm.handleSubmit(async (values: AssignForm) => {
    setAssignError(null);
    const professorId = Number(values.professorId);
    if (!professorId) {
      setAssignError("Selecione um professor.");
      return;
    }
    const selectedIds = Object.entries(values.studentIds)
      .filter(([, checked]) => checked)
      .map(([id]) => Number(id));
    if (selectedIds.length === 0) {
      setAssignError("Selecione ao menos um aluno.");
      return;
    }
    try {
      const res = await fetch("/api/users/assign/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ professor_id: professorId, student_ids: selectedIds })
      });
      if (!res.ok) {
        throw new Error("Falha ao atribuir alunos.");
      }
      const updated = users.map((item: UserRow) => {
        if (item.role === "aluno" && selectedIds.includes(item.id)) {
          return { ...item, professorId };
        }
        return item;
      });
      useAdminStore.getState().setUsers(updated);
      assignForm.reset({ professorId: "", studentIds: {} });
      setAssignOpen(false);
    } catch (err) {
      setAssignError(err instanceof Error ? err.message : "Erro ao atribuir alunos.");
    }
  });

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="flex min-h-[calc(100vh-80px)] flex-col gap-6 lg:flex-row lg:items-stretch">
        <Sidebar />
        <div className="flex-1 space-y-6">
        <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Dashboard do administrador
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Visão geral operacional e financeira.
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
            >
              Adicionar Professor
            </button>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-border bg-white p-4 transition-all duration-300 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-xs font-semibold tracking-wide text-slate-500">
                  {metric.label}
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Módulos financeiros</h2>
              <p className="text-sm text-slate-600">
                Acompanhe contas a pagar, receber e projeções.
              </p>
            </div>
            <Link
              href="/dashboard/admin/finance"
              className="text-sm font-semibold text-slate-900 underline decoration-border underline-offset-4"
            >
              Ver painel financeiro
            </Link>
          </div>
          <div className="mt-6 grid gap-3 lg:grid-cols-3">
            {financeModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="group rounded-2xl border border-border bg-white p-5 transition-all duration-300 motion-reduce:transition-none hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between text-xs font-semibold tracking-wide text-slate-500">
                  <span>{module.title}</span>
                  <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-slate-600">
                    Ativo
                  </span>
                </div>
                <div className="mt-3 text-lg font-semibold text-slate-900">{module.value}</div>
                <p className="mt-2 text-sm text-slate-600">{module.description}</p>
                <div className="mt-4 text-sm font-semibold text-slate-800 group-hover:text-slate-950">
                  Acessar módulo
                </div>
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
            <Link
              href="/dashboard/admin/finance"
              className="text-sm font-semibold text-slate-900 underline decoration-border underline-offset-4"
            >
              Ir para financeiro
            </Link>
          </div>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#0b0b0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              Importar Extrato Bancário
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Usuários</h2>
              <p className="text-sm text-slate-600">Controle de alunos e professores.</p>
            </div>
            <form onSubmit={onFilterSubmit} className="flex flex-wrap items-end gap-2">
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Buscar</label>
                <input
                  type="search"
                  className="h-9 w-56 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Nome ou email"
                  {...filterForm.register("search")}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Role</label>
                <select
                  className="h-9 rounded-xl border border-border bg-white px-3 text-sm"
                  {...filterForm.register("role")}
                >
                  <option value="all">Todos</option>
                  <option value="admin">Admin</option>
                  <option value="professor">Professor</option>
                  <option value="aluno">Aluno</option>
                </select>
              </div>
              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
              >
                Filtrar
              </button>
            </form>
          </div>

          {tableLoading ? (
            <div className="mt-6">
              <LoadingState />
            </div>
          ) : error ? (
            <div className="mt-6">
              <ErrorMessage message={error} />
            </div>
          ) : (
            <div className="mt-6 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Nome</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Role</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Data criação</th>
                    <th className="py-2 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageUsers.map((item: UserRow) => (
                    <tr key={item.id}>
                      <td className="py-3 font-medium text-slate-900">{item.name}</td>
                      <td className="py-3 text-slate-600">{item.email}</td>
                      <td className="py-3 capitalize text-slate-600">{item.role}</td>
                      <td className="py-3 text-slate-600">{item.status}</td>
                      <td className="py-3 text-slate-600">{item.createdAt}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="rounded-xl border border-border px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            Editar
                          </button>
                          <button className="rounded-xl border border-border px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            Excluir
                          </button>
                          <button className="rounded-xl border border-border px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                            Visualizar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>
                  Página {page} de {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="rounded-xl border border-border px-3 py-1 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="rounded-xl border border-border px-3 py-1 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-white/70 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Atribuição de alunos
              </h2>
              <p className="text-sm text-slate-600">Alunos distribuídos por professor.</p>
            </div>
            <button
              type="button"
              onClick={() => setAssignOpen(true)}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
            >
              Atribuir Alunos
            </button>
          </div>

          <div className="mt-6 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2">Professor</th>
                  <th className="py-2">Quantidade de Alunos</th>
                  <th className="py-2 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {studentsByProfessor.map(
                  ({ professor, count }: { professor: UserRow; count: number }) => (
                  <tr key={professor.id}>
                    <td className="py-3 font-medium text-slate-900">{professor.name}</td>
                    <td className="py-3 text-slate-600">{count}</td>
                    <td className="py-3 text-right">
                      <button className="rounded-xl border border-border px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Gerenciar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        </div>
      </div>

      {assignOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-6">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Atribuir Alunos</h3>
              <button
                type="button"
                onClick={() => setAssignOpen(false)}
                className="text-sm text-slate-600"
              >
                Fechar
              </button>
            </div>
            <form onSubmit={onAssignSubmit} className="mt-4 grid gap-4">
              <div className="grid gap-1">
                <label className="text-xs font-semibold text-slate-600">Professor</label>
                <select
                  className="h-10 rounded-xl border border-border bg-white px-3 text-sm"
                  {...assignForm.register("professorId")}
                >
                  <option value="">Selecione</option>
                  {professors.map((prof: UserRow) => (
                    <option key={prof.id} value={String(prof.id)}>
                      {prof.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  Alunos sem professor
                </span>
                <div className="max-h-40 overflow-auto rounded-xl border border-border bg-white p-3">
                  {unassignedStudents.length === 0 ? (
                    <div className="text-sm text-slate-600">
                      Todos os alunos já estão atribuídos.
                    </div>
                  ) : (
                    <div className="grid gap-2">
                      {unassignedStudents.map((student: UserRow) => (
                        <label key={student.id} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border"
                            {...assignForm.register(`studentIds.${student.id}`)}
                          />
                          <span>{student.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {assignError ? <div className="text-sm text-rose-700">{assignError}</div> : null}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignOpen(false)}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-belgium-black px-4 text-sm font-semibold text-white hover:bg-belgium-black/90"
                >
                  Atribuir
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
