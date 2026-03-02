import { useState, useCallback, useMemo, useEffect } from "react";
import { create } from "zustand";
import { useShallow } from "zustand/shallow";
import { 
  CalendarEvent, 
  CalendarResource, 
  CalendarViewType, 
  CalendarConfig, 
  CalendarFilters,
  CalendarTheme,
  CalendarDragDropEvent,
  CalendarResizeEvent,
  CalendarClickEvent
} from "@/types/calendar";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, isSameDay, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CalendarState {
  events: CalendarEvent[];
  resources: CalendarResource[];
  currentView: CalendarViewType;
  currentDate: Date;
  selectedEvent: CalendarEvent | null;
  isLoading: boolean;
  error: string | null;
  filters: CalendarFilters;
  config: CalendarConfig;
  isCreating: boolean;
  isEditing: boolean;
  showEventModal: boolean;
  draggedEvent: CalendarEvent | null;
  isDarkMode: boolean;
}

interface CalendarActions {
  setEvents: (events: CalendarEvent[]) => void;
  setResources: (resources: CalendarResource[]) => void;
  setCurrentView: (view: CalendarViewType) => void;
  setCurrentDate: (date: Date) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: CalendarFilters) => void;
  setConfig: (config: Partial<CalendarConfig>) => void;
  setIsCreating: (creating: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setShowEventModal: (show: boolean) => void;
  setDraggedEvent: (event: CalendarEvent | null) => void;
  setIsDarkMode: (dark: boolean) => void;
  
  // Event actions
  createEvent: (event: Omit<CalendarEvent, "id">) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  moveEvent: (dragDropEvent: CalendarDragDropEvent) => Promise<void>;
  resizeEvent: (resizeEvent: CalendarResizeEvent) => Promise<void>;
  
  // Filter actions
  filterEvents: () => CalendarEvent[];
  clearFilters: () => void;
  
  // Navigation
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  
  // View helpers
  getViewDateRange: () => { start: Date; end: Date };
  getEventsForDate: (date: Date) => CalendarEvent[];
  getEventsForResource: (resourceId: string) => CalendarEvent[];
}

const toComparableTime = (value: unknown) => {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string" || typeof value === "number") {
    const time = new Date(value).getTime();
    return Number.isNaN(time) ? value : time;
  }
  return value;
};

const arrayEqual = (left?: string[], right?: string[]) => {
  if (!left && !right) return true;
  if (!left || !right) return false;
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    if (left[i] !== right[i]) return false;
  }
  return true;
};

const dateRangeEqual = (left?: { start: Date; end: Date }, right?: { start: Date; end: Date }) => {
  if (!left && !right) return true;
  if (!left || !right) return false;
  return (
    toComparableTime(left.start) === toComparableTime(right.start) &&
    toComparableTime(left.end) === toComparableTime(right.end)
  );
};

const filtersEqual = (left: CalendarFilters, right: CalendarFilters) => {
  if (left === right) return true;
  return (
    arrayEqual(left.resourceIds, right.resourceIds) &&
    arrayEqual(left.status as string[] | undefined, right.status as string[] | undefined) &&
    arrayEqual(left.tags, right.tags) &&
    arrayEqual(left.priority as string[] | undefined, right.priority as string[] | undefined) &&
    arrayEqual(left.attendees, right.attendees) &&
    left.searchTerm === right.searchTerm &&
    dateRangeEqual(left.dateRange, right.dateRange)
  );
};

const configEqual = (left: CalendarConfig, right: CalendarConfig) => {
  if (left === right) return true;
  return (
    left.defaultView === right.defaultView &&
    left.firstDayOfWeek === right.firstDayOfWeek &&
    left.businessHours.start === right.businessHours.start &&
    left.businessHours.end === right.businessHours.end &&
    arrayEqual(left.businessHours.daysOfWeek.map(String), right.businessHours.daysOfWeek.map(String)) &&
    left.slotDuration === right.slotDuration &&
    left.slotMinTime === right.slotMinTime &&
    left.slotMaxTime === right.slotMaxTime &&
    left.locale === right.locale &&
    left.timeZone === right.timeZone &&
    left.showWeekNumbers === right.showWeekNumbers &&
    left.showNonBusinessHours === right.showNonBusinessHours &&
    left.snapToSlots === right.snapToSlots &&
    left.allowEventOverlap === right.allowEventOverlap &&
    left.maxEventsPerDay === right.maxEventsPerDay &&
    left.eventMinHeight === right.eventMinHeight &&
    left.eventMaxHeight === right.eventMaxHeight &&
    left.enableDragDrop === right.enableDragDrop &&
    left.enableResize === right.enableResize &&
    left.enableCreate === right.enableCreate &&
    left.enableEdit === right.enableEdit &&
    left.enableDelete === right.enableDelete &&
    left.theme.id === right.theme.id &&
    left.theme.isDark === right.theme.isDark
  );
};

