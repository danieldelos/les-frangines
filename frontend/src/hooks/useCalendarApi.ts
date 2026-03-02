import { useState, useCallback, useEffect } from "react";
import { CalendarEvent, CalendarResource, CalendarFilters } from "@/types/calendar";
import { calendarService, CalendarEventCreateData, CalendarEventUpdateData } from "@/services/calendar";

interface UseCalendarApiOptions {
  autoFetch?: boolean;
  filters?: CalendarFilters;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

interface UseCalendarApiReturn {
  // Estado
  events: CalendarEvent[];
  resources: CalendarResource[];
  isLoading: boolean;
  error: Error | null;
  
  // Ações de eventos
  fetchEvents: (filters?: CalendarFilters) => Promise<void>;
  createEvent: (data: CalendarEventCreateData) => Promise<CalendarEvent | null>;
  updateEvent: (id: string, data: Partial<CalendarEventUpdateData>) => Promise<CalendarEvent | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  moveEvent: (id: string, newStart: Date, newEnd: Date, newResourceId?: string) => Promise<CalendarEvent | null>;
  resizeEvent: (id: string, newStart: Date, newEnd: Date) => Promise<CalendarEvent | null>;
  
  // Ações de recursos
  fetchResources: () => Promise<void>;
  createResource: (data: Omit<CalendarResource, "id">) => Promise<CalendarResource | null>;
  updateResource: (id: string, data: Partial<CalendarResource>) => Promise<CalendarResource | null>;
  deleteResource: (id: string) => Promise<boolean>;
  
  // Operações em lote
  bulkCreateEvents: (events: CalendarEventCreateData[]) => Promise<CalendarEvent[] | null>;
  bulkUpdateEvents: (events: CalendarEventUpdateData[]) => Promise<CalendarEvent[] | null>;
  bulkDeleteEvents: (eventIds: string[]) => Promise<boolean>;
  
  // Import/Export
  exportEvents: (format: 'json' | 'csv' | 'ics', filters?: CalendarFilters) => Promise<Blob | null>;
  importEvents: (file: File, options?: { overwrite?: boolean; skipDuplicates?: boolean }) => Promise<CalendarEvent[] | null>;
  
  // Estatísticas
  getStatistics: (filters?: CalendarFilters) => Promise<any | null>;
  
  // Utilidades
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useCalendarApi(options: UseCalendarApiOptions = {}): UseCalendarApiReturn {
  const { autoFetch = true, filters, onError, onSuccess } = options;
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [resources, setResources] = useState<CalendarResource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: Error) => {
    setError(err);
    onError?.(err);
  }, [onError]);

  const handleSuccess = useCallback((data: any) => {
    onSuccess?.(data);
  }, [onSuccess]);

  // Fetch events
  const fetchEvents = useCallback(async (fetchFilters?: CalendarFilters) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.getEvents(fetchFilters || filters);
      
      if (response.success && response.data) {
        setEvents(response.data);
        handleSuccess(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch events");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch events");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, handleError, handleSuccess]);

