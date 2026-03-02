"use client";

import { useState, useEffect } from "react";
import { CalendarEvent, CalendarEventStatus } from "@/types/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FiX, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUser, 
  FiTag, 
  FiAlertCircle,
  FiSave,
  FiTrash2
} from "react-icons/fi";

interface CalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => void;
  onDelete?: (eventId: string) => void;
  event?: CalendarEvent | null;
  selectedDate?: Date;
  mode: "create" | "edit";
}

const statusOptions: { value: CalendarEventStatus; label: string; color: string }[] = [
  { value: "confirmed", label: "Confirmado", color: "bg-green-100 text-green-800" },
  { value: "tentative", label: "Tentativo", color: "bg-yellow-100 text-yellow-800" },
  { value: "cancelled", label: "Cancelado", color: "bg-red-100 text-red-800" }
];

const colorOptions = [
  { value: "blue", label: "Azul", color: "bg-blue-500" },
  { value: "green", label: "Verde", color: "bg-green-500" },
  { value: "red", label: "Vermelho", color: "bg-red-500" },
  { value: "yellow", label: "Amarelo", color: "bg-yellow-500" },
  { value: "purple", label: "Roxo", color: "bg-purple-500" },
  { value: "pink", label: "Rosa", color: "bg-pink-500" },
  { value: "indigo", label: "Índigo", color: "bg-indigo-500" },
  { value: "gray", label: "Cinza", color: "bg-gray-500" }
];

const priorityOptions = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" }
];

export function CalendarEventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  event, 
  selectedDate, 
  mode 
}: CalendarEventModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    allDay: false,
    status: "confirmed" as CalendarEventStatus,
    color: "blue",
    location: "",
    attendees: [] as string[],
    tags: [] as string[],
    priority: "medium" as "low" | "medium" | "high",
    isPrivate: false,
    resourceId: ""
  });

  const [newTag, setNewTag] = useState("");
  const [newAttendee, setNewAttendee] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && event) {
        // Populate form with existing event data
        setFormData({
          title: event.title,
          description: event.description || "",
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: event.allDay || false,
          status: event.status,
          color: event.color?.replace("rgb(", "").replace(")", "") || "blue",
          location: event.location || "",
          attendees: event.attendees?.map(a => a.email) || [],
          tags: event.tags || [],
          priority: event.priority || "medium",
          isPrivate: event.isPrivate || false,
          resourceId: event.resourceId || ""
        });
      } else if (mode === "create" && selectedDate) {
        // Set initial date to selected date
        const startDate = new Date(selectedDate);
        const endDate = new Date(selectedDate);
        endDate.setHours(startDate.getHours() + 1);
        
        setFormData(prev => ({
          ...prev,
          start: startDate,
          end: endDate
        }));
      }
    }
  }, [isOpen, event, mode, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert("Por favor, insira um título para o evento.");
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        start: formData.start,
        end: formData.end,
        allDay: formData.allDay,
        status: formData.status,
        color: formData.color,
        location: formData.location.trim(),
        attendees: formData.attendees.map(email => ({
          id: email,
          name: email.split("@")[0],
          email: email,
          status: "needs-action" as const
        })),
        tags: formData.tags,
        priority: formData.priority,
        isPrivate: formData.isPrivate,
        resourceId: formData.resourceId,
        resourceIds: formData.resourceId ? [formData.resourceId] : undefined,
        editable: true,
        draggable: true,
        deletable: true
      };

      onSave(eventData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
      alert("Erro ao salvar evento. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (event && onDelete) {
      if (confirm("Tem certeza que deseja excluir este evento?")) {
        onDelete(event.id);
        onClose();
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAttendee = () => {
    if (newAttendee.trim() && !formData.attendees.includes(newAttendee.trim())) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee("");
    }
  };

  const removeAttendee = (attendeeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter(attendee => attendee !== attendeeToRemove)
    }));
  };

  const formatDateTimeLocal = (date: Date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "create" ? "Criar Novo Evento" : "Editar Evento"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FiCalendar className="w-5 h-5" />
              Informações Básicas
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o título do evento"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite uma descrição para o evento"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Início *
                </label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.start)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setFormData(prev => ({ ...prev, start: newDate }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fim *
                </label>
                <input
                  type="datetime-local"
                  value={formatDateTimeLocal(formData.end)}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setFormData(prev => ({ ...prev, end: newDate }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.allDay}
                  onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Evento de dia inteiro</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Evento privado</span>
              </label>
            </div>
          </div>

          {/* Location and Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FiMapPin className="w-5 h-5" />
              Localização e Recursos
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localização
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite a localização do evento"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recurso
              </label>
              <select
                value={formData.resourceId}
                onChange={(e) => setFormData(prev => ({ ...prev, resourceId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um recurso</option>
                <option value="resource-1">Professor João Silva</option>
                <option value="resource-2">Sala de Aula 1</option>
                <option value="resource-3">Maria Santos</option>
              </select>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5" />
              Status e Prioridade
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as CalendarEventStatus }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as "low" | "medium" | "high" }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorityOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cor do Evento
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      value={option.value}
                      checked={formData.color === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="sr-only"
                    />
                    <div
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === option.value ? "border-gray-800" : "border-gray-300"
                      } ${option.color}`}
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              Participantes
            </h3>

            <div className="flex gap-2">
              <input
                type="email"
                value={newAttendee}
                onChange={(e) => setNewAttendee(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite o email do participante"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addAttendee();
                  }
                }}
              />
              <button
                type="button"
                onClick={addAttendee}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>

            <div className="space-y-2">
              {formData.attendees.map((attendee, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <span className="flex-1 text-sm text-gray-700">{attendee}</span>
                  <button
                    type="button"
                    onClick={() => removeAttendee(attendee)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <FiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <FiTag className="w-5 h-5" />
              Tags
            </h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Digite uma tag"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Adicionar
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                onClick={() => removeTag(tag)}
                    className="p-0.5 hover:bg-blue-200 rounded-full transition-colors"
                  >
                    <FiX className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                Excluir Evento
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="event-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FiSave className="w-4 h-4" />
              {isSubmitting ? "Salvando..." : mode === "create" ? "Criar Evento" : "Salvar Alterações"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}