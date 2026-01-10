"use client";

import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image,
  Indent,
  Outdent,
  Type,
  Highlighter,
  Search,
  Undo2,
  Redo2,
  Printer,
  Paintbrush,
  X,
  Plus,
  Minus,
  MoreVertical,
  Download,
  FileText,
  File,
  User,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { exportToPDF, exportToDOCX } from "@/lib/exportUtils";

interface GoogleDocsToolbarProps {
  editor: Editor;
}

export default function GoogleDocsToolbar({ editor }: GoogleDocsToolbarProps) {
  const [fontSize, setFontSize] = useState("11");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [lineSpacing, setLineSpacing] = useState("1.15");
  const [textStyle, setTextStyle] = useState("Normal text");
  const [zoom, setZoom] = useState("100");
  const lineSpacingRef = useRef<HTMLDivElement>(null);
  const [showLineSpacing, setShowLineSpacing] = useState(false);
  const [customLineSpacing, setCustomLineSpacing] = useState("");
  const [showCustomLineSpacing, setShowCustomLineSpacing] = useState(false);
  const horizontalRuleRef = useRef<HTMLDivElement>(null);
  const [showHorizontalRule, setShowHorizontalRule] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "docx" | null>(null);

  if (!editor) {
    return null;
  }

  // Update editor font family when it changes (global)
  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom.closest('.ProseMirror') || editor.view.dom;
      if (editorElement instanceof HTMLElement) {
        editorElement.style.fontFamily = fontFamily;
      }
    }
  }, [fontFamily, editor]);

  // Sync font size from selection
  useEffect(() => {
    if (!editor) return;
    
    const updateFontSize = () => {
      const marks = editor.getAttributes("textStyle");
      if (marks.fontSize) {
        const sizeMatch = marks.fontSize.match(/(\d+)pt/);
        if (sizeMatch) {
          setFontSize(sizeMatch[1]);
        } else {
          // Default to 11 if no font size is set
          setFontSize("11");
        }
      } else {
        // Default to 11 if no font size is set
        setFontSize("11");
      }
    };

    editor.on("selectionUpdate", updateFontSize);
    editor.on("update", updateFontSize);
    updateFontSize();

    return () => {
      editor.off("selectionUpdate", updateFontSize);
      editor.off("update", updateFontSize);
    };
  }, [editor]);

  // Sync text style with editor state
  useEffect(() => {
    if (!editor) return;
    
    const updateTextStyle = () => {
      if (editor.isActive("heading", { level: 1 })) {
        setTextStyle("Heading 1");
      } else if (editor.isActive("heading", { level: 2 })) {
        setTextStyle("Heading 2");
      } else if (editor.isActive("heading", { level: 3 })) {
        setTextStyle("Heading 3");
      } else {
        setTextStyle("Normal text");
      }
    };

    editor.on("selectionUpdate", updateTextStyle);
    editor.on("update", updateTextStyle);
    updateTextStyle();

    return () => {
      editor.off("selectionUpdate", updateTextStyle);
      editor.off("update", updateTextStyle);
    };
  }, [editor]);

  // Handle text style changes
  const handleTextStyleChange = (style: string) => {
    setTextStyle(style);
    if (style === "Normal text") {
      editor.chain().focus().setParagraph().run();
    } else if (style === "Heading 1") {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    } else if (style === "Heading 2") {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    } else if (style === "Heading 3") {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          if (src) {
            editor.chain().focus().setImage({ src }).run();
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Close line spacing dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (lineSpacingRef.current && !lineSpacingRef.current.contains(event.target as Node)) {
        setShowLineSpacing(false);
      }
    };

    if (showLineSpacing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLineSpacing]);

  // Close custom line spacing modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showCustomLineSpacing) {
        setShowCustomLineSpacing(false);
        setCustomLineSpacing("");
      }
    };

    if (showCustomLineSpacing) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCustomLineSpacing]);

  // Close horizontal rule dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (horizontalRuleRef.current && !horizontalRuleRef.current.contains(event.target as Node)) {
        setShowHorizontalRule(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExport(false);
      }
    };

    if (showHorizontalRule || showExport) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHorizontalRule, showExport]);

  // Handle export
  const handleExport = async () => {
    if (!editor || !exportFormat) return;

    // Get the editor HTML content - ensure we get the actual content
    let html = editor.getHTML();
    
    // Remove placeholder text if present
    if (html.includes("Start typing...")) {
      html = html.replace(/<p[^>]*>Start typing\.\.\.<\/p>/gi, "");
    }
    
    // If HTML is empty or just empty paragraph, try to get content from DOM
    if (!html || html.trim() === "" || html === "<p></p>" || html === "<p><br></p>") {
      const editorElement = editor.view.dom;
      if (editorElement) {
        const clonedElement = editorElement.cloneNode(true) as HTMLElement;
        // Remove any placeholder elements
        const placeholders = clonedElement.querySelectorAll('[data-placeholder]');
        placeholders.forEach(p => p.remove());
        html = clonedElement.innerHTML;
      }
    }

    // Check if there's actual text content (excluding HTML tags)
    const textContent = editor.getText();
    const hasContent = textContent && 
                      textContent.trim() !== "" && 
                      textContent.trim() !== "Start typing..." &&
                      html.trim() !== "" &&
                      html.trim() !== "<p></p>" &&
                      html.trim() !== "<p><br></p>";
    
    if (!hasContent) {
      alert("Please add some content to your document before exporting.");
      return;
    }

    // Create a properly styled HTML document for export
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.5;
              color: #000;
              margin: 0;
              padding: 96px;
              width: 816px;
              margin: 0 auto;
            }
            p {
              margin: 0;
              line-height: 1.5;
            }
            p + p {
              margin-top: 0.75em;
            }
            h1, h2, h3 {
              margin: 0.67em 0;
            }
            a {
              color: #3b82f6;
              text-decoration: underline;
            }
            ul, ol {
              padding-left: 1.5em;
              margin: 0.5em 0;
            }
            hr {
              border: none;
              border-top: 1px solid #000;
              width: 100%;
              margin: 12px 0;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    if (exportFormat === "pdf") {
      // For PDF, extract just the body content
      const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : html;
      exportToPDF(bodyContent, "resume.pdf");
    } else if (exportFormat === "docx") {
      await exportToDOCX(fullHtml, "resume.docx");
    }

    setShowExport(false);
    setExportFormat(null);
  };

  const lineSpacingOptions = [
    { label: "Single", value: "1.0" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double", value: "2.0" },
    { label: "2.5", value: "2.5" },
    { label: "3.0", value: "3.0" },
    { label: "Custom...", value: "custom" },
  ];
  const zoomOptions = ["50", "75", "90", "100", "125", "150", "200"];
  
  // Paragraph spacing options (in points)
  const paragraphSpacingOptions = [
    { label: "0 pt", value: "0pt" },
    { label: "6 pt", value: "6pt" },
    { label: "12 pt", value: "12pt" },
    { label: "18 pt", value: "18pt" },
    { label: "24 pt", value: "24pt" },
  ];

  const increaseFontSize = () => {
    const current = parseInt(fontSize);
    const sizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
    const nextIndex = sizes.findIndex(s => s > current);
    if (nextIndex !== -1) {
      const newSize = sizes[nextIndex].toString();
      setFontSize(newSize);
      // Apply to selected text only
      editor.chain().focus().setFontSize(newSize).run();
    }
  };

  const decreaseFontSize = () => {
    const current = parseInt(fontSize);
    const sizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];
    const prevIndex = sizes.findIndex(s => s >= current) - 1;
    if (prevIndex >= 0) {
      const newSize = sizes[prevIndex].toString();
      setFontSize(newSize);
      // Apply to selected text only
      editor.chain().focus().setFontSize(newSize).run();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Toolbar Row */}
      <div className="px-2 py-1.5 flex items-center justify-between">
        {/* Left Side Icons */}
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded hover:bg-gray-100" title="Search">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50" 
            title="Undo"
          >
            <Undo2 className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50" 
            title="Redo"
          >
            <Redo2 className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-100" title="Print">
            <Printer className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 rounded hover:bg-gray-100" title="Paint format">
            <Paintbrush className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Center Toolbar */}
        <div className="flex items-center gap-1 flex-1 justify-center">
          {/* Zoom Dropdown */}
          <select
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 focus:outline-none cursor-pointer"
          >
            {zoomOptions.map((z) => (
              <option key={z} value={z}>{z}%</option>
            ))}
          </select>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          {/* Paragraph Style Dropdown */}
          <select
            value={textStyle}
            onChange={(e) => handleTextStyleChange(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer min-w-[120px]"
          >
            <option>Normal text</option>
            <option>Heading 1</option>
            <option>Heading 2</option>
            <option>Heading 3</option>
          </select>

          {/* Font Family Dropdown */}
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white cursor-pointer min-w-[100px]"
          >
            <option>Arial</option>
            <option>Times New Roman</option>
            <option>Courier New</option>
            <option>Georgia</option>
            <option>Verdana</option>
            <option>Helvetica</option>
            <option>Comic Sans MS</option>
          </select>

          {/* Font Size with +/- buttons */}
          <div className="flex items-center border border-gray-300 rounded">
            <select
              value={fontSize}
              onChange={(e) => {
                const newSize = e.target.value;
                setFontSize(newSize);
                // Apply to selected text only
                editor.chain().focus().setFontSize(newSize).run();
              }}
              className="px-2 py-1 text-sm border-0 hover:bg-gray-50 focus:outline-none cursor-pointer w-12"
            >
              {[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map((size) => (
                <option key={size} value={size.toString()}>
                  {size}
                </option>
              ))}
            </select>
            <div className="flex flex-col border-l border-gray-300">
              <button
                onClick={increaseFontSize}
                className="px-1 py-0.5 hover:bg-gray-100 border-b border-gray-300"
                title="Increase font size"
              >
                <Plus className="w-3 h-3 text-gray-600" />
              </button>
              <button
                onClick={decreaseFontSize}
                className="px-1 py-0.5 hover:bg-gray-100"
                title="Decrease font size"
              >
                <Minus className="w-3 h-3 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          {/* Text Formatting - Bold, Italic, Underline */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="Bold (Ctrl+B)"
          >
            <span className="text-sm font-bold">B</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Italic (Ctrl+I)"
          >
            <span className="text-sm italic">I</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
            title="Underline (Ctrl+U)"
          >
            <span className="text-sm underline">U</span>
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          {/* Text Color with underline */}
          <button
            className="p-1.5 rounded hover:bg-gray-100 relative transition-colors"
            title="Text color"
          >
            <span className="text-sm font-semibold">A</span>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-0.5 bg-black"></div>
          </button>

          {/* Highlight Color */}
          <button
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Highlight color"
          >
            <Highlighter className="w-4 h-4 text-gray-600" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          {/* Link */}
          <button
            onClick={setLink}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("link") ? "bg-gray-200" : ""
            }`}
            title="Insert link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>

          {/* Image */}
          <button
            onClick={handleImageUpload}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Insert image"
          >
            <Image className="w-4 h-4" />
          </button>

          {/* Horizontal Rule */}
          <div className="relative" ref={horizontalRuleRef}>
            <button
              onClick={() => setShowHorizontalRule(!showHorizontalRule)}
              className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              title="Insert horizontal line"
            >
              <Minus className="w-4 h-4" />
            </button>
            {showHorizontalRule && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]">
                <div className="px-2 py-1.5">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Line thickness</div>
                  <div className="space-y-1">
                    {[
                      { label: "Thin", value: "1px" },
                      { label: "Medium", value: "2px" },
                      { label: "Thick", value: "3px" },
                      { label: "Extra Thick", value: "4px" },
                      { label: "Very Thick", value: "6px" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          editor.chain().focus().setHorizontalRule({ thickness: option.value }).run();
                          setShowHorizontalRule(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-3"
                      >
                        <div
                          className="flex-1 h-0 border-t border-black"
                          style={{ borderTopWidth: option.value, minWidth: "60px" }}
                        ></div>
                        <span className="text-xs text-gray-600 whitespace-nowrap">{option.label}</span>
                        <span className="text-xs text-gray-400">{option.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          {/* Alignment */}
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
            }`}
            title="Align left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
            }`}
            title="Align center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
            }`}
            title="Align right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive({ textAlign: "justify" }) ? "bg-gray-200" : ""
            }`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>

          <div className="w-px h-5 bg-gray-300 mx-1"></div>

          {/* Line & Paragraph Spacing */}
          <div className="relative" ref={lineSpacingRef}>
            <button
              onClick={() => setShowLineSpacing(!showLineSpacing)}
              className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 bg-white flex items-center gap-1"
              title="Line spacing"
            >
              <span className="text-xs">{lineSpacing}</span>
              <span className="text-[10px]">▼</span>
            </button>
            {showLineSpacing && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]">
                {/* Line Spacing Section */}
                <div className="px-2 py-1.5 border-b border-gray-200">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Line spacing</div>
                  {lineSpacingOptions.map((option) => {
                    if (option.value === "custom") {
                      return (
                        <div key={option.value} className="border-t border-gray-200 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setShowCustomLineSpacing(true);
                              setShowLineSpacing(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            {option.label}
                          </button>
                        </div>
                      );
                    }
                    return (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLineSpacing(option.value);
                          setShowLineSpacing(false);
                          editor.chain().focus().setLineHeight(option.value).run();
                        }}
                        className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                          lineSpacing === option.value ? "bg-blue-50 text-blue-600" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                
                {/* Paragraph Spacing Section */}
                <div className="px-2 py-1.5">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Paragraph spacing</div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-600 px-3 py-1">Add space before paragraph</div>
                    <div className="flex flex-wrap gap-1 px-2">
                      {paragraphSpacingOptions.map((option) => (
                        <button
                          key={`before-${option.value}`}
                          onClick={() => {
                            editor.chain().focus().setParagraphSpacing({ marginTop: option.value }).run();
                            setShowLineSpacing(false);
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 bg-white"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <div className="text-xs text-gray-600 px-3 py-1 mt-2">Add space after paragraph</div>
                    <div className="flex flex-wrap gap-1 px-2">
                      {paragraphSpacingOptions.map((option) => (
                        <button
                          key={`after-${option.value}`}
                          onClick={() => {
                            editor.chain().focus().setParagraphSpacing({ marginBottom: option.value }).run();
                            setShowLineSpacing(false);
                          }}
                          className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 bg-white"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        editor.chain().focus().removeParagraphSpacing().run();
                        setShowLineSpacing(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 mt-2 border-t border-gray-200 pt-2"
                    >
                      Remove paragraph spacing
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Custom Line Spacing Modal */}
            {showCustomLineSpacing && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50" onClick={() => setShowCustomLineSpacing(false)}>
                <div className="bg-white rounded-lg shadow-xl p-6 min-w-[300px]" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold mb-4">Custom line spacing</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Line spacing (1.0 - 3.0)
                    </label>
                    <input
                      type="number"
                      min="1.0"
                      max="3.0"
                      step="0.05"
                      value={customLineSpacing}
                      onChange={(e) => setCustomLineSpacing(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1.25"
                      autoFocus
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setShowCustomLineSpacing(false);
                        setCustomLineSpacing("");
                      }}
                      className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (customLineSpacing && parseFloat(customLineSpacing) >= 1.0 && parseFloat(customLineSpacing) <= 3.0) {
                          const value = customLineSpacing;
                          setLineSpacing(value);
                          editor.chain().focus().setLineHeight(value).run();
                          setShowCustomLineSpacing(false);
                          setCustomLineSpacing("");
                        }
                      }}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Bulleted list"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Numbered list"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Indent */}
          <button
            onClick={() => editor.chain().focus().liftListItem("listItem").run()}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Decrease indent"
          >
            <Outdent className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Increase indent"
          >
            <Indent className="w-4 h-4" />
          </button>

          {/* Clear Formatting */}
          <button
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="p-1.5 rounded hover:bg-gray-100 transition-colors"
            title="Clear formatting"
          >
            <X className="w-4 h-4" />
          </button>

          {/* More Options */}
          <button className="p-1.5 rounded hover:bg-gray-100 transition-colors" title="More options">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-1">
          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setShowExport(!showExport)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1.5 text-sm font-medium"
              title="Export"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            {showExport && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[200px]">
                <div className="p-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Export Format</div>
                  <div className="space-y-1">
                    <button
                      onClick={() => setExportFormat("pdf")}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 rounded ${
                        exportFormat === "pdf" ? "bg-blue-50 text-blue-600" : ""
                      }`}
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => setExportFormat("docx")}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 rounded ${
                        exportFormat === "docx" ? "bg-blue-50 text-blue-600" : ""
                      }`}
                    >
                      <File className="w-4 h-4" />
                      DOCX
                    </button>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={handleExport}
                      disabled={!exportFormat}
                      className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium cursor-pointer hover:ring-2 hover:ring-gray-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
