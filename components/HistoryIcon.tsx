"use client";

import { useState } from "react";
import { Clock, X, FileText } from "lucide-react";

interface HistoryItem {
  id: string;
  title: string;
  timestamp: Date;
  preview: string;
}

export default function HistoryIcon() {
  const [historyItems] = useState<HistoryItem[]>([
    {
      id: "1",
      title: "Resume - Software Engineer",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      preview: "John Doe\nSoftware Engineer...",
    },
    {
      id: "2",
      title: "Resume - Product Manager",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      preview: "Jane Smith\nProduct Manager...",
    },
    {
      id: "3",
      title: "Resume - Data Scientist",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      preview: "Bob Johnson\nData Scientist...",
    },
  ]);
  const [isMinimized, setIsMinimized] = useState(false);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className={`h-full flex flex-col bg-white border-r border-gray-200 ${isMinimized ? "w-12" : "w-80"} transition-all duration-300 flex-shrink-0`}>
      {isMinimized ? (
        <div className="h-full flex flex-col items-center py-4">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Expand history"
          >
            <Clock className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-sm font-semibold text-gray-800">History</h2>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Minimize history"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            {historyItems.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                <p>No history yet</p>
                <p className="text-xs mt-2">Your recent documents will appear here</p>
              </div>
            ) : (
              <div className="p-2">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg cursor-pointer transition-colors mb-2 hover:bg-gray-50 border border-transparent"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-800 truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {item.preview}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(item.timestamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200">
            <button className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              View All History
            </button>
          </div>
        </>
      )}
    </div>
  );
}

