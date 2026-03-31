import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, X } from 'lucide-react';
import type { AppWindow } from '../store/windowStore';
import { useWindowStore } from '../store/windowStore';

interface BrowserAppProps {
    window: AppWindow;
}

const resolveUrl = (input: string): string => {
    const trimmed = input.trim();
    // Already a valid URL
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // Looks like a domain (has a dot and no spaces)
    if (trimmed.includes('.') && !trimmed.includes(' ')) return 'https://' + trimmed;
    // Treat everything else as a search query
    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
};

export const BrowserApp = ({ window }: BrowserAppProps) => {
    const { updateWindow, bringToFront, windowInteractingCount } = useWindowStore();
    const [urlInput, setUrlInput] = useState(window.url || 'https://google.com');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const webviewRef = useRef<Electron.WebviewTag>(null);

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview) return;

        const handleDidStartLoading = () => {
            setIsLoading(true);
            setError(null);
        };
        const handleDidStopLoading = () => setIsLoading(false);
        const handleDidNavigate = (e: Electron.DidNavigateEvent) => {
            setUrlInput(e.url);
            updateWindow(window.id, { url: e.url });
        };
        const handlePageTitleUpdated = (e: Electron.PageTitleUpdatedEvent) => {
            updateWindow(window.id, { title: e.title });
        };
        const handleDidFailLoad = (e: Electron.DidFailLoadEvent) => {
            // -3 = ERR_ABORTED (redirect/stop), safe to ignore
            if (e.errorCode !== -3) {
                setIsLoading(false);
                setError(`Failed to load: ${e.errorDescription} (${e.errorCode})`);
            } else {
                setIsLoading(false);
            }
        };
        const handleFocus = () => bringToFront(window.id);

        webview.addEventListener('did-start-loading', handleDidStartLoading);
        webview.addEventListener('did-stop-loading', handleDidStopLoading);
        webview.addEventListener('did-navigate', handleDidNavigate as EventListener);
        webview.addEventListener('page-title-updated', handlePageTitleUpdated as EventListener);
        webview.addEventListener('did-fail-load', handleDidFailLoad as EventListener);
        webview.addEventListener('focus', handleFocus);

        return () => {
            webview.removeEventListener('did-start-loading', handleDidStartLoading);
            webview.removeEventListener('did-stop-loading', handleDidStopLoading);
            webview.removeEventListener('did-navigate', handleDidNavigate as EventListener);
            webview.removeEventListener('page-title-updated', handlePageTitleUpdated as EventListener);
            webview.removeEventListener('did-fail-load', handleDidFailLoad as EventListener);
            webview.removeEventListener('focus', handleFocus);
        };
    }, [window.id, updateWindow, bringToFront]);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        const resolved = resolveUrl(urlInput);
        setUrlInput(resolved);
        webviewRef.current?.loadURL(resolved);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white">
            {/* Navigation Bar */}
            <div className="flex items-center space-x-1 px-2 py-1.5 bg-gray-100 border-b border-gray-200">
                <button
                    onClick={() => webviewRef.current?.goBack()}
                    className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                    title="Go back"
                    aria-label="Go back"
                >
                    <ArrowLeft size={15} />
                </button>
                <button
                    onClick={() => webviewRef.current?.goForward()}
                    className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                    title="Go forward"
                    aria-label="Go forward"
                >
                    <ArrowRight size={15} />
                </button>
                <button
                    onClick={() => {
                        if (isLoading) {
                            webviewRef.current?.stop();
                        } else {
                            webviewRef.current?.reload();
                        }
                    }}
                    className="p-1 hover:bg-gray-200 rounded text-gray-600 transition-colors"
                    title={isLoading ? 'Stop loading' : 'Reload'}
                    aria-label={isLoading ? 'Stop loading' : 'Reload'}
                >
                    {isLoading
                        ? <X size={15} />
                        : <RotateCw size={15} />
                    }
                </button>

                <form onSubmit={handleNavigate} className="flex-1 flex items-center">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <Search size={13} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full pl-7 pr-3 py-1 text-[12px] bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Search or enter URL..."
                            spellCheck={false}
                        />
                    </div>
                </form>
            </div>

            {/* Webview */}
            <div className="flex-1 relative">
                <webview
                    ref={webviewRef}
                    src={window.url || 'https://google.com'}
                    className={`absolute inset-0 w-full h-full ${windowInteractingCount > 0 ? 'pointer-events-none' : ''}`}
                    useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    partition="persist:work-nest"
                    // @ts-expect-error — allowpopups is a valid Electron webview attribute
                    allowpopups="true"
                />

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-center p-6 z-10">
                        <div className="text-4xl mb-3">⚠️</div>
                        <p className="text-gray-800 font-semibold text-sm">{error}</p>
                        <p className="text-xs text-gray-500 mt-1">Check your network connection or try another URL.</p>
                        <button
                            onClick={() => {
                                setError(null);
                                setIsLoading(true);
                                webviewRef.current?.reload();
                            }}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