  // Create event
  const createEvent = useCallback(async (data: CalendarEventCreateData): Promise<CalendarEvent | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.createEvent(data);
      
      if (response.success && response.data) {
        setEvents(prev => [...prev, response.data!]);
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create event");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create event");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Update event
  const updateEvent = useCallback(async (id: string, data: Partial<CalendarEventUpdateData>): Promise<CalendarEvent | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.updateEvent(id, data);
      
      if (response.success && response.data) {
        setEvents(prev => prev.map(event => 
          event.id === id ? response.data! : event
        ));
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update event");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update event");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Delete event
  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.deleteEvent(id);
      
      if (response.success) {
        setEvents(prev => prev.filter(event => event.id !== id));
        handleSuccess({ id });
        return true;
      } else {
        throw new Error(response.error || "Failed to delete event");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete event");
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Move event
  const moveEvent = useCallback(async (id: string, newStart: Date, newEnd: Date, newResourceId?: string): Promise<CalendarEvent | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.moveEvent(id, newStart, newEnd, newResourceId);
      
      if (response.success && response.data) {
        setEvents(prev => prev.map(event => 
          event.id === id ? response.data! : event
        ));
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to move event");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to move event");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Resize event
  const resizeEvent = useCallback(async (id: string, newStart: Date, newEnd: Date): Promise<CalendarEvent | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.resizeEvent(id, newStart, newEnd);
      
      if (response.success && response.data) {
        setEvents(prev => prev.map(event => 
          event.id === id ? response.data! : event
        ));
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to resize event");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to resize event");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Fetch resources
  const fetchResources = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.getResources();
      
      if (response.success && response.data) {
        setResources(response.data);
        handleSuccess(response.data);
      } else {
        throw new Error(response.error || "Failed to fetch resources");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch resources");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Create resource
  const createResource = useCallback(async (data: Omit<CalendarResource, "id">): Promise<CalendarResource | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.createResource(data);
      
      if (response.success && response.data) {
        setResources(prev => [...prev, response.data!]);
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to create resource");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to create resource");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Update resource
  const updateResource = useCallback(async (id: string, data: Partial<CalendarResource>): Promise<CalendarResource | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.updateResource(id, data);
      
      if (response.success && response.data) {
        setResources(prev => prev.map(resource => 
          resource.id === id ? response.data! : resource
        ));
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to update resource");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to update resource");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Delete resource
  const deleteResource = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.deleteResource(id);
      
      if (response.success) {
        setResources(prev => prev.filter(resource => resource.id !== id));
        handleSuccess({ id });
        return true;
      } else {
        throw new Error(response.error || "Failed to delete resource");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to delete resource");
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Bulk create events
  const bulkCreateEvents = useCallback(async (eventsData: CalendarEventCreateData[]): Promise<CalendarEvent[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.bulkCreateEvents(eventsData);
      
      if (response.success && response.data) {
        setEvents(prev => [...prev, ...response.data!]);
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to bulk create events");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to bulk create events");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Bulk update events
  const bulkUpdateEvents = useCallback(async (eventsData: CalendarEventUpdateData[]): Promise<CalendarEvent[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.bulkUpdateEvents(eventsData);
      
      if (response.success && response.data) {
        setEvents(prev => {
          const updatedEvents = [...prev];
          response.data!.forEach(updatedEvent => {
            const index = updatedEvents.findIndex(e => e.id === updatedEvent.id);
            if (index !== -1) {
              updatedEvents[index] = updatedEvent;
            }
          });
          return updatedEvents;
        });
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to bulk update events");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to bulk update events");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Bulk delete events
  const bulkDeleteEvents = useCallback(async (eventIds: string[]): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.bulkDeleteEvents(eventIds);
      
      if (response.success) {
        setEvents(prev => prev.filter(event => !eventIds.includes(event.id)));
        handleSuccess({ eventIds });
        return true;
      } else {
        throw new Error(response.error || "Failed to bulk delete events");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to bulk delete events");
      handleError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Export events
  const exportEvents = useCallback(async (format: 'json' | 'csv' | 'ics', exportFilters?: CalendarFilters): Promise<Blob | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const blob = await calendarService.exportEvents(format, exportFilters || filters);
      handleSuccess(blob);
      return blob;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to export events");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [filters, handleError, handleSuccess]);

  // Import events
  const importEvents = useCallback(async (file: File, options?: { overwrite?: boolean; skipDuplicates?: boolean }): Promise<CalendarEvent[] | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.importEvents(file, options);
      
      if (response.success && response.data) {
        setEvents(prev => [...prev, ...response.data!]);
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to import events");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to import events");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, handleSuccess]);

  // Get statistics
  const getStatistics = useCallback(async (statsFilters?: CalendarFilters): Promise<any | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.getStatistics(statsFilters || filters);
      
      if (response.success && response.data) {
        handleSuccess(response.data);
        return response.data;
      } else {
        throw new Error(response.error || "Failed to get statistics");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to get statistics");
      handleError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [filters, handleError, handleSuccess]);

  // Refresh data
  const refresh = useCallback(async (): Promise<void> => {
    await Promise.all([
      fetchEvents(),
      fetchResources()
    ]);
  }, [fetchEvents, fetchResources]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      refresh();
    }
  }, [autoFetch, refresh]);

  return {
    // Estado
    events,
    resources,
    isLoading,
    error,
    
    // Ações de eventos
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    moveEvent,
    resizeEvent,
    
    // Ações de recursos
    fetchResources,
    createResource,
    updateResource,
    deleteResource,
    
    // Operações em lote
    bulkCreateEvents,
    bulkUpdateEvents,
    bulkDeleteEvents,
    
    // Import/Export
    exportEvents,
    importEvents,
    
    // Estatísticas
    getStatistics,
    
    // Utilidades
    refresh,
    clearError
  };
}
