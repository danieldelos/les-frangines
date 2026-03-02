"use client";

import { useState, useCallback } from "react";
import { CalendarResource } from "@/types/calendar";
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiUsers, 
  FiMapPin, 
  FiMonitor,
  FiX,
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiClock
} from "react-icons/fi";

interface CalendarResourceManagerProps {
  resources: CalendarResource[];
  onResourcesChange: (resources: CalendarResource[]) => void;
  className?: string;
}

const resourceTypeIcons = {
  person: FiUser,
  room: FiMapPin,
  equipment: FiMonitor
};

const resourceTypeLabels = {
  person: "Pessoa",
  room: "Sala",
  equipment: "Equipamento"
};

export function CalendarResourceManager({ 
  resources, 
  onResourcesChange, 
  className = ""
}: CalendarResourceManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingResource, setEditingResource] = useState<CalendarResource | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "person" as CalendarResource["type"],
    color: "#3B82F6",
    textColor: "#FFFFFF",
    email: "",
    phone: "",
    capacity: 1,
    workingHours: {
      start: "09:00",
      end: "18:00",
      daysOfWeek: [1, 2, 3, 4, 5] // Segunda a Sexta
    }
  });

  const generateId = () => `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleCreate = () => {
    const newResource: CalendarResource = {
      id: generateId(),
      ...formData,
      isActive: true
    };

    onResourcesChange([...resources, newResource]);
    resetForm();
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!editingResource) return;

    const updatedResources = resources.map(resource =>
      resource.id === editingResource.id
        ? { ...resource, ...formData }
        : resource
    );

    onResourcesChange(updatedResources);
    resetForm();
    setEditingResource(null);
  };

  const handleDelete = (resourceId: string) => {
    if (confirm("Tem certeza que deseja excluir este recurso?")) {
      const filteredResources = resources.filter(resource => resource.id !== resourceId);
      onResourcesChange(filteredResources);
    }
  };

  const handleToggleActive = (resourceId: string) => {
    const updatedResources = resources.map(resource =>
      resource.id === resourceId
        ? { ...resource, isActive: !resource.isActive }
        : resource
    );

    onResourcesChange(updatedResources);
  };

  const startEdit = (resource: CalendarResource) => {
    setFormData({
      name: resource.name,
      description: resource.description || "",
      type: resource.type || "person",
      color: resource.color,
      textColor: resource.textColor || "#FFFFFF",
      email: resource.email || "",
      phone: resource.phone || "",
      capacity: resource.capacity || 1,
      workingHours: resource.workingHours || {
        start: "09:00",
        end: "18:00",
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    });
    setEditingResource(resource);
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "person",
      color: "#3B82F6",
      textColor: "#FFFFFF",
      email: "",
      phone: "",
      capacity: 1,
      workingHours: {
        start: "09:00",
        end: "18:00",
        daysOfWeek: [1, 2, 3, 4, 5]
      }
    });
  };

  const handleWorkingHoursChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [field]: value
      }
    }));
  };

  const toggleWorkingDay = (day: number) => {
    const currentDays = formData.workingHours.daysOfWeek;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort();

    handleWorkingHoursChange("daysOfWeek", newDays);
  };

  const weekDays = [
    { day: 1, label: "Seg" },
    { day: 2, label: "Ter" },
    { day: 3, label: "Qua" },
    { day: 4, label: "Qui" },
    { day: 5, label: "Sex" },
    { day: 6, label: "Sáb" },
    { day: 0, label: "Dom" }
  ];

  const colorPresets = [
    "#3B82F6", // blue
    "#10B981", // green
    "#EF4444", // red
    "#F59E0B", // yellow
    "#8B5CF6", // purple
    "#EC4899", // pink
    "#6366F1", // indigo
    "#6B7280"  // gray
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FiUsers className="w-5 h-5" />
          Gerenciar Recursos
        </h3>
        <button
          onClick={() => {
            resetForm();
            setIsCreating(true);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Novo Recurso
        </button>
      </div>

      {/* Resources List */}
      <div className="p-4">
        {resources.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FiUsers className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum recurso cadastrado</p>
            <p className="text-sm mt-2">Clique em &quot;Novo Recurso&quot; para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => {
              const IconComponent = resourceTypeIcons[resource.type || "person"];
              
              return (
                <div
                  key={resource.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-all ${
                    resource.isActive 
                      ? "border-gray-200 bg-white hover:shadow-sm" 
                      : "border-gray-100 bg-gray-50 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: resource.color }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{resource.name}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                          {resourceTypeLabels[resource.type || "person"]}
                        </span>
                      </div>
                      
                      {resource.description && (
                        <p className="text-sm text-gray-600 truncate">{resource.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        {resource.email && (
                          <span className="flex items-center gap-1">
                            <FiMail className="w-3 h-3" />
                            {resource.email}
                          </span>
                        )}
                        {resource.phone && (
                          <span className="flex items-center gap-1">
                            <FiPhone className="w-3 h-3" />
                            {resource.phone}
                          </span>
                        )}
                        {resource.capacity && resource.type === "room" && (
                          <span className="flex items-center gap-1">
                            <FiUsers className="w-3 h-3" />
                            {resource.capacity} pessoas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(resource.id)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        resource.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {resource.isActive ? "Ativo" : "Inativo"}
                    </button>
                    
                    <button
                      onClick={() => startEdit(resource)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(resource.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editingResource) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isCreating ? "Criar Novo Recurso" : "Editar Recurso"}
              </h2>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o nome do recurso"
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
                    placeholder="Digite uma descrição para o recurso"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as CalendarResource["type"] }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="person">Pessoa</option>
                      <option value="room">Sala</option>
                      <option value="equipment">Equipamento</option>
                    </select>
                  </div>

                  {formData.type === "room" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacidade
                      </label>
                      <input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) || 1 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor do Recurso
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        title={`Cor ${color}`}
                      />
                    ))}
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-8 h-8 rounded-full border-2 border-gray-300 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <FiClock className="w-5 h-5" />
                  Horário de Trabalho
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Início
                    </label>
                    <input
                      type="time"
                      value={formData.workingHours.start}
                      onChange={(e) => handleWorkingHoursChange("start", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fim
                    </label>
                    <input
                      type="time"
                      value={formData.workingHours.end}
                      onChange={(e) => handleWorkingHoursChange("end", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias da Semana
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {weekDays.map(({ day, label }) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkingDay(day)}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          formData.workingHours.daysOfWeek.includes(day)
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingResource(null);
                  resetForm();
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={isCreating ? handleCreate : handleUpdate}
                disabled={!formData.name.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FiSave className="w-4 h-4" />
                {isCreating ? "Criar Recurso" : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
