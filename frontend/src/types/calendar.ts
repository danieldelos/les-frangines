export type CalendarViewType = "month" | "week" | "day" | "agenda";

export type CalendarEventStatus = "confirmed" | "tentative" | "cancelled";

export interface CalendarResource {
  id: string;
  name: string;
  color: string;
  textColor?: string;
  description?: string;
  capacity?: number;
  type?: "room" | "person" | "equipment";
  email?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  workingHours?: {
    start: string; // "09:00"
    end: string;   // "18:00"
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resourceId?: string;
  resourceIds?: string[];
  status: CalendarEventStatus;
  color?: string;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
  className?: string;
  editable?: boolean;
  deletable?: boolean;
  draggable?: boolean;
  resizable?: boolean;
  recurrence?: {
    rule: string; // RRULE format
    exceptions?: Date[];
  };
  attendees?: CalendarAttendee[];
  location?: string;
  url?: string;
  attachments?: CalendarAttachment[];
  reminders?: CalendarReminder[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
  isPrivate?: boolean;
  rrule?: string;
  exdate?: Date[];
}

export interface CalendarAttendee {
  id: string;
  name: string;
  email: string;
  status?: "accepted" | "declined" | "tentative" | "needs-action";
  isOrganizer?: boolean;
  isOptional?: boolean;
  response?: string;
}

export interface CalendarAttachment {
  id: string;
  name: string;
  url: string;
  size?: number;
  type?: string;
}

export interface CalendarReminder {
  id: string;
  type: "popup" | "email" | "sms";
  minutes: number; // minutes before event
  isActive?: boolean;
}

export interface CalendarTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    eventColors: Record<string, string>;
  };
  isDark?: boolean;
}

export interface CalendarConfig {
  defaultView: CalendarViewType;
  firstDayOfWeek: number; // 0-6 (Sunday-Saturday)
  businessHours: {
    start: string; // "09:00"
    end: string;   // "18:00"
    daysOfWeek: number[];
  };
  slotDuration: number; // minutes
  slotMinTime: string; // "00:00"
  slotMaxTime: string; // "24:00"
  theme: CalendarTheme;
  locale: string;
  timeZone: string;
  showWeekNumbers?: boolean;
  showNonBusinessHours?: boolean;
  snapToSlots?: boolean;
  allowEventOverlap?: boolean;
  maxEventsPerDay?: number;
  eventMinHeight?: number;
  eventMaxHeight?: number;
  enableDragDrop?: boolean;
  enableResize?: boolean;
  enableCreate?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
}

export interface CalendarFilters {
  resourceIds?: string[];
  status?: CalendarEventStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchTerm?: string;
  tags?: string[];
  priority?: ("low" | "medium" | "high")[];
  attendees?: string[];
}

export interface CalendarApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CalendarDragDropEvent {
  event: CalendarEvent;
  newStart: Date;
  newEnd: Date;
  newResourceId?: string;
  oldResourceId?: string;
}

export interface CalendarResizeEvent {
  event: CalendarEvent;
  newStart?: Date;
  newEnd?: Date;
  direction: "start" | "end" | "both";
}

export interface CalendarClickEvent {
  event?: CalendarEvent;
  date: Date;
  resource?: CalendarResource;
  element: HTMLElement;
  jsEvent: MouseEvent;
  view: CalendarViewType;
}