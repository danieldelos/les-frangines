import { CalendarEvent, CalendarResource, CalendarApiResponse } from "@/types/calendar";
import { api } from "./api";

// Types auxiliares para payloads da API (datas como string ISO)
export interface CalendarEventCreateData {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string;
  resourceIds?: string[];
  status?: "confirmed" | "tentative" | "cancelled";
  color?: string;
  textColor?: string;
  location?: string;
  attendees?: Array<{
    id: string;
    name: string;
    email: string;
    status?: "accepted" | "declined" | "tentative" | "needs-action";
  }>;
  tags?: string[];
  priority?: "low" | "medium" | "high";
  isPrivate?: boolean;
}

type CalendarEventCreatePayload = Omit<CalendarEventCreateData, 'start' | 'end'> & {
  start: string;
  end: string;
};

export interface CalendarEventUpdateData {
  id: string;
  title?: string;
  description?: string;
  start?: Date;
  end?: Date;
  allDay?: boolean;
  resourceId?: string;
  resourceIds?: string[];
  status?: "confirmed" | "tentative" | "cancelled";
  color?: string;
  textColor?: string;
  location?: string;
  attendees?: Array<{
    id: string;
    name: string;
    email: string;
    status?: "accepted" | "declined" | "tentative" | "needs-action";
  }>;
  tags?: string[];
  priority?: "low" | "medium" | "high";
  isPrivate?: boolean;
}

type CalendarEventUpdatePayload = Omit<Partial<CalendarEventUpdateData>, 'start' | 'end' | 'id'> & {
  start?: string;
  end?: string;
};

export interface CalendarFilters {
  startDate?: Date;
  endDate?: Date;
  resourceIds?: string[];
  status?: ("confirmed" | "tentative" | "cancelled")[];
  searchTerm?: string;
  tags?: string[];
  priority?: ("low" | "medium" | "high")[];
}

// Helper para construir query params
function buildCalendarFiltersParams(filters?: CalendarFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (!filters) return params;

  if (filters.startDate) params.append("start", filters.startDate.toISOString());
  if (filters.endDate) params.append("end", filters.endDate.toISOString());
  if (filters.resourceIds?.length) filters.resourceIds.forEach(id => params.append("resourceIds", id));
  if (filters.status?.length) filters.status.forEach(status => params.append("status", status));
  if (filters.priority?.length) filters.priority.forEach(priority => params.append("priority", priority));
  if (filters.tags?.length) filters.tags.forEach(tag => params.append("tags", tag));
  if (filters.searchTerm) params.append("search", filters.searchTerm);
  
  return params;
}

// Helper para converter datas do payload
function toEventPayload(event: CalendarEventCreateData): CalendarEventCreatePayload {
  return {
    ...event,
    start: event.start.toISOString(),
    end: event.end.toISOString()
  };
}

function toUpdatePayload(data: Partial<CalendarEventUpdateData>): CalendarEventUpdatePayload {
  const payload: CalendarEventUpdatePayload = {};
  Object.keys(data).forEach(key => {
    if (key !== 'id' && key !== 'start' && key !== 'end') {
      (payload as any)[key] = (data as any)[key];
    }
  });
  if (data.start) payload.start = data.start.toISOString();
  if (data.end) payload.end = data.end.toISOString();
  delete (payload as any).id; // Remove id do body, pois vai na URL
  return payload;
}

class CalendarService {
  private baseUrl = "/calendar";

  async getEvents(filters?: CalendarFilters): Promise<CalendarApiResponse<CalendarEvent[]>> {
    const params = buildCalendarFiltersParams(filters);
    const response = await api.get<CalendarApiResponse<CalendarEvent[]>>(
      `${this.baseUrl}/events?${params.toString()}`
    );
    return response.data;
  }

  async getEvent(id: string): Promise<CalendarApiResponse<CalendarEvent>> {
    const response = await api.get<CalendarApiResponse<CalendarEvent>>(
      `${this.baseUrl}/events/${id}`
    );
    return response.data;
  }

  async createEvent(data: CalendarEventCreateData): Promise<CalendarApiResponse<CalendarEvent>> {
    const response = await api.post<CalendarApiResponse<CalendarEvent>>(
      `${this.baseUrl}/events`,
      toEventPayload(data)
    );
    return response.data;
  }

  async updateEvent(id: string, data: Partial<Omit<CalendarEventUpdateData, 'id'>>): Promise<CalendarApiResponse<CalendarEvent>> {
    const response = await api.put<CalendarApiResponse<CalendarEvent>>(
      `${this.baseUrl}/events/${id}`,
      toUpdatePayload(data)
    );
    return response.data;
  }

  async deleteEvent(id: string): Promise<CalendarApiResponse<void>> {
    const response = await api.delete<CalendarApiResponse<void>>(
      `${this.baseUrl}/events/${id}`
    );
    return response.data;
  }

