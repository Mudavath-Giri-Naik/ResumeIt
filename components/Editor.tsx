"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import { useState } from "react";
import GoogleDocsToolbar from "./GoogleDocsToolbar";
import Rulers from "./Rulers";
import VerticalRuler from "./VerticalRuler";
import HistoryIcon from "./HistoryIcon";
import Chatbox from "./Chatbox";
import ContextMenu from "./ContextMenu";
import { ParagraphSpacing } from "@/lib/paragraph-spacing";
import { LineHeight } from "@/lib/line-height";
import { HorizontalRule } from "@/lib/horizontal-rule";
import { FontSize } from "@/lib/font-size";

export default function Editor() {
  const [margins, setMargins] = useState({
    top: 96, // 1 inch in pixels (96 DPI)
    right: 96, // 1 inch
    bottom: 96, // 1 inch
    left: 96, // 1 inch (matching Google Docs default)
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Underline,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        renderHTML({ HTMLAttributes }) {
          const href = HTMLAttributes.href;
          let finalHref = href;
          
          // Handle email links
          if (href && href.startsWith("mailto:")) {
            finalHref = href;
          } else if (href && href.includes("@") && !href.startsWith("http")) {
            finalHref = `mailto:${href}`;
          }
          // Handle LinkedIn links
          else if (href && (href.includes("linkedin.com") || href.includes("linked.in"))) {
            finalHref = href.startsWith("http") ? href : `https://${href}`;
          }
          // Handle other URLs
          else if (href && !href.startsWith("http") && !href.startsWith("mailto:")) {
            finalHref = `https://${href}`;
          }
          
          return [
            "a",
            {
              ...HTMLAttributes,
              href: finalHref,
              target: "_blank",
              rel: "noopener noreferrer",
            },
            0,
          ];
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextStyle,
      ParagraphSpacing,
      LineHeight,
      HorizontalRule,
      FontSize,
    ],
    content: "<p>Start typing...</p>",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[600px] text-gray-900",
        style: "font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.5;",
      },
    },
  });

  const handleMarginChange = (side: "left" | "right" | "top" | "bottom", value: number) => {
    const clampedValue = Math.max(0, Math.min(200, value));
    if (side === "left") {
      setMargins({ ...margins, left: clampedValue });
    } else if (side === "right") {
      setMargins({ ...margins, right: clampedValue });
    } else if (side === "top") {
      setMargins({ ...margins, top: clampedValue });
    } else if (side === "bottom") {
      setMargins({ ...margins, bottom: clampedValue });
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Top: Editing Tools */}
      <div className="flex-shrink-0">
        <GoogleDocsToolbar editor={editor} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Side: History Icon */}
        <div className="hidden lg:block flex-shrink-0">
          <HistoryIcon />
        </div>

        {/* Center: Editor Area with Margin Controls */}
        <div className="flex-1 flex flex-col overflow-hidden relative min-w-0">
          {/* Horizontal Ruler (Top Margin Control) */}
          <div className="hidden md:block flex-shrink-0">
            <Rulers margins={margins} onMarginChange={handleMarginChange} />
          </div>

          {/* Document Content Area with Vertical Ruler */}
          <div className="flex-1 flex overflow-hidden relative">
            {/* Vertical Ruler (Left Margin Control) */}
            <div className="hidden md:block flex-shrink-0">
              <VerticalRuler margins={margins} onMarginChange={handleMarginChange} />
            </div>
            
            {/* Document Content Area */}
            <div className="flex-1 overflow-auto bg-gray-100 relative" id="document-scroll-container">
              <div className="max-w-[816px] mx-auto bg-white min-h-full shadow-lg relative mt-8 md:mt-12 pb-8 md:pb-16" data-document-container="true">
                <div
                  className="px-0"
                  style={{
                    paddingTop: `${margins.top}px`,
                    paddingRight: `${margins.right}px`,
                    paddingBottom: `${margins.bottom}px`,
                    paddingLeft: `${margins.left}px`,
                    minHeight: "calc(100vh - 200px)",
                  }}
                >
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chatbox */}
        <div className="hidden lg:block flex-shrink-0">
          <Chatbox />
        </div>
      </div>
      
      {/* Context Menu */}
      <ContextMenu editor={editor} />
    </div>
  );
}

