import { useRef, useState, useEffect } from 'react';
import type { AppWindow } from '../store/windowStore';
import { useWindowStore } from '../store/windowStore';

interface VideoAppProps {
    window: AppWindow;
}

export const VideoApp = ({ window }: VideoAppProps) => {
    const { bringToFront, activeWindowId, windowInteractingCount } = useWindowStore();
    const webviewRef = useRef<Electron.WebviewTag>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isActive = activeWindowId === window.id;

    // Use file:// protocol for local video files
    const videoUrl = window.url?.startsWith('file://') ? window.url : `file://${window.url}`;

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview) return;

        const handleDidStartLoading = () => setIsLoading(true);
        const handleDidStopLoading = () => setIsLoading(false);

        webview.addEventListener('did-start-loading', handleDidStartLoading);
        webview.addEventListener('did-stop-loading', handleDidStopLoading);

        return () => {
            webview.removeEventListener('did-start-loading', handleDidStartLoading);
            webview.removeEventListener('did-stop-loading', handleDidStopLoading);
        };
    }, []);

    return (
        <div
            className="flex flex-col h-full w-full bg-black relative"
            onMouseDownCapture={() => bringToFront(window.id)}
        >
            {/* Overlay to capture clicks when window is not focused */}
            {!isActive && (
                <div
                    className="absolute inset-0 z-50 bg-transparent cursor-pointer"
                    onClick={() => bringToFront(window.id)}
                />
            )}

            {/* Loading Spinner */}
            {isLoading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
            )}

            <webview
                ref={webviewRef}
                src={videoUrl}
                className={`absolute inset-0 w-full h-full ${windowInteractingCount > 0 ? 'pointer-events-none' : ''}`}
                useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                // @ts-expect-error — allowpopups is a valid Electron webview attribute
                allowpopups="true"
            />
        </div>
    );
};
