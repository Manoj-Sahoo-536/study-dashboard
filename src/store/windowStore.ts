import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AppWindow {
    id: string;
    type: 'browser' | 'pdf' | 'video' | 'ai';
    title: string;
    url?: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
    isMinimized: boolean;
}

interface WindowState {
    windows: AppWindow[];
    activeWindowId: string | null;
    isFocusMode: boolean;

    addWindow: (window: Omit<AppWindow, 'zIndex' | 'isMinimized'>) => void;
    removeWindow: (id: string) => void;
    updateWindow: (id: string, updates: Partial<AppWindow>) => void;
    bringToFront: (id: string) => void;
    minimizeWindow: (id: string) => void;
    toggleFocusMode: () => void;

    // Ref-counted interaction lock (prevents click-through during drag/resize)
    windowInteractingCount: number;
    setWindowInteracting: (delta: 1 | -1) => void;
}

export const useWindowStore = create<WindowState>()(
    persist(
        (set) => ({
            windows: [],
            activeWindowId: null,
            isFocusMode: false,
            windowInteractingCount: 0,

            addWindow: (windowData) =>
                set((state) => {
                    const maxZIndex = state.windows.reduce((max, w) => Math.max(max, w.zIndex), 0);
                    return {
                        windows: [
                            ...state.windows,
                            { ...windowData, zIndex: maxZIndex + 1, isMinimized: false },
                        ],
                        activeWindowId: windowData.id,
                    };
                }),

            removeWindow: (id) =>
                set((state) => ({
                    windows: state.windows.filter((w) => w.id !== id),
                    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
                })),

            updateWindow: (id, updates) =>
                set((state) => ({
                    windows: state.windows.map((w) => (w.id === id ? { ...w, ...updates } : w)),
                })),

            bringToFront: (id) =>
                set((state) => {
                    const maxZIndex = state.windows.reduce((max, w) => Math.max(max, w.zIndex), 0);
                    return {
                        windows: state.windows.map((w) =>
                            w.id === id ? { ...w, zIndex: maxZIndex + 1 } : w
                        ),
                        activeWindowId: id,
                    };
                }),

            minimizeWindow: (id) =>
                set((state) => ({
                    windows: state.windows.map((w) =>
                        w.id === id ? { ...w, isMinimized: !w.isMinimized } : w
                    ),
                    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
                })),

            toggleFocusMode: () =>
                set((state) => ({
                    isFocusMode: !state.isFocusMode,
                })),

            setWindowInteracting: (delta) =>
                set((state) => ({
                    windowInteractingCount: Math.max(0, state.windowInteractingCount + delta),
                })),
        }),
        {
            name: 'work-nest-storage',
            // Only persist focus mode preference — NOT open windows.
            // Persisting windows causes stale file paths and broken webviews on restart.
            partialize: (state) => ({
                isFocusMode: state.isFocusMode,
            }),
        }
    )
);