const eventsEqual = (left: CalendarEvent[], right: CalendarEvent[]) => {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    const a = left[i];
    const b = right[i];
    if (a.id !== b.id) return false;
    if (toComparableTime(a.start) !== toComparableTime(b.start)) return false;
    if (toComparableTime(a.end) !== toComparableTime(b.end)) return false;
    if (a.status !== b.status) return false;
    if (a.title !== b.title) return false;
    if (toComparableTime(a.updatedAt) !== toComparableTime(b.updatedAt)) return false;
    if (a.resourceId !== b.resourceId) return false;
    if (!arrayEqual(a.resourceIds, b.resourceIds)) return false;
  }
  return true;
};

const resourcesEqual = (left: CalendarResource[], right: CalendarResource[]) => {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    const a = left[i];
    const b = right[i];
    if (a.id !== b.id) return false;
    if (a.name !== b.name) return false;
    if (a.type !== b.type) return false;
    if (a.color !== b.color) return false;
    if (a.textColor !== b.textColor) return false;
    if (a.isActive !== b.isActive) return false;
  }
  return true;
};

const defaultTheme: CalendarTheme = {
  id: "default",
  name: "Padrão",
  isDark: false,
  colors: {
    primary: "rgb(59, 130, 246)", // blue-500
    secondary: "rgb(147, 197, 253)", // blue-300
    background: "rgb(255, 255, 255)",
    surface: "rgb(249, 250, 251)",
    text: "rgb(17, 24, 39)",
    textSecondary: "rgb(107, 114, 128)",
    border: "rgb(229, 231, 235)",
    eventColors: {
      blue: "rgb(59, 130, 246)",
      green: "rgb(34, 197, 94)",
      red: "rgb(239, 68, 68)",
      yellow: "rgb(234, 179, 8)",
      purple: "rgb(147, 51, 234)",
      pink: "rgb(236, 72, 153)",
      indigo: "rgb(99, 102, 241)",
      gray: "rgb(107, 114, 128)"
    }
  }
};

const darkTheme: CalendarTheme = {
  id: "dark",
  name: "Escuro",
  isDark: true,
  colors: {
    primary: "rgb(59, 130, 246)",
    secondary: "rgb(96, 165, 250)",
    background: "rgb(17, 24, 39)",
    surface: "rgb(31, 41, 55)",
    text: "rgb(243, 244, 246)",
    textSecondary: "rgb(156, 163, 175)",
    border: "rgb(55, 65, 81)",
    eventColors: {
      blue: "rgb(59, 130, 246)",
      green: "rgb(34, 197, 94)",
      red: "rgb(239, 68, 68)",
      yellow: "rgb(234, 179, 8)",
      purple: "rgb(147, 51, 234)",
      pink: "rgb(236, 72, 153)",
      indigo: "rgb(99, 102, 241)",
      gray: "rgb(156, 163, 175)"
    }
  }
};

const defaultConfig: CalendarConfig = {
  defaultView: "month",
  firstDayOfWeek: 0, // Sunday
  businessHours: {
    start: "09:00",
    end: "18:00",
    daysOfWeek: [1, 2, 3, 4, 5] // Monday to Friday
  },
  slotDuration: 30, // minutes
  slotMinTime: "00:00",
  slotMaxTime: "24:00",
  theme: defaultTheme,
  locale: "pt-BR",
  timeZone: "America/Sao_Paulo",
  showWeekNumbers: false,
  showNonBusinessHours: true,
  snapToSlots: true,
  allowEventOverlap: false,
  maxEventsPerDay: 5,
  eventMinHeight: 24,
  eventMaxHeight: 120,
  enableDragDrop: true,
  enableResize: true,
  enableCreate: true,
  enableEdit: true,
  enableDelete: true
};

