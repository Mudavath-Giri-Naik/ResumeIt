"use client";

import { useState, useRef, useEffect } from "react";

interface RulersProps {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onMarginChange: (side: "left" | "right" | "top" | "bottom", value: number) => void;
}

export default function Rulers({ margins, onMarginChange }: RulersProps) {
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  const rulerRef = useRef<HTMLDivElement>(null);
  const [documentOffset, setDocumentOffset] = useState(0);
  const [documentWidth, setDocumentWidth] = useState(816);
  const [textStartOffset, setTextStartOffset] = useState(0);

  // Generate ruler marks (0 to 18 inches, assuming 96 DPI)
  const horizontalMarks = Array.from({ length: 19 }, (_, i) => i);

  // Calculate the offset to align with the document content area
  // Document is max-w-[816px] (8.5 inches) and centered
  const getDocumentOffset = () => {
    if (typeof window === 'undefined') return 0;
    const scrollContainer = document.getElementById('document-scroll-container');
    if (!scrollContainer || !rulerRef.current) return 0;
    const documentElement = scrollContainer.querySelector('[data-document-container="true"]') as HTMLElement;
    if (!documentElement) return 0;
    const rulerRect = rulerRef.current.getBoundingClientRect();
    const docRect = documentElement.getBoundingClientRect();
    // Calculate offset from ruler left to document left
    return docRect.left - rulerRect.left;
  };

  // Calculate the exact position where text content starts (inner content div)
  const getTextStartOffset = () => {
    if (typeof window === 'undefined') return 0;
    const scrollContainer = document.getElementById('document-scroll-container');
    if (!scrollContainer || !rulerRef.current) return 0;
    const documentElement = scrollContainer.querySelector('[data-document-container="true"]') as HTMLElement;
    if (!documentElement) return 0;
    // Find the inner content div - it's the direct child div with the padding style
    const contentDiv = documentElement.firstElementChild as HTMLElement;
    if (!contentDiv) {
      // Fallback: try to find by style attribute
      const divs = documentElement.querySelectorAll('div');
      for (const div of Array.from(divs)) {
        if (div.style.paddingLeft || div.style.padding) {
          const rulerRect = rulerRef.current.getBoundingClientRect();
          const contentRect = div.getBoundingClientRect();
          return contentRect.left - rulerRect.left;
        }
      }
      return getDocumentOffset();
    }
    const rulerRect = rulerRef.current.getBoundingClientRect();
    const contentRect = contentDiv.getBoundingClientRect();
    // Return the exact left position where text starts (left edge of content div)
    // This is where text will be when margin is 0
    return contentRect.left - rulerRect.left;
  };

  const handleMouseDown = (side: "left" | "right") => {
    if (side === "left") setIsDraggingLeft(true);
    else setIsDraggingRight(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingLeft && rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        // Account for text start offset - margin should be relative to text start position
        const newLeft = Math.max(0, Math.min(200, mouseX - textStartOffset));
        onMarginChange("left", newLeft);
      }
      if (isDraggingRight && rulerRef.current) {
        const rect = rulerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        // Calculate right margin from document end
        const documentEnd = documentOffset + documentWidth;
        const newRight = Math.max(0, Math.min(200, documentEnd - mouseX));
        onMarginChange("right", newRight);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingLeft(false);
      setIsDraggingRight(false);
    };

    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDraggingLeft, isDraggingRight, onMarginChange, textStartOffset, documentOffset, documentWidth]);

  useEffect(() => {
    const updateOffset = () => {
      const offset = getDocumentOffset();
      setDocumentOffset(offset);
      const textStart = getTextStartOffset();
      setTextStartOffset(textStart);
      const scrollContainer = document.getElementById('document-scroll-container');
      if (scrollContainer) {
        const documentElement = scrollContainer.querySelector('[data-document-container="true"]') as HTMLElement;
        if (documentElement) {
          setDocumentWidth(documentElement.offsetWidth);
        }
      }
    };
    // Use setTimeout to ensure DOM is ready
    const timer = setTimeout(updateOffset, 100);
    window.addEventListener('resize', updateOffset);
    const scrollContainer = document.getElementById('document-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateOffset);
    }
    // Use MutationObserver to watch for style changes in the content div
    const observer = new MutationObserver(updateOffset);
    const documentElement = scrollContainer?.querySelector('[data-document-container="true"]') as HTMLElement;
    if (documentElement) {
      const contentDiv = documentElement.querySelector('div[style*="paddingLeft"]') as HTMLElement;
      if (contentDiv) {
        observer.observe(contentDiv, { attributes: true, attributeFilter: ['style'] });
      }
    }
    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', updateOffset);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', updateOffset);
      }
    };
  }, [margins.left]);

  return (
    <div className="bg-gray-50 border-b border-gray-300 h-8 relative overflow-hidden mb-2" ref={rulerRef}>
      <div className="flex items-center h-full relative">
        {horizontalMarks.map((inch) => (
          <div key={inch} className="absolute flex flex-col" style={{ left: `${documentOffset + inch * 96}px` }}>
            <div className="w-px bg-gray-400 h-3"></div>
            <div className="text-[10px] text-gray-600 mt-0.5 -ml-1">{inch}</div>
          </div>
        ))}
        {/* Left margin indicator - aligned with text start position */}
        <div
          className="absolute top-0 cursor-move z-10"
          style={{ left: `${textStartOffset + margins.left}px` }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown("left");
          }}
        >
          <div className="w-0 h-0 border-l-[6px] border-l-blue-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
        </div>
        {/* Right margin indicator - simple blue triangle like Google Docs */}
        <div
          className="absolute top-0 cursor-move z-10"
          style={{ left: `${documentOffset + documentWidth - margins.right}px` }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleMouseDown("right");
          }}
        >
          <div className="w-0 h-0 border-r-[6px] border-r-blue-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
        </div>
      </div>
    </div>
  );
}

