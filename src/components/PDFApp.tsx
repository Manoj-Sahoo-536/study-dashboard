import { useRef, useEffect, useState } from 'react';
import type { AppWindow } from '../store/windowStore';
import { useWindowStore } from '../store/windowStore';

interface PDFAppProps {
    window: AppWindow;
}

export const PDFApp = ({ window: appWindow }: PDFAppProps) => {
    const { bringToFront, activeWindowId, windowInteractingCount } = useWindowStore();
    const webviewRef = useRef<Electron.WebviewTag>(null);
    const [preloadUrl, setPreloadUrl] = useState<string | undefined>(undefined);
    const [isPreloadReady, setIsPreloadReady] = useState(false);
    const [preloadError, setPreloadError] = useState(false);

    const isActive = activeWindowId === appWindow.id;

    useEffect(() => {
        const fetchAppPath = async () => {
            try {
                const appPath = await window.swiftShuttleAPI.getAppPath();
                const normalizedPath = appPath.replace(/\\/g, '/');
                const prefix = normalizedPath.startsWith('/') ? 'file://' : 'file:///';
                setPreloadUrl(`${prefix}${normalizedPath}/dist-electron/webview.js`);
            } catch (error) {
                console.error('[PDFApp] Failed to resolve preload path:', error);
                setPreloadError(true);
            } finally {
                setIsPreloadReady(true);
            }
        };
        fetchAppPath();
    }, []);

    // Use file:// protocol for local PDF files
    const pdfUrl = appWindow.url?.startsWith('file://') ? appWindow.url : `file://${appWindow.url}`;

    if (preloadError) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-600 gap-3 p-6">
                <div className="text-4xl">⚠️</div>
                <p className="font-semibold text-sm text-center">Could not resolve the preload script path.</p>
                <p className="text-xs text-gray-500 text-center">
                    This is an internal error. Please restart the app.
                </p>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col h-full w-full bg-gray-100 relative"
            onMouseDownCapture={() => bringToFront(appWindow.id)}
        >
            {/* Overlay to capture clicks when window is not focused */}
            {!isActive && (
                <div
                    className="absolute inset-0 z-50 bg-transparent cursor-pointer"
                    onClick={() => bringToFront(appWindow.id)}
                />
            )}

            {isPreloadReady && (
                <webview
                    ref={webviewRef}
                    src={pdfUrl}
                    preload={preloadUrl}
                    className={`absolute inset-0 w-full h-full ${windowInteractingCount > 0 ? 'pointer-events-none' : ''}`}
                    useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    // @ts-expect-error — plugins is a valid Electron webview attribute
                    plugins="true"
                />
            )}
        </div>
    );
};
