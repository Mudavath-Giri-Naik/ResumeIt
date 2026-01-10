"use client";

import { Editor } from "@tiptap/react";
import { useState, useEffect, useRef } from "react";
import { Copy, Scissors, Clipboard, Link as LinkIcon, Edit } from "lucide-react";

interface ContextMenuProps {
  editor: Editor;
}

export default function ContextMenu({ editor }: ContextMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isLink, setIsLink] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [showEditLinkModal, setShowEditLinkModal] = useState(false);
  const [showInsertLinkModal, setShowInsertLinkModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editor) return;

    const handleContextMenu = (event: MouseEvent) => {
      // Check if right-click is on the editor
      const editorElement = editor.view.dom;
      if (!editorElement.contains(event.target as Node)) {
        return;
      }

      event.preventDefault();
      
      // Check if we're on a link
      const linkAttrs = editor.getAttributes("link");
      const { from, to } = editor.state.selection;
      
      if (linkAttrs.href) {
        setIsLink(true);
        setLinkUrl(linkAttrs.href);
        
        // Get the actual link text from the DOM element
        // This is more reliable than trying to extract from the document
        const editorElement = editor.view.dom;
        const selection = window.getSelection();
        let linkText = "";
        
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const linkElement = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentElement?.closest("a")
            : (range.commonAncestorContainer as Element)?.closest("a");
          
          if (linkElement) {
            linkText = linkElement.textContent || "";
          }
        }
        
        // Fallback: use selected text from document
        if (!linkText) {
          const selectedText = editor.state.doc.textBetween(from, to);
          linkText = selectedText;
        }
        
        // If still no text, use URL as fallback
        setLinkText(linkText || linkAttrs.href);
      } else {
        setIsLink(false);
        setLinkUrl("");
        const selectedText = editor.state.doc.textBetween(from, to);
        setLinkText(selectedText);
      }

      setPosition({ x: event.clientX, y: event.clientY });
      setIsVisible(true);
    };

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsVisible(false);
        setShowEditLinkModal(false);
        setShowInsertLinkModal(false);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor]);

  const handleCopy = () => {
    const { from, to } = editor.state.selection;
    if (from !== to) {
      const text = editor.state.doc.textBetween(from, to);
      navigator.clipboard.writeText(text).then(() => {
        setIsVisible(false);
      });
    }
  };

  const handleCut = () => {
    const { from, to } = editor.state.selection;
    if (from !== to) {
      const text = editor.state.doc.textBetween(from, to);
      navigator.clipboard.writeText(text).then(() => {
        editor.chain().focus().deleteSelection().run();
        setIsVisible(false);
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      editor.chain().focus().insertContent(text).run();
      setIsVisible(false);
    } catch (err) {
      console.error("Failed to paste:", err);
    }
  };

  const handleInsertLink = () => {
    setShowInsertLinkModal(true);
    setIsVisible(false);
  };

  const handleEditLink = () => {
    setShowEditLinkModal(true);
    setIsVisible(false);
  };

  const handleSaveLink = (url: string, text?: string) => {
    if (!url.trim()) {
      return;
    }

    // Handle different link types
    let finalUrl = url.trim();
    
    // Handle email links
    if (finalUrl.includes("@") && !finalUrl.startsWith("mailto:") && !finalUrl.startsWith("http")) {
      finalUrl = `mailto:${finalUrl}`;
    }
    // Handle LinkedIn links
    else if (finalUrl.includes("linkedin.com") || finalUrl.includes("linked.in")) {
      if (!finalUrl.startsWith("http")) {
        finalUrl = `https://${finalUrl}`;
      }
    }
    // Handle other URLs
    else if (!finalUrl.match(/^https?:\/\//) && !finalUrl.startsWith("mailto:")) {
      finalUrl = `https://${finalUrl}`;
    }

    if (isLink) {
      // Editing existing link
      const { from, to } = editor.state.selection;
      const currentText = editor.state.doc.textBetween(from, to);
      
      // If text is provided and different, replace the entire link
      if (text && text.trim() && text !== currentText) {
        // Replace the link with new text and URL
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(`<a href="${finalUrl}">${text.trim()}</a>`)
          .run();
      } else {
        // Just update the URL, keep the text
        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: finalUrl })
          .run();
      }
    } else {
      // Inserting new link
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);

      if (selectedText) {
        // If text is selected, make it a link
        editor
          .chain()
          .focus()
          .setLink({ href: finalUrl })
          .run();
      } else {
        // If no text selected, insert link with provided text or URL
        const linkText = text?.trim() || finalUrl;
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${finalUrl}">${linkText}</a>`)
          .run();
      }
    }

    setShowInsertLinkModal(false);
    setShowEditLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setShowEditLinkModal(false);
  };

  if (!isVisible && !showEditLinkModal && !showInsertLinkModal) {
    return null;
  }

  return (
    <>
      {isVisible && (
        <div
          ref={menuRef}
          className="fixed bg-white border border-gray-300 rounded shadow-lg z-50 min-w-[180px] py-1"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {!isLink && (
            <>
              <button
                onClick={handleCopy}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
              <button
                onClick={handleCut}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Scissors className="w-4 h-4" />
                Cut
              </button>
              <button
                onClick={handlePaste}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Clipboard className="w-4 h-4" />
                Paste
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleInsertLink}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Insert Link
              </button>
            </>
          )}
          {isLink && (
            <button
              onClick={handleEditLink}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Link
            </button>
          )}
        </div>
      )}

      {/* Insert Link Modal */}
      {showInsertLinkModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setShowInsertLinkModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 min-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text (optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => {
                  setShowInsertLinkModal(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveLink(linkUrl, linkText)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Link Modal */}
      {showEditLinkModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          onClick={() => setShowEditLinkModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 min-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-between mt-6">
              <button
                onClick={handleRemoveLink}
                className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Remove Link
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowEditLinkModal(false);
                  }}
                  className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSaveLink(linkUrl, linkText)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