export const useCalendarStore = create<CalendarState & CalendarActions>((set, get) => ({
  // Initial state
  events: [],
  resources: [],
  currentView: "month",
  currentDate: new Date(),
  selectedEvent: null,
  isLoading: false,
  error: null,
  filters: {},
  config: defaultConfig,
  isCreating: false,
  isEditing: false,
  showEventModal: false,
  draggedEvent: null,
  isDarkMode: false,

  // Actions
  setEvents: (events) => set((state) => (eventsEqual(state.events, events) ? state : { events })),
  setResources: (resources) => set((state) => (resourcesEqual(state.resources, resources) ? state : { resources })),
  setCurrentView: (currentView) => set((state) => (state.currentView === currentView ? state : { currentView })),
  setCurrentDate: (currentDate) =>
    set((state) =>
      toComparableTime(state.currentDate) === toComparableTime(currentDate) ? state : { currentDate }
    ),
  setSelectedEvent: (selectedEvent) =>
    set((state) => (state.selectedEvent === selectedEvent ? state : { selectedEvent })),
  setLoading: (isLoading) => set((state) => (state.isLoading === isLoading ? state : { isLoading })),
  setError: (error) => set((state) => (state.error === error ? state : { error })),
  setFilters: (filters) => set((state) => (filtersEqual(state.filters, filters) ? state : { filters })),
  setConfig: (config) =>
    set((state) => {
      const nextConfig = { ...state.config, ...config };
      return configEqual(state.config, nextConfig) ? state : { config: nextConfig };
    }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setShowEventModal: (showEventModal) => set({ showEventModal }),
  setDraggedEvent: (draggedEvent) => set({ draggedEvent }),
  setIsDarkMode: (isDarkMode) => set((state) => {
    if (state.isDarkMode === isDarkMode) return state;
    return {
      isDarkMode,
      config: {
        ...state.config,
        theme: isDarkMode ? darkTheme : defaultTheme
      }
    };
  }),

  // Event actions
  createEvent: async (eventData) => {
    const { events } = get();
    const newEvent: CalendarEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    set({ events: [...events, newEvent] });
  },

  updateEvent: async (id, updates) => {
    const { events } = get();
    const updatedEvents = events.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date() }
        : event
    );
    
    set({ events: updatedEvents });
  },

  deleteEvent: async (id) => {
    const { events } = get();
    const filteredEvents = events.filter(event => event.id !== id);
    set({ events: filteredEvents });
  },

  moveEvent: async (dragDropEvent) => {
    const { event, newStart, newEnd, newResourceId } = dragDropEvent;
    
    await get().updateEvent(event.id, {
      start: newStart,
      end: newEnd,
      resourceId: newResourceId,
      resourceIds: newResourceId ? [newResourceId] : undefined
    });
  },

  resizeEvent: async (resizeEvent) => {
    const { event, newStart, newEnd } = resizeEvent;
    
    const updates: Partial<CalendarEvent> = {};
    if (newStart) updates.start = newStart;
    if (newEnd) updates.end = newEnd;
    
    await get().updateEvent(event.id, updates);
  },

  // Filter actions
  filterEvents: () => {
    const { events, filters } = get();
    
    return events.filter(event => {
      // Filter by resource
      if (filters.resourceIds?.length && !filters.resourceIds.includes(event.resourceId || "")) {
        return false;
      }
      
      // Filter by status
      if (filters.status?.length && !filters.status.includes(event.status)) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange) {
        const eventStart = new Date(event.start);
        const eventEnd = new Date(event.end);
        const rangeStart = new Date(filters.dateRange.start);
        const rangeEnd = new Date(filters.dateRange.end);
        
        if (!isWithinInterval(eventStart, { start: rangeStart, end: rangeEnd }) &&
            !isWithinInterval(eventEnd, { start: rangeStart, end: rangeEnd })) {
          return false;
        }
      }
      
      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const titleMatch = event.title.toLowerCase().includes(searchLower);
        const descriptionMatch = event.description?.toLowerCase().includes(searchLower);
        const locationMatch = event.location?.toLowerCase().includes(searchLower);
        
        if (!titleMatch && !descriptionMatch && !locationMatch) {
          return false;
        }
      }
      
      // Filter by tags
      if (filters.tags?.length) {
        const hasMatchingTag = filters.tags.some(tag => event.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }
      
      // Filter by priority
      if (filters.priority?.length && !filters.priority.includes(event.priority || "medium")) {
        return false;
      }
      
      return true;
    });
  },

  clearFilters: () => {
    set({ filters: {} });
  },

  // Navigation
  navigatePrevious: () => {
    const { currentView, currentDate } = get();
    let newDate = new Date(currentDate);
    
    switch (currentView) {
      case "day":
        newDate = addDays(newDate, -1);
        break;
      case "week":
        newDate = addDays(newDate, -7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "agenda":
        newDate = addDays(newDate, -7);
        break;
    }
    
    set({ currentDate: newDate });
  },

  navigateNext: () => {
    const { currentView, currentDate } = get();
    let newDate = new Date(currentDate);
    
    switch (currentView) {
      case "day":
        newDate = addDays(newDate, 1);
        break;
      case "week":
        newDate = addDays(newDate, 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "agenda":
        newDate = addDays(newDate, 7);
        break;
    }
    
    set({ currentDate: newDate });
  },

  navigateToday: () => {
    set({ currentDate: new Date() });
  },

  // View helpers
  getViewDateRange: () => {
    const { currentView, currentDate, config } = get();
    const firstDayOfWeek = config?.firstDayOfWeek ?? 0;
    
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
        const end = addDays(start, 30); // Show next 30 days
        return { start, end };
      default:
        return { start: currentDate, end: currentDate };
    }
  },

  getEventsForDate: (date) => {
    const { events, filters } = get();
    
    return events.filter(event => {
      // Apply filters manually
      if (filters.resourceIds?.length && !filters.resourceIds.includes(event.resourceId || "")) {
        return false;
      }
      if (filters.status?.length && !filters.status.includes(event.status)) {
        return false;
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const titleMatch = event.title.toLowerCase().includes(searchLower);
        const descriptionMatch = event.description?.toLowerCase().includes(searchLower);
        const locationMatch = event.location?.toLowerCase().includes(searchLower);
        if (!titleMatch && !descriptionMatch && !locationMatch) {
          return false;
        }
      }
      if (filters.tags?.length) {
        const hasMatchingTag = filters.tags.some(tag => event.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }
      if (filters.priority?.length && !filters.priority.includes(event.priority || "medium")) {
        return false;
      }
      
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, date);
    });
  },

  getEventsForResource: (resourceId) => {
    const { events, filters } = get();
    
    return events.filter(event => {
      // Apply filters manually
      if (filters.resourceIds?.length && !filters.resourceIds.includes(event.resourceId || "")) {
        return false;
      }
      if (filters.status?.length && !filters.status.includes(event.status)) {
        return false;
      }
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const titleMatch = event.title.toLowerCase().includes(searchLower);
        const descriptionMatch = event.description?.toLowerCase().includes(searchLower);
        const locationMatch = event.location?.toLowerCase().includes(searchLower);
        if (!titleMatch && !descriptionMatch && !locationMatch) {
          return false;
        }
      }
      if (filters.tags?.length) {
        const hasMatchingTag = filters.tags.some(tag => event.tags?.includes(tag));
        if (!hasMatchingTag) return false;
      }
      if (filters.priority?.length && !filters.priority.includes(event.priority || "medium")) {
        return false;
      }
      
      return event.resourceId === resourceId || 
             event.resourceIds?.includes(resourceId);
    });
  }
}));

