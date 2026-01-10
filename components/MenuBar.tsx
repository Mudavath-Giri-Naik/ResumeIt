"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Undo2,
  Redo2,
  Printer,
  SpellCheck,
  Paintbrush,
  ZoomIn,
  Share2,
  User,
  Lock,
} from "lucide-react";

export default function MenuBar() {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="bg-white border-b border-gray-200 h-10 flex items-center justify-between px-4 text-sm">
      {/* Left side - Document name and menus */}
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-gray-900 hover:text-gray-700 transition-colors">
          ResumeIt
        </Link>
        <div className="flex items-center gap-4 text-gray-700">
          <button className="hover:bg-gray-100 px-2 py-1 rounded">File</button>
          <button className="hover:bg-gray-100 px-2 py-1 rounded">Edit</button>
          <button className="hover:bg-gray-100 px-2 py-1 rounded">View</button>
          <button className="hover:bg-gray-100 px-2 py-1 rounded">Insert</button>
          <button className="hover:bg-gray-100 px-2 py-1 rounded">Format</button>
          <button className="hover:bg-gray-100 px-2 py-1 rounded">Tools</button>
          <button className="hover:bg-gray-100 px-2 py-1 rounded">Extensions</button>
          <button className="hover:bg-gray-100 px-2 py-1 rounded">Help</button>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Undo">
          <Undo2 className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Redo">
          <Redo2 className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Print">
          <Printer className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Spell check">
          <SpellCheck className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded" title="Paint format">
          <Paintbrush className="w-4 h-4 text-gray-600" />
        </button>
        <div className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="text-xs border-0 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={90}>90%</option>
            <option value={100}>100%</option>
            <option value={125}>125%</option>
            <option value={150}>150%</option>
            <option value={200}>200%</option>
          </select>
        </div>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1.5 text-sm font-medium">
          <Lock className="w-3 h-3" />
          Share
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:ring-2 hover:ring-gray-300">
          <User className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

