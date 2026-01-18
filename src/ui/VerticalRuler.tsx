
import './VerticalRuler.css';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_CRITICAL, SELECTION_CHANGE_COMMAND } from 'lexical';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';

const PADDING = 20; // Default offset if needed, but we use topMargin
const DPI = 96;

export default function VerticalRuler(): JSX.Element {
    const [editor] = useLexicalComposerContext();
    const rulerRef = useRef<HTMLDivElement>(null);

    // Default top margin to 40px
    const [topMargin, setTopMargin] = useState(40);
    const [indicatorPosition, setIndicatorPosition] = useState<number | null>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startMargin, setStartMargin] = useState(0);

    const updateIndicator = useCallback(() => {
        if (rulerRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                const rulerRect = rulerRef.current.getBoundingClientRect();

                const relativeTop = rect.top - rulerRect.top;
                if (relativeTop >= 0 && relativeTop <= rulerRect.height) {
                    setIndicatorPosition(relativeTop);
                }
            } else {
                setIndicatorPosition(null);
            }
        }
    }, []);

    // Read initial state and listeners
    useEffect(() => {
        // Initial read
        editor.getEditorState().read(() => {
            const rootElement = document.querySelector('.ContentEditable__root');
            if (rootElement) {
                const style = window.getComputedStyle(rootElement);
                const pt = parseFloat(style.paddingTop || '40');
                setTopMargin(pt);
            }
            updateIndicator();
        });

        const scroller = document.querySelector('.editor-scroller');
        const handleScroll = () => {
            updateIndicator();
        };
        if (scroller) {
            scroller.addEventListener('scroll', handleScroll);
        }
        window.addEventListener('resize', handleScroll);

        // Listeners for updates
        const removeUpdateListener = editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateIndicator();
            });
        });

        const removeCommandListener = editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                updateIndicator();
                return false;
            },
            COMMAND_PRIORITY_CRITICAL
        );

        return () => {
            if (scroller) {
                scroller.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('resize', handleScroll);
            removeUpdateListener();
            removeCommandListener();
        };
    }, [editor, updateIndicator]);

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setStartY(e.clientY);
        setStartMargin(topMargin);
        (e.target as Element).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const delta = e.clientY - startY;
        let newValue = startMargin + delta;

        if (newValue < 0) newValue = 0;
        if (newValue > 300) newValue = 300; // Cap margin

        setTopMargin(newValue);

        // Update Editor Padding Top
        const rootElement = document.querySelector('.ContentEditable__root') as HTMLElement;
        if (rootElement) {
            rootElement.style.paddingTop = `${newValue}px`;

            // Also update placeholder top position
            const placeholder = document.querySelector('.ContentEditable__placeholder') as HTMLElement;
            if (placeholder) {
                placeholder.style.top = `${newValue}px`;
            }
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        (e.target as Element).releasePointerCapture(e.pointerId);
    };

    return (
        <div
            className="vertical-ruler-container"
            ref={rulerRef}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerDown={handlePointerDown}
            style={{ cursor: 'ns-resize' }}
        >
            {/* Top Margin Area - Draggable Bottom Edge */}
            <div
                className="vertical-ruler-margin-top"
                style={{
                    height: `${topMargin}px`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: '#e8eaed',
                    zIndex: 20
                }}
                title="Top Margin"
            />

            {/* Cursor Indicator */}
            {indicatorPosition !== null && (
                <div
                    className="vertical-ruler-indicator"
                    style={{
                        position: 'absolute',
                        top: `${indicatorPosition}px`,
                        left: 0,
                        width: '100%',
                        height: '1px',
                        backgroundColor: '#1a73e8',
                        zIndex: 30,
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* Ticks & Numbers */}
            <div className="vertical-ruler-track" style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', pointerEvents: 'none' }}>
                {Array.from({ length: 120 }).map((_, index) => {
                    // A4 height is ~297mm approx 11.7 inches.
                    // 120 * 1/8 inch = 15 inches covers it.

                    const i = index - 4; // Start slightly above
                    const pos = topMargin + (i * DPI) / 8; // Ticks start relative to margin?
                    // No, ruler is absolute. 0 at top of page.
                    // Margin covers the 0 to X area.
                    // Ticks usually start from 0 relative to PAGE TOP.
                    // But "0" on ruler matches "0" on text start?
                    // Horizontal ruler: 0 matches text start (Left Margin).
                    // Vertical ruler: 0 matches text start (Top Margin).

                    // So pos = topMargin + ...
                    // If i=0, pos = topMargin. This is the 0 point.

                    if (pos < 0 || (rulerRef.current && pos > rulerRef.current.offsetHeight)) return null;

                    const isMajor = i % 8 === 0;
                    const isHalf = i % 4 === 0 && !isMajor;
                    const isQuarter = i % 2 === 0 && !isMajor && !isHalf;

                    const label = i / 8;

                    return (
                        <div
                            key={index}
                            className={`vertical-ruler-tick ${isMajor ? 'major' : isHalf ? 'half' : isQuarter ? 'quarter' : 'minor'}`}
                            style={{ top: `${pos}px`, position: 'absolute' }}
                        >
                            {isMajor && label > 0 && <span className="vertical-ruler-number">{label}</span>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
