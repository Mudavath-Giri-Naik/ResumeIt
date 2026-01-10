"use client";

import { useState, useRef, useEffect } from "react";

interface VerticalRulerProps {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onMarginChange: (side: "left" | "right" | "top" | "bottom", value: number) => void;
}

export default function VerticalRuler({ margins, onMarginChange }: VerticalRulerProps) {
  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [documentTopOffset, setDocumentTopOffset] = useState(0);
  const [documentHeight, setDocumentHeight] = useState(0);

  // Calculate the offset to align with the document content area
  const getDocumentTopOffset = () => {
    if (typeof window === 'undefined') return 0;
    const scrollContainer = document.getElementById('document-scroll-container');
    if (!scrollContainer || !rulerRef.current) return 0;
    const documentElement = scrollContainer.querySelector('[data-document-container="true"]') as HTMLElement;
    if (!documentElement) return 0;
    const scrollTop = scrollContainer.scrollTop || 0;
    // Get the top position of the document element relative to the scroll container
    const docTop = documentElement.offsetTop;
    return docTop;
  };

  const handleMouseDown = (side: "top" | "bottom") => {
    if (side === "top") setIsDraggingTop(true);
    else setIsDraggingBottom(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingTop && rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const scrollContainer = document.getElementById('document-scroll-container');
        const scrollTop = scrollContainer?.scrollTop || 0;
        const mouseY = e.clientY - rect.top + scrollTop;
        // Account for document top offset - margin should be relative to document start
        const newTop = Math.max(0, Math.min(200, mouseY - documentTopOffset));
        onMarginChange("top", newTop);
      }
      if (isDraggingBottom && rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const scrollContainer = document.getElementById('document-scroll-container');
        const scrollTop = scrollContainer?.scrollTop || 0;
        const mouseY = e.clientY - rect.top + scrollTop;
        // Calculate bottom margin from document bottom
        const documentBottom = documentTopOffset + documentHeight;
        const newBottom = Math.max(0, Math.min(200, documentBottom - mouseY));
        onMarginChange("bottom", newBottom);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingTop(false);
      setIsDraggingBottom(false);
    };

    if (isDraggingTop || isDraggingBottom) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingTop, isDraggingBottom, onMarginChange, documentTopOffset, documentHeight]);

  // Sync scroll with document
  useEffect(() => {
    const scrollContainer = document.getElementById('document-scroll-container');
    if (!scrollContainer || !rulerRef.current) return;

    const handleScroll = () => {
      if (rulerRef.current) {
        rulerRef.current.scrollTop = scrollContainer.scrollTop;
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateOffset = () => {
      const offset = getDocumentTopOffset();
      setDocumentTopOffset(offset);
      const scrollContainer = document.getElementById('document-scroll-container');
      if (scrollContainer) {
        const documentElement = scrollContainer.querySelector('[data-document-container="true"]') as HTMLElement;
        if (documentElement) {
          setDocumentHeight(documentElement.offsetHeight);
        }
      }
    };
    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(updateOffset, 100);
    const scrollContainer = document.getElementById('document-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateOffset);
    }
    window.addEventListener('resize', updateOffset);
    return () => {
      clearTimeout(timer);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateOffset);
      }
      window.removeEventListener('resize', updateOffset);
    };
  }, []);

  return (
    <div 
      className="bg-gray-50 border-r border-gray-300 w-6 flex-shrink-0 overflow-auto relative h-full hide-scrollbar" 
      ref={rulerRef}
      style={{ maxHeight: '100%' }}
    >
      <div className="relative" style={{ minHeight: '100%', height: '2000px' }}>
        {Array.from({ length: 21 }, (_, i) => i).map((inch) => (
          <div key={inch} className="absolute flex items-center" style={{ top: `${documentTopOffset + inch * 96}px` }}>
            <div className="h-px w-3 bg-gray-400"></div>
            <div className="text-[10px] text-gray-600 ml-1 -mt-1">{inch}</div>
          </div>
        ))}
        {/* Top margin indicator - simple blue triangle like Google Docs */}
        <div
          className="absolute left-0 cursor-move z-10"
          style={{ top: `${documentTopOffset + margins.top}px` }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown("top");
          }}
        >
          <div className="w-0 h-0 border-t-[6px] border-t-blue-600 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent"></div>
        </div>
        {/* Bottom margin indicator - simple blue triangle like Google Docs */}
        <div
          className="absolute left-0 cursor-move z-10"
          style={{ 
            top: `${documentTopOffset + documentHeight - margins.bottom}px` 
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown("bottom");
          }}
        >
          <div className="w-0 h-0 border-b-[6px] border-b-blue-600 border-l-[6px] border-l-transparent border-r-[8px] border-r-transparent"></div>
        </div>
      </div>
    </div>
  );
}
