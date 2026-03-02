"use client";

import { useState, useCallback, useMemo } from "react";
import { CalendarEvent, CalendarResource, CalendarViewType } from "@/types/calendar";
import { 
  useCalendarEvents, 
  useCalendarConfig,
  useCalendarResourcesState,
  useCalendarSetResources,
  useCalendarFiltersState,
  useCalendarSetFilters,
  useCalendarClearFilters,
  useCalendarIsDarkMode,
  useCalendarSetIsDarkMode
} from "@/hooks/useCalendar";
import { CalendarEventModal } from "./CalendarEventModal";
import { CalendarResourceManager } from "./CalendarResourceManager";
import { CalendarEventResizer } from "./CalendarEventResizer";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, addDays, addMonths, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiClock, 
  FiGrid, 
  FiList, 
  FiSun, 
  FiMoon,
  FiPlus,
  FiFilter,
  FiRefreshCw,
  FiMapPin,
  FiUsers,
  FiSettings,
  FiDownload,
  FiUpload,
  FiSearch,
  FiX,
  FiChevronDown
} from "react-icons/fi";

interface CalendarViewProps {
  className?: string;
  height?: string | number;
  enableDarkMode?: boolean;
  enableFilters?: boolean;
  enableCreate?: boolean;
  enableResources?: boolean;
  enableExport?: boolean;
  onEventClick?: (event: CalendarEvent) => void;
  onEventDoubleClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (event: CalendarEvent, newDate: Date) => void;
  onEventResize?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
}

