import { Globe, FileText, Video, Sparkles, Eye, EyeOff, ChevronUp } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';
import type { AppWindow } from '../store/windowStore';

interface TaskbarProps {
    onAddBrowser: () => void;
    onAddPDF: () => void;
    onAddVideo: () => void;
    onOpenAISite: (url: string) => void;
    onToggleFocusMode: () => void;
    isFocusMode: boolean;
}

const AI_SITES = [
    { name: 'ChatGPT', url: 'https://chat.openai.com' },
    { name: 'Claude', url: 'https://claude.ai' },
    { name: 'Gemini', url: 'https://gemini.google.com' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai' },
    { name: 'DeepSeek', url: 'https://chat.deepseek.com' },
];

const WIN_CONFIG: Record<AppWindow['type'], {
    Icon: React.ElementType;
    iconColor: string;
    chipColor: string;
    dotColor: string;
}> = {
    browser: { Icon: Globe,    iconColor: 'text-emerald-400', chipColor: 'bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-white/10 hover:border-emerald-400/50 hover:bg-emerald-500/20', dotColor: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' },
    pdf:     { Icon: FileText, iconColor: 'text-rose-400',    chipColor: 'bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-white/10 hover:border-rose-400/50 hover:bg-rose-500/20',       dotColor: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]'    },
    video:   { Icon: Video,    iconColor: 'text-amber-400',   chipColor: 'bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/20',     dotColor: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'   },
    ai:      { Icon: Sparkles, iconColor: 'text-purple-400',  chipColor: 'bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-white/10 hover:border-purple-400/50 hover:bg-purple-500/20',     dotColor: 'bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]'   },
};

// Reusable tooltip wrapper
const Tip = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="relative group/tip flex flex-col items-center">
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover/tip:opacity-100 translate-y-1 group-hover/tip:translate-y-0 transition-all duration-150 z-[9999]">
            <div className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap shadow-xl">
                {label}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900/90" />
            </div>
        </div>
        {children}
    </div>
);

export const Taskbar = ({
    onAddBrowser, onAddPDF, onAddVideo, onOpenAISite, onToggleFocusMode, isFocusMode,
}: TaskbarProps) => {
    const [showAIMenu, setShowAIMenu] = useState(false);
    const aiMenuRef = useRef<HTMLDivElement>(null);
    const aiButtonRef = useRef<HTMLButtonElement>(null);
    const { windows, minimizeWindow } = useWindowStore();
    const minimized = windows.filter((w) => w.isMinimized);

    useEffect(() => {
        if (!showAIMenu) return;
        const handler = (e: MouseEvent) => {
            if (
                aiMenuRef.current && !aiMenuRef.current.contains(e.target as Node) &&
                aiButtonRef.current && !aiButtonRef.current.contains(e.target as Node)
            ) setShowAIMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showAIMenu]);

    return (
        <>
            {/* AI site popup — portal-free, anchored above button via absolute */}
            {showAIMenu && (
                <div
                    ref={aiMenuRef}
                    className="absolute bottom-[52px] right-4 z-[9999] bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-1.5 min-w-[160px] flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
                    {AI_SITES.map((site) => (
                        <button
                            key={site.name}
                            onClick={() => { onOpenAISite(site.url); setShowAIMenu(false); }}
                            className="text-left px-3 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-lg transition-colors font-medium"
                        >
                            {site.name}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Floating taskbar ─────────────────────────────────────────────── */}
            <div className="h-[56px] px-3 flex items-center justify-center gap-3 bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/5">

                {/* ── Minimized windows ─────────────────────────────────────────── */}
                {minimized.length > 0 && (
                    <>
                        <div className="flex items-center gap-2">
                            {minimized.map((win) => {
                                const { Icon, iconColor, chipColor, dotColor } = WIN_CONFIG[win.type];
                                return (
                                    <Tip key={win.id} label={win.title}>
                                        <div className="relative">
                                            <button
                                                type="button"
                                                onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                                                onPointerUp={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
                                                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 ${chipColor}`}
                                            >
                                                <Icon size={18} className={iconColor} />
                                            </button>
                                            <span className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                        </div>
                                    </Tip>
                                );
                            })}
                        </div>

                        {/* Divider between minimized apps and tools */}
                        <div className="text-pink-500/80 animate-pulse px-1 select-none flex items-center justify-center shrink-0 text-[18px]">
                            ❤️
                        </div>
                    </>
                )}

                {/* ── Tools ─────────────────────────────────────────────────────── */}
                <div className="flex items-center gap-2">
                    <Tip label="New Browser">
                        <button onClick={onAddBrowser}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-white/10 text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-400 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                            <Globe size={18} />
                        </button>
                    </Tip>
                    <Tip label="Open PDF">
                        <button onClick={onAddPDF}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-rose-400 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                            <FileText size={18} />
                        </button>
                    </Tip>
                    <Tip label="Open Video">
                        <button onClick={onAddVideo}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.2)] border border-white/10 text-amber-400 hover:bg-amber-500 hover:text-white hover:border-amber-400 transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                            <Video size={18} />
                        </button>
                    </Tip>
                    <Tip label="AI Tools">
                        <button
                            ref={aiButtonRef}
                            onClick={() => setShowAIMenu(!showAIMenu)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.2)] border transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(168,85,247,0.5)] ${
                                showAIMenu
                                    ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                                    : 'bg-white/5 border-white/10 text-purple-400 hover:bg-purple-500 hover:text-white hover:border-purple-400'
                            }`}>
                            <Sparkles size={18} />
                        </button>
                    </Tip>

                    {/* Divider */}
                    <div className="w-px h-8 bg-white/20 mx-1 rounded-full" />

                    <Tip label={isFocusMode ? 'Exit Focus' : 'Focus Mode'}>
                        <button onClick={onToggleFocusMode}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.2)] border transition-all duration-200 hover:scale-110 hover:shadow-[0_0_15px_rgba(14,165,233,0.5)] ${
                                isFocusMode
                                    ? 'bg-sky-500 text-white border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.5)]'
                                    : 'bg-white/5 border-white/10 text-sky-400 hover:bg-sky-500 hover:text-white hover:border-sky-400'
                            }`}>
                            {isFocusMode ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </Tip>
                </div>
            </div>
        </>
    );
};

// Small arrow tab shown at very bottom when taskbar is hidden
export const TaskbarRevealTab = ({ onClick }: { onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center w-12 h-6 bg-slate-900/80 backdrop-blur-2xl border border-white/10 border-b-0 rounded-t-xl text-gray-400 hover:bg-white/10 hover:text-white shadow-[0_-4px_12px_rgba(0,0,0,0.3)] transition-all duration-200"
        title="Show toolbar"
        aria-label="Show toolbar"
    >
        <ChevronUp size={16} strokeWidth={3} />
    </button>
);
