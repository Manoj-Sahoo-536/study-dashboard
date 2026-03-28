import { LayoutTemplate, Monitor } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useWindowStore } from '../store/windowStore';

interface SnapControlsProps {
    windowId: string;
}

type SnapType =
    | 'left' | 'right'
    | '2/3-left' | '1/3-right'
    | '1/3-left' | '2/3-right'
    | '3-left' | '3-mid' | '3-right'
    | 'tl' | 'tr' | 'bl' | 'br'
    | 'full';

export const SnapControls = ({ windowId }: SnapControlsProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const hideTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const updateWindow = useWindowStore((state) => state.updateWindow);

    const openMenu = () => {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPos({
                top: rect.bottom + 6,
                left: Math.max(10, rect.right - 260),
            });
        }
        setShowMenu(true);
    };

    const scheduleClose = () => {
        hideTimerRef.current = setTimeout(() => setShowMenu(false), 200);
    };

    // Clean up timer on unmount
    useEffect(() => () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }, []);

    const handleSnap = (type: SnapType) => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const bounds: Record<SnapType, { x: number; y: number; width: number; height: number }> = {
            'left':      { x: 0,                   y: 0,                 width: Math.floor(w / 2),       height: h },
            'right':     { x: Math.floor(w / 2),   y: 0,                 width: Math.ceil(w / 2),        height: h },
            '2/3-left':  { x: 0,                   y: 0,                 width: Math.floor((w / 3) * 2), height: h },
            '1/3-right': { x: Math.floor((w/3)*2), y: 0,                 width: Math.ceil(w / 3),        height: h },
            '1/3-left':  { x: 0,                   y: 0,                 width: Math.floor(w / 3),       height: h },
            '2/3-right': { x: Math.floor(w / 3),   y: 0,                 width: Math.ceil((w / 3) * 2),  height: h },
            '3-left':    { x: 0,                   y: 0,                 width: Math.floor(w / 3),       height: h },
            '3-mid':     { x: Math.floor(w / 3),   y: 0,                 width: Math.floor(w / 3),       height: h },
            '3-right':   { x: Math.floor((w/3)*2), y: 0,                 width: Math.ceil(w / 3),        height: h },
            'tl':        { x: 0,                   y: 0,                 width: Math.floor(w / 2),       height: Math.floor(h / 2) },
            'tr':        { x: Math.floor(w / 2),   y: 0,                 width: Math.ceil(w / 2),        height: Math.floor(h / 2) },
            'bl':        { x: 0,                   y: Math.floor(h / 2), width: Math.floor(w / 2),       height: Math.ceil(h / 2) },
            'br':        { x: Math.floor(w / 2),   y: Math.floor(h / 2), width: Math.ceil(w / 2),        height: Math.ceil(h / 2) },
            'full':      { x: 0,                   y: 0,                 width: w,                       height: h },
        };

        updateWindow(windowId, bounds[type]);
        setShowMenu(false);
    };

    // Individual snap button — stops mousedown so react-rnd doesn't intercept,
    // and fires snap directly via onPointerUp to bypass any residual drag suppression
    const SnapBtn = ({ type, children, title }: { type: SnapType; children: React.ReactNode; title?: string }) => (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
            onPointerUp={(e) => { e.stopPropagation(); handleSnap(type); }}
            className="h-10 border border-white/20 rounded hover:bg-white/10 flex p-1 gap-0.5 group/btn transition-colors cursor-pointer"
        >
            {children}
        </button>
    );

    const Active = () => <div className="h-full bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors flex-1" />;
    const Inactive = () => <div className="h-full bg-transparent rounded-sm flex-1" />;

    return (
        <>
            <button
                ref={buttonRef}
                type="button"
                onMouseEnter={openMenu}
                onMouseLeave={scheduleClose}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors mr-1 no-drag cursor-pointer"
                title="Snap Layouts"
                aria-label="Snap layouts"
            >
                <LayoutTemplate size={12} />
            </button>

            {showMenu && createPortal(
                <div
                    ref={menuRef}
                    className="fixed z-[9999] bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 w-64"
                    style={{ top: menuPos.top, left: menuPos.left }}
                    onMouseEnter={openMenu}
                    onMouseLeave={scheduleClose}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2 px-1">Snap Layout</p>

                    <div className="space-y-2">
                        {/* Row 1: Half & Half */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <SnapBtn type="left" title="Left half"><Active /><Inactive /></SnapBtn>
                            <SnapBtn type="right" title="Right half"><Inactive /><Active /></SnapBtn>
                        </div>

                        {/* Row 2: 2/3 + 1/3 */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <SnapBtn type="2/3-left" title="Left 2/3">
                                <div className="h-full bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" style={{ flex: 2 }} />
                                <div className="h-full bg-transparent rounded-sm" style={{ flex: 1 }} />
                            </SnapBtn>
                            <SnapBtn type="1/3-right" title="Right 1/3">
                                <div className="h-full bg-transparent rounded-sm" style={{ flex: 2 }} />
                                <div className="h-full bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" style={{ flex: 1 }} />
                            </SnapBtn>
                        </div>

                        {/* Row 3: 1/3 + 2/3 */}
                        <div className="grid grid-cols-2 gap-1.5">
                            <SnapBtn type="1/3-left" title="Left 1/3">
                                <div className="h-full bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" style={{ flex: 1 }} />
                                <div className="h-full bg-transparent rounded-sm" style={{ flex: 2 }} />
                            </SnapBtn>
                            <SnapBtn type="2/3-right" title="Right 2/3">
                                <div className="h-full bg-transparent rounded-sm" style={{ flex: 1 }} />
                                <div className="h-full bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" style={{ flex: 2 }} />
                            </SnapBtn>
                        </div>

                        {/* Row 4: Three columns */}
                        <div className="grid grid-cols-3 gap-1.5">
                            <SnapBtn type="3-left" title="Left third"><Active /><Inactive /><Inactive /></SnapBtn>
                            <SnapBtn type="3-mid" title="Center third"><Inactive /><Active /><Inactive /></SnapBtn>
                            <SnapBtn type="3-right" title="Right third"><Inactive /><Inactive /><Active /></SnapBtn>
                        </div>

                        {/* Row 5: All four quarters */}
                        <div className="grid grid-cols-4 gap-1.5">
                            <SnapBtn type="tl" title="Top left quarter">
                                <div className="w-full h-full flex flex-col gap-0.5">
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" />
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                    </div>
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                    </div>
                                </div>
                            </SnapBtn>
                            <SnapBtn type="tr" title="Top right quarter">
                                <div className="w-full h-full flex flex-col gap-0.5">
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                        <div className="flex-1 bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" />
                                    </div>
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                    </div>
                                </div>
                            </SnapBtn>
                            <SnapBtn type="bl" title="Bottom left quarter">
                                <div className="w-full h-full flex flex-col gap-0.5">
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                    </div>
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" />
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                    </div>
                                </div>
                            </SnapBtn>
                            <SnapBtn type="br" title="Bottom right quarter">
                                <div className="w-full h-full flex flex-col gap-0.5">
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                    </div>
                                    <div className="flex gap-0.5 flex-1">
                                        <div className="flex-1 bg-transparent rounded-sm" />
                                        <div className="flex-1 bg-white/20 group-hover/btn:bg-blue-500/50 rounded-sm transition-colors" />
                                    </div>
                                </div>
                            </SnapBtn>
                        </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-white/10">
                        <button
                            type="button"
                            onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                            onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                            onPointerUp={(e) => { e.stopPropagation(); handleSnap('full'); }}
                            className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
                        >
                            <Monitor size={12} />
                            <span>Maximize</span>
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