// Hook principal para uso do calendário
export function useCalendar() {
  const store = useCalendarStore();
  
  // Initialize with Portuguese locale
  useEffect(() => {
    if (store.config.locale === "pt-BR") {
      // Set up Portuguese locale for date-fns
      // This would typically be done at app level, but included here for completeness
    }
  }, [store.config.locale]);
  
  return store;
}

// Hook para acessar apenas partes específicas do estado
export function useCalendarEvents() {
  return useCalendarStore(useShallow((state) => ({
    events: state.events,
    setEvents: state.setEvents,
    createEvent: state.createEvent,
    updateEvent: state.updateEvent,
    deleteEvent: state.deleteEvent,
    moveEvent: state.moveEvent,
    resizeEvent: state.resizeEvent,
    filterEvents: state.filterEvents
  })));
}

export function useCalendarResources() {
  return useCalendarStore(useShallow((state) => ({
    resources: state.resources,
    setResources: state.setResources
  })));
}

export function useCalendarSetEvents() {
  return useCalendarStore((state) => state.setEvents);
}

export function useCalendarSetResources() {
  return useCalendarStore((state) => state.setResources);
}

export function useCalendarResourcesState() {
  return useCalendarStore((state) => state.resources);
}

export function useCalendarFiltersState() {
  return useCalendarStore((state) => state.filters);
}

export function useCalendarSetFilters() {
  return useCalendarStore((state) => state.setFilters);
}

export function useCalendarClearFilters() {
  return useCalendarStore((state) => state.clearFilters);
}

export function useCalendarConfig() {
  return useCalendarStore((state) => state.config);
}

export function useCalendarGetViewDateRange() {
  return useCalendarStore((state) => state.getViewDateRange);
}

export function useCalendarIsDarkMode() {
  return useCalendarStore((state) => state.isDarkMode);
}

export function useCalendarSetIsDarkMode() {
  return useCalendarStore((state) => state.setIsDarkMode);
}

export function useCalendarView() {
  return useCalendarStore(useShallow((state) => ({
    currentView: state.currentView,
    currentDate: state.currentDate,
    setCurrentView: state.setCurrentView,
    setCurrentDate: state.setCurrentDate,
    navigatePrevious: state.navigatePrevious,
    navigateNext: state.navigateNext,
    navigateToday: state.navigateToday,
    getViewDateRange: state.getViewDateRange
  })));
}

export function useCalendarFilters() {
  return useCalendarStore(useShallow((state) => ({
    filters: state.filters,
    setFilters: state.setFilters,
    clearFilters: state.clearFilters
  })));
}

export function useCalendarTheme() {
  return useCalendarStore(useShallow((state) => ({
    isDarkMode: state.isDarkMode,
    config: state.config,
    setIsDarkMode: state.setIsDarkMode,
    setConfig: state.setConfig
  })));
}