  async moveEvent(eventId: string, newStart: Date, newEnd: Date, newResourceId?: string): Promise<CalendarApiResponse<CalendarEvent>> {
    const response = await api.post<CalendarApiResponse<CalendarEvent>>(
      `${this.baseUrl}/events/${eventId}/move`,
      {
        newStart: newStart.toISOString(),
        newEnd: newEnd.toISOString(),
        newResourceId
      }
    );
    return response.data;
  }

  async resizeEvent(eventId: string, newStart: Date, newEnd: Date): Promise<CalendarApiResponse<CalendarEvent>> {
    const response = await api.post<CalendarApiResponse<CalendarEvent>>(
      `${this.baseUrl}/events/${eventId}/resize`,
      {
        newStart: newStart.toISOString(),
        newEnd: newEnd.toISOString()
      }
    );
    return response.data;
  }

  // Resource methods
  async getResources(): Promise<CalendarApiResponse<CalendarResource[]>> {
    const response = await api.get<CalendarApiResponse<CalendarResource[]>>(
      `${this.baseUrl}/resources`
    );
    return response.data;
  }

  async getResource(id: string): Promise<CalendarApiResponse<CalendarResource>> {
    const response = await api.get<CalendarApiResponse<CalendarResource>>(
      `${this.baseUrl}/resources/${id}`
    );
    return response.data;
  }

  async createResource(data: Omit<CalendarResource, "id">): Promise<CalendarApiResponse<CalendarResource>> {
    const response = await api.post<CalendarApiResponse<CalendarResource>>(
      `${this.baseUrl}/resources`,
      data
    );
    return response.data;
  }

  async updateResource(id: string, data: Partial<CalendarResource>): Promise<CalendarApiResponse<CalendarResource>> {
    const response = await api.put<CalendarApiResponse<CalendarResource>>(
      `${this.baseUrl}/resources/${id}`,
      data
    );
    return response.data;
  }

  async deleteResource(id: string): Promise<CalendarApiResponse<void>> {
    const response = await api.delete<CalendarApiResponse<void>>(
      `${this.baseUrl}/resources/${id}`
    );
    return response.data;
  }

  // Bulk operations
  async bulkCreateEvents(events: CalendarEventCreateData[]): Promise<CalendarApiResponse<CalendarEvent[]>> {
    const response = await api.post<CalendarApiResponse<CalendarEvent[]>>(
      `${this.baseUrl}/events/bulk`,
      events.map(toEventPayload)
    );
    return response.data;
  }

  async bulkUpdateEvents(events: CalendarEventUpdateData[]): Promise<CalendarApiResponse<CalendarEvent[]>> {
    const response = await api.put<CalendarApiResponse<CalendarEvent[]>>(
      `${this.baseUrl}/events/bulk`,
      events.map(({ id, ...rest }) => ({ id, ...toUpdatePayload(rest) }))
    );
    return response.data;
  }

  async bulkDeleteEvents(eventIds: string[]): Promise<CalendarApiResponse<void>> {
    // ✅ Alterado para POST para evitar problemas com body em DELETE
    const response = await api.post<CalendarApiResponse<void>>(
      `${this.baseUrl}/events/bulk/delete`,
      { eventIds }
    );
    return response.data;
  }

  // Import/Export
  async exportEvents(format: 'json' | 'csv' | 'ics', filters?: CalendarFilters): Promise<Blob> {
    const params = buildCalendarFiltersParams(filters);
    params.append("format", format);

    const response = await api.get(
      `${this.baseUrl}/export?${params.toString()}`,
      { responseType: 'blob' }
    );
    return response.data;
  }

  async importEvents(file: File, options?: {
    overwrite?: boolean;
    skipDuplicates?: boolean;
  }): Promise<CalendarApiResponse<CalendarEvent[]>> {
    const formData = new FormData();
    formData.append("file", file);
    
    if (options?.overwrite !== undefined) {
      formData.append("overwrite", options.overwrite.toString());
    }
    if (options?.skipDuplicates !== undefined) {
      formData.append("skipDuplicates", options.skipDuplicates.toString());
    }

    const response = await api.post<CalendarApiResponse<CalendarEvent[]>>(
      `${this.baseUrl}/import`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  }

  // Statistics
  async getStatistics(filters?: CalendarFilters): Promise<CalendarApiResponse<{
    totalEvents: number;
    upcomingEvents: number;
    completedEvents: number;
    cancelledEvents: number;
    eventsByResource: Record<string, number>;
    eventsByStatus: Record<string, number>;
    eventsByPriority: Record<string, number>;
    busiestDay: { date: string; count: number };
  }>> {
    const params = buildCalendarFiltersParams(filters);
    const response = await api.get<CalendarApiResponse<{
      totalEvents: number;
      upcomingEvents: number;
      completedEvents: number;
      cancelledEvents: number;
      eventsByResource: Record<string, number>;
      eventsByStatus: Record<string, number>;
      eventsByPriority: Record<string, number>;
      busiestDay: { date: string; count: number };
    }>>(
      `${this.baseUrl}/statistics?${params.toString()}`
    );
    return response.data;
  }
}

export const calendarService = new CalendarService();
