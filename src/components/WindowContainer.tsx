import { Rnd } from 'react-rnd';
import { X, Minus } from 'lucide-react';
import { useState } from 'react';
import { useWindowStore } from '../store/windowStore';
import type { AppWindow } from '../store/windowStore';
import { SnapControls } from './SnapControls';

interface WindowContainerProps {
    window: AppWindow;
    children: React.ReactNode;
}

export const WindowContainer = ({ window: appWindow, children }: WindowContainerProps) => {
    const { updateWindow, bringToFront, removeWindow, minimizeWindow, setWindowInteracting } =
        useWindowStore();

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    if (appWindow.isMinimized) {
        return null;
    }

    return (
        <Rnd
            size={{ width: appWindow.width, height: appWindow.height }}
            position={{ x: appWindow.x, y: appWindow.y }}
            onDragStart={() => {
                setIsDragging(true);
                setWindowInteracting(1);
            }}
            onDragStop={(_e, d) => {
                updateWindow(appWindow.id, { x: d.x, y: d.y });
                setTimeout(() => {
                    setIsDragging(false);
                    setWindowInteracting(-1);
                }, 50);
            }}
            onResizeStart={() => {
                setIsResizing(true);
                setWindowInteracting(1);
            }}
            onResizeStop={(_e, _direction, ref, _delta, position) => {
                updateWindow(appWindow.id, {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    ...position,
                });
                setTimeout(() => {
                    setIsResizing(false);
                    setWindowInteracting(-1);
                }, 50);
            }}
            onMouseDownCapture={() => bringToFront(appWindow.id)}
            style={{ zIndex: appWindow.zIndex }}
            className="bg-white rounded-2xl shadow-2xl border border-white/20 flex flex-col ring-1 ring-black/5 pointer-events-auto overflow-visible"
            dragHandleClassName="window-header"
            cancel=".no-drag"
            bounds="parent"
            minWidth={300}
            minHeight={200}
        >
            {/* Window Header */}
            <div
                className="h-7 bg-gray-50/80 backdrop-blur-md rounded-t-2xl flex items-center px-3 border-b border-gray-200/50 transition-colors hover:bg-gray-100/80 relative group"
                title={appWindow.title}
            >
                {/* Drag Handle Layer — behind everything */}
                <div className="window-header absolute inset-0 cursor-move rounded-t-2xl" />

                {/* Traffic Lights (Left) */}
                <div className="flex items-center gap-1.5 relative z-10 no-drag mr-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            removeWindow(appWindow.id);
                        }}
                        className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] cursor-pointer hover:brightness-90 transition-[filter] focus:outline-none"
                        title="Close window"
                        aria-label="Close window"
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            minimizeWindow(appWindow.id);
                        }}
                        className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] cursor-pointer hover:brightness-90 transition-[filter] focus:outline-none"
                        title="Minimize window"
                        aria-label="Minimize window"
                    />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] opacity-50 cursor-not-allowed" title="Maximize (use snap layouts instead)" />
                </div>

                {/* Title (Centered) */}
                <span className="text-[10px] font-medium text-gray-500 truncate absolute left-1/2 -translate-x-1/2 max-w-[50%] pointer-events-none z-0">
                    {appWindow.title}
                </span>

                {/* Controls (Right) */}
                <div className="ml-auto flex items-center relative z-10 no-drag gap-1">
                    <SnapControls windowId={appWindow.id} />
                    <button
                        type="button"
                        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerUp={(e) => { e.stopPropagation(); minimizeWindow(appWindow.id); }}
                        className="p-1 rounded-full hover:bg-yellow-100 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Minimize"
                        aria-label="Minimize window"
                    >
                        <Minus size={12} />
                    </button>
                    <button
                        type="button"
                        onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onPointerUp={(e) => { e.stopPropagation(); removeWindow(appWindow.id); }}
                        className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                        title="Close"
                        aria-label="Close window"
                    >
                        <X size={12} />
                    </button>
                </div>
            </div>

            {/* Window Content */}
            <div
                className={`flex-1 relative bg-white flex flex-col overflow-hidden h-full rounded-b-2xl ${
                    isDragging || isResizing ? 'pointer-events-none select-none' : ''
                }`}
            >
                {children}
            </div>
        </Rnd>
    );
};
