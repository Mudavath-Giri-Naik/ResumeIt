"use client";

import { useState, useRef, useEffect } from "react";
import { Ruler } from "lucide-react";

interface MarginControlProps {
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  onMarginsChange: (margins: { top: number; right: number; bottom: number; left: number }) => void;
}

export default function MarginControl({ margins, onMarginsChange }: MarginControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMarginChange = (side: "top" | "right" | "bottom" | "left", value: number) => {
    const newMargins = { ...margins, [side]: Math.max(0, Math.min(200, value)) };
    onMarginsChange(newMargins);
  };

  const presetMargins = [
    { name: "Normal", top: 16, right: 16, bottom: 16, left: 16 },
    { name: "Narrow", top: 8, right: 8, bottom: 8, left: 8 },
    { name: "Moderate", top: 24, right: 24, bottom: 24, left: 24 },
    { name: "Wide", top: 32, right: 32, bottom: 32, left: 32 },
  ];

  const applyPreset = (preset: typeof presetMargins[0]) => {
    onMarginsChange({
      top: preset.top,
      right: preset.right,
      bottom: preset.bottom,
      left: preset.left,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded hover:bg-gray-200 transition-colors"
        title="Margins"
      >
        <Ruler className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 z-50">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Page Margins</h3>
            
            {/* Preset Margins */}
            <div className="mb-4">
              <label className="text-xs text-gray-600 mb-2 block">Preset Margins</label>
              <div className="grid grid-cols-2 gap-2">
                {presetMargins.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="px-3 py-2 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Margins */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-700 w-20">Top:</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={margins.top}
                    onChange={(e) => handleMarginChange("top", parseInt(e.target.value) || 0)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500 w-8">px</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-700 w-20">Right:</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={margins.right}
                    onChange={(e) => handleMarginChange("right", parseInt(e.target.value) || 0)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500 w-8">px</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-700 w-20">Bottom:</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={margins.bottom}
                    onChange={(e) => handleMarginChange("bottom", parseInt(e.target.value) || 0)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500 w-8">px</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-700 w-20">Left:</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={margins.left}
                    onChange={(e) => handleMarginChange("left", parseInt(e.target.value) || 0)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500 w-8">px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


