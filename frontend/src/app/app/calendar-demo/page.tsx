"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/Calendar/CalendarView";
import { useCalendar, useCalendarSetEvents, useCalendarSetResources } from "@/hooks/useCalendar";
import { CalendarEvent, CalendarResource, CalendarEventStatus } from "@/types/calendar";

function generateMockEvents(): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const today = new Date();
  
  // Eventos de exemplo para os próximos 30 dias
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Eventos aleatórios
    if (Math.random() > 0.6) {
      const startHour = Math.floor(Math.random() * 16) + 8; // 8h às 23h
      const duration = Math.floor(Math.random() * 3) + 1; // 1-3 horas
      
      const start = new Date(date);
      start.setHours(startHour, 0, 0, 0);
      
      const end = new Date(start);
      end.setHours(startHour + duration, 0, 0, 0);
      
      const statuses: CalendarEventStatus[] = ["confirmed", "tentative", "cancelled"];
      const colors = ["blue", "green", "red", "yellow", "purple", "pink", "indigo"];
      const types = ["Reunião", "Aula", "Consulta", "Evento", "Tarefa", "Lembrete"];
      
      events.push({
        id: `event-${i}`,
        title: `${types[Math.floor(Math.random() * types.length)]} ${i + 1}`,
        description: `Descrição do evento ${i + 1}. Este é um evento de exemplo para demonstração.`,
        start,
        end,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        location: Math.random() > 0.7 ? `Sala ${Math.floor(Math.random() * 20) + 1}` : undefined,
        priority: Math.random() > 0.7 ? "high" : Math.random() > 0.5 ? "medium" : "low",
        tags: Math.random() > 0.5 ? ["importante", "urgente"] : undefined,
        editable: Math.random() > 0.3,
        draggable: Math.random() > 0.4,
        allDay: Math.random() > 0.8,
        resourceId: `resource-${Math.floor(Math.random() * 3) + 1}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  
  return events;
}

function generateMockResources(): CalendarResource[] {
  return [
    {
      id: "resource-1",
      name: "Professor João Silva",
      color: "rgb(59, 130, 246)",
      type: "person",
      email: "joao.silva@lesfrangines.com",
      isActive: true
    },
    {
      id: "resource-2", 
      name: "Sala de Aula 1",
      color: "rgb(34, 197, 94)",
      type: "room",
      capacity: 20,
      isActive: true
    },
    {
      id: "resource-3",
      name: "Maria Santos",
      color: "rgb(147, 51, 234)",
      type: "person", 
      email: "maria.santos@lesfrangines.com",
      isActive: true
    }
  ];
}

export default function CalendarDemoPage() {
  const calendar = useCalendar();
  const setEvents = useCalendarSetEvents();
  const setResources = useCalendarSetResources();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    // Carregar dados mock
    const mockEvents = generateMockEvents();
    const mockResources = generateMockResources();
    
    setEvents(mockEvents);
    setResources(mockResources);
    
    setIsLoading(false);
  }, [setEvents, setResources]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    console.log("Evento clicado:", event);
  };

  const handleEventDoubleClick = (event: CalendarEvent) => {
    console.log("Evento duplo clique:", event);
    // Aqui poderia abrir um modal de edição
  };

  const handleDateClick = (date: Date) => {
    console.log("Data clicada:", date);
    // Aqui poderia criar um novo evento
    const newEvent = {
      title: "Novo Evento",
      description: "Evento criado com clique",
      start: date,
      end: new Date(date.getTime() + 60 * 60 * 1000), // 1 hora depois
      status: "tentative" as CalendarEventStatus,
      color: "blue"
    };
    
    calendar.createEvent(newEvent);
  };

  const handleEventDrop = (event: CalendarEvent, newDate: Date) => {
    console.log("Evento arrastado:", event.title, "para:", newDate);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Demonstração do Calendário
          </h1>
          <p className="text-gray-600">
            Componente de calendário avançado com visualizações múltiplas, arrastar e soltar, 
            e recursos inspirados no Bryntum Calendar.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <CalendarView
            className="w-full"
            height="700px"
            enableDarkMode={true}
            enableFilters={true}
            enableCreate={true}
            onEventClick={handleEventClick}
            onEventDoubleClick={handleEventDoubleClick}
            onDateClick={handleDateClick}
            onEventDrop={handleEventDrop}
          />
        </div>

        {/* Painel de informações */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Visualizações: Mês, Semana, Dia, Agenda</li>
              <li>✅ Arrastar e soltar eventos</li>
              <li>✅ Criação com clique</li>
              <li>✅ Edição com duplo clique</li>
              <li>✅ Filtros avançados</li>
              <li>✅ Temas claro/escuro</li>
              <li>✅ Internacionalização PT-BR</li>
              <li>✅ Responsividade total</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estatísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Eventos:</span>
                <span className="font-semibold">{calendar.events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Recursos:</span>
                <span className="font-semibold">{calendar.resources.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Visualização Atual:</span>
                <span className="font-semibold capitalize">{calendar.currentView}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
            <div className="space-y-2">
              <button
                onClick={() => calendar.setCurrentDate(new Date())}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ir para Hoje
              </button>
              <button
                onClick={() => calendar.clearFilters()}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Limpar Filtros
              </button>
              <button
                onClick={() => {
                  // Adicionar evento de teste
                  calendar.createEvent({
                    title: "Evento de Teste",
                    description: "Este é um evento de teste adicionado dinamicamente",
                    start: new Date(),
                    end: new Date(Date.now() + 2 * 60 * 60 * 1000),
                    status: "confirmed",
                    color: "green"
                  });
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Adicionar Evento Teste
              </button>
            </div>
          </div>
        </div>

        {/* Evento Selecionado */}
        {selectedEvent && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Evento Selecionado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <p className="mt-1 text-gray-900">{selectedEvent.title}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedEvent.status === "confirmed" ? "bg-green-100 text-green-800" :
                    selectedEvent.status === "tentative" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {selectedEvent.status === "confirmed" ? "Confirmado" :
                     selectedEvent.status === "tentative" ? "Tentativo" : "Cancelado"}
                  </span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Início</label>
                <p className="mt-1 text-gray-900">
                  {selectedEvent.start.toLocaleString("pt-BR")}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fim</label>
                <p className="mt-1 text-gray-900">
                  {selectedEvent.end.toLocaleString("pt-BR")}
                </p>
              </div>
              {selectedEvent.description && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Descrição</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.description}</p>
                </div>
              )}
              {selectedEvent.location && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Localização</label>
                  <p className="mt-1 text-gray-900">{selectedEvent.location}</p>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => calendar.deleteEvent(selectedEvent.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir Evento
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
