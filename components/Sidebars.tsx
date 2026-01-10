"use client";

import { FileText, Plus, MoreVertical, MessageSquare, Smile, Image as ImageIcon, Calendar, Lightbulb, CheckCircle, MapPin, User, Plus as PlusIcon } from "lucide-react";

export default function Sidebars() {
  return (
    <>
      {/* Left Sidebar */}
      <div className="w-48 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Document tabs</span>
            <button className="p-1 hover:bg-gray-100 rounded">
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded hover:bg-blue-100 cursor-pointer">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-800 flex-1">Tab 1</span>
            <button className="p-0.5 hover:bg-gray-200 rounded">
              <MoreVertical className="w-3 h-3 text-gray-600" />
            </button>
          </div>
        </div>
        <div className="p-3 flex-1">
          <p className="text-xs text-gray-500">
            Headings that you add to the document will appear here.
          </p>
        </div>
      </div>

      {/* Right Collapsed Sidebar */}
      <div className="w-8 bg-white border-l border-gray-200 flex flex-col items-center py-2 gap-2 flex-shrink-0">
        <div className="p-1.5 bg-gray-100 rounded text-xs font-medium">31</div>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Calendar className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <Lightbulb className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <CheckCircle className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <User className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded">
          <MapPin className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded mt-auto">
          <PlusIcon className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Right Floating Toolbar - positioned relative to document */}
      <div className="absolute right-12 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <button className="p-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50">
            <span className="text-lg">✏️</span>
          </button>
        </div>
        <div className="pointer-events-auto">
          <button className="p-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50">
            <MessageSquare className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="pointer-events-auto">
          <button className="p-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50">
            <Smile className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <div className="pointer-events-auto">
          <button className="p-2 bg-white border border-gray-300 rounded-full shadow-md hover:bg-gray-50">
            <ImageIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </>
  );
}

