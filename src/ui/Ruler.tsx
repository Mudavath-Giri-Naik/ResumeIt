/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './Ruler.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { $createRulerParagraphNode, $isRulerParagraphNode, RulerParagraphNode } from '../nodes/RulerParagraphNode';
import { ElementNode } from 'lexical';

const PADDING = 20;
const DPI = 96;

export default function Ruler(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const rulerRef = useRef<HTMLDivElement>(null);

    const [leftMargin, setLeftMargin] = useState(0); // "Very start of page" = 0
    const [rightMargin, setRightMargin] = useState(0);

    // Indentations in pixels relative to content area
    const [indentLeft, setIndentLeft] = useState(0);
    const [indentFirstLine, setIndentFirstLine] = useState(0);
    const [indentRight, setIndentRight] = useState(0);

    const [isDragging, setIsDragging] = useState(false);
    const [dragType, setDragType] = useState<'firstLine' | 'left' | 'right' | 'marginLeft' | 'marginRight' | null>(null);

    // Track shift for drag calculations
    const [startX, setStartX] = useState(0);
    const [startValue, setStartValue] = useState(0);

    const updateRulerState = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                let element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

                if (element) {
                    // We can read styles if they are set as custom styles or classes.
                    // For this implementation, we assume style properties are set on the element.
                    // Lexical doesn't automatically store "marginLeft", "textIndent" on nodes unless custom.
                    // We'll trust the inline styles or look for a node property.
                    // NOTE: Standard Lexical Playground might not have these methods exposed on the node prototype
                    // without extending the node. However, we can use `getStyle()` if available or `getLatest().style` ??
                    // Actually, basic Node doesn't assume styles.
                    // We will assume `element.getStyle()` returns a string and we parse it.

                    // UNLIKE DOM, Lexical Node might not show styles directly.
                    // We will check if `element.getFormatType()` is used for alignment, but for INDENT,
                    // standard Lexical uses `setIndent(level)`. That's discrete steps (20px, 40px).
                    // The user asks for a RULER, which implies pixel-perfect control.
                    // This requires applying a style to the element.

                    // We will try accessing `getStyle` if it exists (on ElementNode it might not by default).
                    // But we can use `$getSelectionStyleValueForProperty` on the selection to get it?
                    // That works for TextNodes. For ElementNodes, we usually check the DOM.

                    // Simplest approach: Use the DOM element computed style.
                    const domElement = editor.getElementByKey(element.getKey());
                    if (domElement) {
                        const style = window.getComputedStyle(domElement);
                        const paddingLeft = parseFloat(style.paddingLeft || '0');
                        const textIndent = parseFloat(style.textIndent || '0');
                        const paddingRight = parseFloat(style.paddingRight || '0');

                        // Mapping:
                        // Left Indent Marker = paddingLeft
                        // First Line Marker = paddingLeft + textIndent
                        // Right Indent Marker = paddingRight (relative to right edge)

                        setIndentLeft(paddingLeft);
                        setIndentFirstLine(paddingLeft + textIndent);
                        setIndentRight(paddingRight);
                    }
                }
            }
        });
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateRulerState();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL,
        );
    }, [editor, updateRulerState]);

    // Initial load
    useEffect(() => {
        updateRulerState();
    }, [updateRulerState]);

    const handlePointerDown = (e: React.PointerEvent, type: 'firstLine' | 'left' | 'right' | 'marginLeft' | 'marginRight') => {
        e.preventDefault();
        setIsDragging(true);
        setDragType(type);
        setStartX(e.clientX);

        if (type === 'left') setStartValue(indentLeft);
        if (type === 'firstLine') setStartValue(indentFirstLine);
        if (type === 'right') setStartValue(indentRight);
        if (type === 'marginLeft') setStartValue(leftMargin);
        if (type === 'marginRight') setStartValue(rightMargin);

        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !dragType || !rulerRef.current) return;

        // Pixel delta
        const delta = e.clientX - startX;
        let newValue = startValue;

        if (dragType === 'marginLeft') {
            newValue = startValue + delta;
            if (newValue < 0) newValue = 0;
            if (newValue > 300) newValue = 300; // Cap margin
            setLeftMargin(newValue);
        } else if (dragType === 'marginRight') {
            newValue = startValue - delta;
            if (newValue < 0) newValue = 0;
            if (newValue > 300) newValue = 300;
            setRightMargin(newValue);
        } else if (dragType === 'right') {
            newValue = startValue - delta;
            if (newValue < 0) newValue = 0;
            setIndentRight(newValue);
        } else {
            newValue = startValue + delta;
            if (newValue < 0) newValue = 0;

            if (dragType === 'left') {
                setIndentLeft(newValue);
                const offset = indentFirstLine - indentLeft;
                setIndentFirstLine(newValue + offset);
            }
            if (dragType === 'firstLine') {
                setIndentFirstLine(newValue);
            }
        }

        // Real-time DOM update for Margins (Page Layout)
        if (dragType === 'marginLeft' || dragType === 'marginRight') {
            const rootElement = document.querySelector('.ContentEditable__root') as HTMLElement;
            if (rootElement) {
                if (dragType === 'marginLeft') rootElement.style.paddingLeft = `${newValue}px`;
                if (dragType === 'marginRight') rootElement.style.paddingRight = `${newValue}px`;
            }
            return;
        }

        // Real-time DOM update for Indents (Inside Layout)
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const anchorNode = selection.anchor.getNode();
                let element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

                if (element) {
                    // Logic to upgrade to RulerParagraphNode
                    if (element.getType() === 'paragraph' && !$isRulerParagraphNode(element)) {
                        const newElement = $createRulerParagraphNode();
                        const el = element as any;
                        if (el.getFormatType) newElement.setFormat(el.getFormatType());
                        if (el.getIndent) newElement.setIndent(el.getIndent());
                        if (el.getDirection) newElement.setDirection(el.getDirection());
                        newElement.append(...el.getChildren());
                        element.replace(newElement);
                        element = newElement;
                    }

                    if ($isRulerParagraphNode(element)) {
                        let finalLeft = indentLeft;
                        let finalFirst = indentFirstLine;
                        let finalRight = indentRight;

                        if (dragType === 'left') {
                            finalLeft = newValue;
                            finalFirst = newValue + (indentFirstLine - indentLeft);
                        } else if (dragType === 'firstLine') {
                            finalFirst = newValue;
                        } else if (dragType === 'right') {
                            finalRight = newValue;
                        }

                        // Set Persistent Styles
                        element.setPaddingLeft(finalLeft);
                        element.setTextIndent(finalFirst - finalLeft);
                        element.setPaddingRight(finalRight);
                    }
                }
            }
        });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        setDragType(null);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    return (
        <div className="ruler-container" ref={rulerRef} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
            {/* Margins - Absolute Positioned */}
            <div
                className="ruler-margin-left"
                style={{ width: `${leftMargin}px`, position: 'absolute', left: 0, top: 0, height: '100%', backgroundColor: '#e8eaed', cursor: 'ew-resize', zIndex: 20 }}
                onPointerDown={(e) => handlePointerDown(e, 'marginLeft')}
                title="Left Page Margin"
            />
            <div
                className="ruler-margin-right"
                style={{ width: `${rightMargin}px`, position: 'absolute', right: 0, top: 0, height: '100%', backgroundColor: '#e8eaed', cursor: 'ew-resize', zIndex: 20 }}
                onPointerDown={(e) => handlePointerDown(e, 'marginRight')}
                title="Right Page Margin"
            />

            {/* Ticks & Numbers */}
            <div className="ruler-track" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }}>
                {Array.from({ length: 100 }).map((_, index) => {
                    // Loop from -10 to 90 to cover margins
                    const i = index - 12; // Start from -1.5 inches approx
                    const pos = leftMargin + (i * DPI) / 8;

                    if (pos < 0 || (rulerRef.current && pos > rulerRef.current.offsetWidth)) return null;

                    const isMajor = i % 8 === 0;
                    const isHalf = i % 4 === 0 && !isMajor;
                    const isQuarter = i % 2 === 0 && !isMajor && !isHalf;

                    const label = i / 8;

                    return (
                        <div
                            key={index}
                            className={`ruler-tick ${isMajor ? 'major' : isHalf ? 'half' : isQuarter ? 'quarter' : 'minor'}`}
                            style={{ left: `${pos}px`, position: 'absolute' }}
                        >
                            {isMajor && label > 0 && <span className="ruler-number">{label}</span>}
                        </div>
                    );
                })}
            </div>

            {/* Markers */}

            {/* Left Indent - Bottom Triangle + Rect */}


            {/* First Line Indent - Top Triangle */}
            <div
                className="ruler-marker-first-line"
                style={{ left: `${leftMargin + indentFirstLine}px` }}
                onPointerDown={(e) => handlePointerDown(e, 'firstLine')}
                title="First Line Indent"
            />

            {/* Right Indent */}
            <div
                className="ruler-marker-right-indent"
                style={{ right: `${rightMargin + indentRight}px` }}
                onPointerDown={(e) => handlePointerDown(e, 'right')}
                title="Right Indent"
            />

        </div>
    );
}
