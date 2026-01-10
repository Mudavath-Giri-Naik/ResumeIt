"use client";

import { useState } from "react";
import { FileText, ChevronLeft, Plus, MoreVertical, X } from "lucide-react";
import VerticalRuler from "./VerticalRuler";

interface HistoryProps {
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onMarginChange?: (side: "left" | "right" | "top" | "bottom", value: number) => void;
}

export default function History({ margins, onMarginChange }: HistoryProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Default margins if not provided
  const defaultMargins = margins || { top: 96, right: 96, bottom: 96, left: 144 };
  const defaultOnMarginChange = onMarginChange || (() => {});

  return (
    <div className={`h-full flex flex-col bg-white ${isMinimized ? "w-12" : "w-64"} transition-all duration-300 flex-shrink-0 relative`}>
      {isMinimized ? (
        <div className="h-full flex flex-col items-center py-4">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Expand sidebar"
          >
            <FileText className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <>
          {/* Back Arrow */}
          <div className="p-2 border-b border-gray-200">
            <button className="p-1.5 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Document tabs section */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Document tabs</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer border border-blue-200">
              <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-800 flex-1">Tab 1</span>
              <button className="p-0.5 hover:bg-gray-200 rounded">
                <MoreVertical className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Headings section */}
          <div className="p-3 flex-1 overflow-y-auto">
            <p className="text-xs text-gray-500">
              Headings that you add to the document will appear here.
            </p>
          </div>

          {/* Vertical Ruler on right edge of sidebar with margin controls */}
          <div className="absolute right-0 top-0 bottom-0 w-6 pointer-events-auto">
            <VerticalRuler margins={defaultMargins} onMarginChange={defaultOnMarginChange} />
          </div>
        </>
      )}
    </div>
  );
}