const viewTypeLabels: Record<CalendarViewType, string> = {
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda"
};

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function CalendarView({ 
  className = "", 
  height = "600px",
  enableDarkMode = true,
  enableFilters = true,
  enableCreate = true,
  enableResources = true,
  enableExport = true,
  onEventClick,
  onEventDoubleClick,
  onDateClick,
  onEventDrop,
  onEventResize
}: CalendarViewProps) {
  const { events, filterEvents, createEvent, updateEvent, deleteEvent, moveEvent, resizeEvent } = useCalendarEvents();
  const config = useCalendarConfig();
  const resources = useCalendarResourcesState();
  const setResources = useCalendarSetResources();
  const filters = useCalendarFiltersState();
  const setFilters = useCalendarSetFilters();
  const clearFilters = useCalendarClearFilters();
  const isDarkMode = useCalendarIsDarkMode();
  const setIsDarkMode = useCalendarSetIsDarkMode();
  
  const [currentView, setCurrentView] = useState<CalendarViewType>(config.defaultView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
  const [resizingEvent, setResizingEvent] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter events for current view range
  const getViewDateRange = useCallback(() => {
    const firstDayOfWeek = config.firstDayOfWeek ?? 0;
    switch (currentView) {
      case "day":
        return { start: currentDate, end: currentDate };
      case "week":
        return {
          start: startOfWeek(currentDate, { weekStartsOn: firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6 }),
          end: endOfWeek(currentDate, { weekStartsOn: firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6 })
        };
      case "month":
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      case "agenda":
        const start = startOfWeek(currentDate, { weekStartsOn: firstDayOfWeek as 0 | 1 | 2 | 3 | 4 | 5 | 6 });
        const end = addDays(start, 30);
        return { start, end };
      default:
        return { start: currentDate, end: currentDate };
    }
  }, [config.firstDayOfWeek, currentDate, currentView]);

  const visibleEvents = useMemo(() => {
    const { start, end } = getViewDateRange();
    return filterEvents().filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return eventStart <= end && eventEnd >= start;
    });
  }, [events, currentView, currentDate, getViewDateRange, filterEvents]);

  // Format current month/year for header
  const currentMonthYear = useMemo(() => {
    return format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });
  }, [currentDate]);

  // Get calendar grid days
  const calendarDays = useMemo(() => {
    const { start, end } = getViewDateRange();
    return eachDayOfInterval({ start, end });
  }, [currentView, currentDate, getViewDateRange]);

  // Get events for a specific date
  const getEventsForDate = useCallback((date: Date) => {
    return visibleEvents.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return date >= eventStart && date <= eventEnd;
    });
  }, [visibleEvents]);

  // Handle view change
  const handleViewChange = useCallback((view: CalendarViewType) => {
    setCurrentView(view);
  }, []);

  // Handle date navigation
  const handlePrevious = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      switch (currentView) {
        case "day":
          next.setDate(next.getDate() - 1);
          break;
        case "week":
          next.setDate(next.getDate() - 7);
          break;
        case "month":
          next.setMonth(next.getMonth() - 1);
          break;
        case "agenda":
          next.setDate(next.getDate() - 7);
          break;
      }
      return next;
    });
  }, [currentView]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      switch (currentView) {
        case "day":
          next.setDate(next.getDate() + 1);
          break;
        case "week":
          next.setDate(next.getDate() + 7);
          break;
        case "month":
          next.setMonth(next.getMonth() + 1);
          break;
        case "agenda":
          next.setDate(next.getDate() + 7);
          break;
      }
      return next;
    });
  }, [currentView]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Event modal handlers
  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setSelectedDate(new Date());
    setShowEventModal(true);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setShowEventModal(true);
  };

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => {
    if (selectedEvent) {
      await updateEvent(selectedEvent.id, eventData);
    } else {
      await createEvent(eventData);
    }
    setShowEventModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
    setShowEventModal(false);
    setSelectedEvent(null);
  };

  // Drag and drop handlers
  const handleDragStart = useCallback((event: CalendarEvent, e: React.DragEvent) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", event.id);
  }, []);

  const handleDragOver = useCallback((date: Date, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDate(date);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverDate(null);
  }, []);

  const handleDrop = useCallback(async (date: Date, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDate(null);
    
    if (draggedEvent) {
      const timeDiff = date.getTime() - new Date(draggedEvent.start).getTime();
      const newStart = new Date(new Date(draggedEvent.start).getTime() + timeDiff);
      const newEnd = new Date(new Date(draggedEvent.end).getTime() + timeDiff);
      
      await moveEvent({
        event: draggedEvent,
        newStart,
        newEnd
      });
      
      onEventDrop?.(draggedEvent, date);
      setDraggedEvent(null);
    }
  }, [draggedEvent, moveEvent, onEventDrop]);

  // Event resize handler
  const handleEventResize = async (eventId: string, newStart: Date, newEnd: Date) => {
    await updateEvent(eventId, { start: newStart, end: newEnd });
    onEventResize?.(events.find(e => e.id === eventId)!, newStart, newEnd);
  };

  // Date click handler
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setShowEventModal(true);
    onDateClick?.(date);
  }, [onDateClick]);

  // Event click handlers
  const handleEventClick = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick?.(event);
  }, [onEventClick]);

  const handleEventDoubleClick = useCallback((event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    handleEditEvent(event);
    onEventDoubleClick?.(event);
  }, [onEventDoubleClick]);

  // Export handlers
  const handleExport = (format: 'ics' | 'json' | 'csv') => {
    const data = {
      events: visibleEvents,
      resources,
      exportDate: new Date().toISOString()
    };

    let content = '';
    let filename = '';
    let mimeType = '';

    switch (format) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        filename = `calendar-export-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        content = convertToCSV(visibleEvents);
        filename = `calendar-export-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;
      case 'ics':
        content = convertToICS(visibleEvents);
        filename = `calendar-export-${new Date().toISOString().split('T')[0]}.ics`;
        mimeType = 'text/calendar';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (events: CalendarEvent[]) => {
    const headers = ['Título', 'Descrição', 'Início', 'Fim', 'Localização', 'Status', 'Prioridade'];
    const rows = events.map(event => [
      event.title,
      event.description || '',
      format(new Date(event.start), 'dd/MM/yyyy HH:mm'),
      format(new Date(event.end), 'dd/MM/yyyy HH:mm'),
      event.location || '',
      event.status,
      event.priority || 'medium'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const convertToICS = (events: CalendarEvent[]) => {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Les Frangines//Calendar//PT\n';
    
    events.forEach(event => {
      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${event.id}\n`;
      ics += `DTSTART:${format(new Date(event.start), 'yyyyMMddTHHmmss')}\n`;
      ics += `DTEND:${format(new Date(event.end), 'yyyyMMddTHHmmss')}\n`;
      ics += `SUMMARY:${event.title}\n`;
      if (event.description) ics += `DESCRIPTION:${event.description}\n`;
      if (event.location) ics += `LOCATION:${event.location}\n`;
      ics += 'END:VEVENT\n';
    });
    
    ics += 'END:VCALENDAR';
    return ics;
  };

  // Render event component with resizer
  const renderEvent = useCallback((event: CalendarEvent) => {
    const eventColor = event.color || config.theme.colors.eventColors.blue;
    const textColor = event.textColor || "#ffffff";
    
    return (
      <CalendarEventResizer
        key={event.id}
        event={event}
        onResize={handleEventResize}
        className={`
          calendar-event group relative rounded px-2 py-1 text-xs font-medium cursor-pointer
          transition-all duration-200 hover:shadow-md hover:scale-105
          ${event.editable !== false ? "draggable" : ""}
          ${draggedEvent?.id === event.id ? "opacity-50" : ""}
          ${resizingEvent === event.id ? "ring-2 ring-blue-400" : ""}
        `}
      >
        <div
          style={{ 
            backgroundColor: eventColor, 
            color: textColor,
            borderLeft: `3px solid ${eventColor}`
          }}
          onClick={(e) => handleEventClick(event, e)}
          onDoubleClick={(e) => handleEventDoubleClick(event, e)}
          draggable={event.draggable !== false && config.enableDragDrop}
          onDragStart={(e) => handleDragStart(event, e)}
          title={event.title}
        >
          <div className="truncate font-medium">{event.title}</div>
          {event.description && (
            <div className="text-xs opacity-80 truncate">{event.description}</div>
          )}
          
          {/* Event tooltip on hover */}
          <div className="absolute z-50 hidden group-hover:block bg-gray-900 text-white p-2 rounded shadow-lg -top-2 left-full ml-2 w-64">
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm opacity-90">
              {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
            </div>
            {event.description && <div className="text-sm mt-1">{event.description}</div>}
            {event.location && <div className="text-sm mt-1">📍 {event.location}</div>}
            {event.resourceId && (
              <div className="text-sm mt-1">
                📋 {resources.find(r => r.id === event.resourceId)?.name || "Recurso"}
              </div>
            )}
          </div>
        </div>
      </CalendarEventResizer>
    );
  }, [config, resources, draggedEvent, resizingEvent, handleEventClick, handleEventDoubleClick, handleDragStart, handleEventResize]);

  // Render month view with responsive design
  const renderMonthView = () => {
    const weeks = [];
    const startDate = calendarDays[0];
    const totalWeeks = Math.ceil(calendarDays.length / 7);
    
    for (let week = 0; week < totalWeeks; week++) {
      const weekDays = calendarDays.slice(week * 7, (week + 1) * 7);
      
      weeks.push(
        <div key={week} className="grid grid-cols-7 gap-px">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);
            const isDragOver = dragOverDate && isSameDay(day, dragOverDate);
            
            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-24 p-2 border border-gray-200 cursor-pointer
                  transition-colors duration-200 hover:bg-gray-50
                  ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white"}
                  ${isTodayDate ? "bg-blue-50 border-blue-300" : ""}
                  ${isDragOver ? "bg-blue-100 border-blue-400" : ""}
                  ${dayEvents.length > 0 ? "ring-1 ring-yellow-200" : ""}
                `}
                onClick={() => handleDateClick(day)}
                onDragOver={(e) => handleDragOver(day, e)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(day, e)}
              >
                <div className={`text-sm font-medium mb-1 ${isTodayDate ? "text-blue-600" : ""}`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1 max-h-16 overflow-y-auto">
                  {dayEvents.slice(0, 3).map(renderEvent)}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`}>
        {/* Week day headers - responsive */}
        <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-700">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {weeks}
        </div>
      </div>
    );
  };

  // Render week view with time slots
  const renderWeekView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const { start: weekStart } = getViewDateRange();
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`} style={{ height }}>
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {/* Time column */}
          <div className="w-16 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            <div className="h-12 border-b border-gray-200 dark:border-gray-700"></div>
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-gray-100 dark:border-gray-800 px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          <div className="flex-1 flex overflow-x-auto">
            {weekDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isTodayDate = isToday(day);
              
              return (
                <div key={day.toISOString()} className="flex-1 min-w-[120px] border-r border-gray-200 dark:border-gray-700 last:border-r-0">
                  <div className={`h-12 px-2 py-2 text-center border-b border-gray-200 dark:border-gray-700 ${isTodayDate ? "bg-blue-50 dark:bg-blue-900" : ""}`}>
                    <div className="text-sm font-medium">{format(day, "EEE")}</div>
                    <div className={`text-xs ${isTodayDate ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
                      {format(day, "d")}
                    </div>
                  </div>
                  
                  <div className="relative">
                    {hours.map((hour) => (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className="h-16 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => {
                          const clickedDate = new Date(day);
                          clickedDate.setHours(hour, 0, 0, 0);
                          handleDateClick(clickedDate);
                        }}
                      >
                        {/* Hour events */}
                        {dayEvents
                          .filter(event => {
                            const eventHour = new Date(event.start).getHours();
                            return eventHour === hour;
                          })
                          .map(renderEvent)}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render day view with detailed time slots
  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const dayEvents = getEventsForDate(currentDate);
    const isTodayDate = isToday(currentDate);
    
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`} style={{ height }}>
        {/* Day header */}
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${isTodayDate ? "bg-blue-50 dark:bg-blue-900" : ""}`}>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{format(currentDate, "EEEE", { locale: ptBR })}</div>
          <div className={`text-sm ${isTodayDate ? "text-blue-600 dark:text-blue-400 font-semibold" : "text-gray-500 dark:text-gray-400"}`}>
            {format(currentDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </div>
          {dayEvents.length > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {dayEvents.length} evento{dayEvents.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
        
        {/* Time slots */}
        <div className="overflow-y-auto" style={{ height: `calc(${height} - 80px)` }}>
          {hours.map((hour) => {
            const hourEvents = dayEvents.filter(event => {
              const eventHour = new Date(event.start).getHours();
              return eventHour === hour;
            });
            
            return (
              <div key={hour} className="flex border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="w-20 px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                  {format(new Date().setHours(hour, 0, 0, 0), "HH:mm")}
                </div>
                <div
                  className="flex-1 p-2 cursor-pointer min-h-16"
                  onClick={() => {
                    const clickedDate = new Date(currentDate);
                    clickedDate.setHours(hour, 0, 0, 0);
                    handleDateClick(clickedDate);
                  }}
                >
                  {hourEvents.map(renderEvent)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render agenda view with event list
  const renderAgendaView = () => {
    const sortedEvents = [...visibleEvents].sort((a, b) => 
      new Date(a.start).getTime() - new Date(b.start).getTime()
    );
    
    return (
      <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isDarkMode ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`} style={{ height }}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Agenda</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {sortedEvents.length} evento{sortedEvents.length !== 1 ? "s" : ""} encontrado{sortedEvents.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
            </div>
          </div>
        </div>
        
        <div className="overflow-y-auto" style={{ height: `calc(${height} - 80px)` }}>
          {sortedEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum evento encontrado</p>
              <p className="text-sm mt-2">Clique em &quot;Novo Evento&quot; para criar um</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedEvents.map((event) => {
                const eventColor = event.color || config.theme.colors.eventColors.blue;
                const resourceName = resources.find(r => r.id === event.resourceId)?.name;
                
                return (
                  <div
                    key={event.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                    onClick={() => handleEditEvent(event)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: eventColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-white">{event.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {format(new Date(event.start), "d 'de' MMM, HH:mm", { locale: ptBR })} - 
                              {format(new Date(event.end), "HH:mm", { locale: ptBR })}
                            </div>
                            {event.description && (
                              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                                {event.description}
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                              {event.location && (
                                <span className="flex items-center gap-1">
                                  <FiMapPin className="w-3 h-3" />
                                  {event.location}
                                </span>
                              )}
                              {resourceName && (
                                <span className="flex items-center gap-1">
                                  <FiUsers className="w-3 h-3" />
                                  {resourceName}
                                </span>
                              )}
                              {event.priority && (
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  event.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  event.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {event.priority === 'high' ? 'Alta' : event.priority === 'medium' ? 'Média' : 'Baixa'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              event.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              event.status === 'tentative' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {event.status === 'confirmed' ? 'Confirmado' : 
                               event.status === 'tentative' ? 'Tentativo' : 'Cancelado'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "month":
        return renderMonthView();
      case "week":
        return renderWeekView();
      case "day":
        return renderDayView();
      case "agenda":
        return renderAgendaView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className={`calendar-view ${className} ${isDarkMode ? 'dark' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Período anterior"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleToday}
            className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Hoje
          </button>
          
          <button
            onClick={handleNext}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Próximo período"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
          
          <h2 className="text-lg sm:text-xl font-semibold ml-4 text-gray-900 dark:text-white">
            {currentMonthYear}
          </h2>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          {/* View type buttons - responsive */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {Object.entries(viewTypeLabels).map(([view, label]) => (
              <button
                key={view}
                onClick={() => handleViewChange(view as CalendarViewType)}
                className={`
                  px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors duration-200
                  ${currentView === view 
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  }
                `}
                title={label}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.charAt(0)}</span>
              </button>
            ))}
          </div>
          
          {/* Dark mode toggle */}
          {enableDarkMode && (
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title={isDarkMode ? "Tema claro" : "Tema escuro"}
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
          )}
          
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
              >
                <FiX className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          
          {/* Filters */}
          {enableFilters && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showFilters ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Filtros"
            >
              <FiFilter className="w-5 h-5" />
            </button>
          )}
          
          {/* Resources */}
          {enableResources && (
            <button
              onClick={() => setShowResources(!showResources)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                showResources ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              title="Recursos"
            >
              <FiUsers className="w-5 h-5" />
            </button>
          )}
          
          {/* Export */}
          {enableExport && (
            <div className="relative group">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                <FiDownload className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <button
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                >
                  Exportar JSON
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Exportar CSV
                </button>
                <button
                  onClick={() => handleExport('ics')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                >
                  Exportar iCal
                </button>
              </div>
            </div>
          )}
          
          {/* Refresh */}
          <button
            onClick={() => {/* Refresh logic */}}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            title="Atualizar"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
          
          {/* Create event */}
          {enableCreate && (
            <button
              onClick={handleCreateEvent}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
            >
              <FiPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Evento</span>
              <span className="sm:hidden">Novo</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Filters panel */}
      {enableFilters && showFilters && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filtros</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              <FiX className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                onChange={(e) => {
                  if (e.target.value) {
                    setFilters({ ...filters, status: [e.target.value as any] });
                  } else {
                    const { status, ...rest } = filters;
                    setFilters(rest);
                  }
                }}
              >
                <option value="">Todos</option>
                <option value="confirmed">Confirmado</option>
                <option value="tentative">Tentativo</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Prioridade</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                onChange={(e) => {
                  if (e.target.value) {
                    setFilters({ ...filters, priority: [e.target.value as any] });
                  } else {
                    const { priority, ...rest } = filters;
                    setFilters(rest);
                  }
                }}
              >
                <option value="">Todas</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>

            {/* Resource */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recurso</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                onChange={(e) => {
                  if (e.target.value) {
                    setFilters({ ...filters, resourceIds: [e.target.value] });
                  } else {
                    const { resourceIds, ...rest } = filters;
                    setFilters(rest);
                  }
                }}
              >
                <option value="">Todos</option>
                {resources.map(resource => (
                  <option key={resource.id} value={resource.id}>{resource.name}</option>
                ))}
              </select>
            </div>

            {/* Date range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Período</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) => {
                    if (e.target.value) {
                      const startDate = new Date(e.target.value);
                      const endDate = filters.dateRange?.end || new Date();
                      setFilters({ 
                        ...filters, 
                        dateRange: { start: startDate, end: endDate } 
                      });
                    }
                  }}
                />
                <input
                  type="date"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  onChange={(e) => {
                    if (e.target.value) {
                      const startDate = filters.dateRange?.start || new Date();
                      const endDate = new Date(e.target.value);
                      setFilters({ 
                        ...filters, 
                        dateRange: { start: startDate, end: endDate } 
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <button
            onClick={() => clearFilters()}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              Limpar Filtros
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
      
      {/* Resources panel */}
      {enableResources && showResources && (
        <div className="mb-4">
          <CalendarResourceManager
            resources={resources}
            onResourcesChange={(nextResources) => setResources(nextResources)}
            className={isDarkMode ? 'dark' : ''}
          />
        </div>
      )}
      
      {/* Calendar content */}
      <div className="calendar-content">
        {renderCurrentView()}
      </div>

      {/* Event Modal */}
      <CalendarEventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
          setSelectedDate(null);
        }}
        onSave={handleSaveEvent}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
        event={selectedEvent}
        selectedDate={selectedDate || undefined}
        mode={selectedEvent ? "edit" : "create"}
      />
    </div>
  );
}
