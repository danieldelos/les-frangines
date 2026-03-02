"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarEvent } from "@/types/calendar";

interface CalendarEventResizerProps {
  event: CalendarEvent;
  onResize: (eventId: string, newStart: Date, newEnd: Date) => void;
  className?: string;
  resizeHandleClassName?: string;
  children?: React.ReactNode;
}

export function CalendarEventResizer({ 
  event, 
  onResize, 
  className = "",
  resizeHandleClassName = "",
  children
}: CalendarEventResizerProps) {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<"start" | "end" | null>(null);
  const [initialMouseY, setInitialMouseY] = useState(0);
  const [initialStart, setInitialStart] = useState<Date | null>(null);
  const [initialEnd, setInitialEnd] = useState<Date | null>(null);
  
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (direction: "start" | "end") => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeDirection(direction);
    setInitialMouseY(e.clientY);
    setInitialStart(new Date(event.start));
    setInitialEnd(new Date(event.end));
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !resizeDirection || !initialStart || !initialEnd) return;
    
    const deltaY = e.clientY - initialMouseY;
    const minutesDelta = Math.round(deltaY / 2); // Aproximadamente 2px = 1 minuto
    
    if (resizeDirection === "start") {
      const newStart = new Date(initialStart);
      newStart.setMinutes(newStart.getMinutes() + minutesDelta);
      
      // Garantir que o início não ultrapasse o fim
      if (newStart < initialEnd) {
        onResize(event.id, newStart, initialEnd);
      }
    } else if (resizeDirection === "end") {
      const newEnd = new Date(initialEnd);
      newEnd.setMinutes(newEnd.getMinutes() + minutesDelta);
      
      // Garantir que o fim não seja antes do início
      if (newEnd > initialStart) {
        onResize(event.id, initialStart, newEnd);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    setResizeDirection(null);
    setInitialStart(null);
    setInitialEnd(null);
    
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Limpar listeners em caso de desmontagem
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div 
      ref={eventRef}
      className={`relative group ${className}`}
    >
      {/* Resize handle para o início do evento */}
      <div
        ref={resizeHandleRef}
        className={`
          absolute top-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100
          transition-opacity duration-200 hover:bg-blue-500 hover:h-1
          ${resizeHandleClassName}
        `}
        onMouseDown={handleMouseDown("start")}
        title="Redimensionar início"
      >
        <div className="w-full h-1 bg-blue-400 rounded-full opacity-50" />
      </div>
      
      {/* Resize handle para o fim do evento */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize opacity-0 group-hover:opacity-100
          transition-opacity duration-200 hover:bg-blue-500 hover:h-1
          ${resizeHandleClassName}
        `}
        onMouseDown={handleMouseDown("end")}
        title="Redimensionar fim"
      >
        <div className="w-full h-1 bg-blue-400 rounded-full opacity-50" />
      </div>
      
      {children}
      
      {/* Indicador visual durante redimensionamento */}
      {isResizing && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 pointer-events-none rounded" />
      )}
    </div>
  );
}
