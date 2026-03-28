import { useRef, useEffect } from 'react';

export const ExcalidrawBackground = () => {
    const excalidrawRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const webview = excalidrawRef.current as any;
        if (!webview) return;

        const handleDidFinishLoad = () => {
            // Hide Excalidraw's welcome screen for a cleaner canvas
            webview.insertCSS(`
                .welcome-screen-center,
                .welcome-screen-menu {
                    display: none !important;
                }
            `);
        };

        webview.addEventListener('did-finish-load', handleDidFinishLoad);
        return () => {
            webview.removeEventListener('did-finish-load', handleDidFinishLoad);
        };
    }, []);

    return (
        <webview
            ref={excalidrawRef}
            src="https://excalidraw.com/?theme=dark"
            className="absolute inset-0 w-full h-full z-0"
            useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            // @ts-expect-error — allowpopups takes the string "true" in Electron, not a boolean
            allowpopups="true"
        />
    );
};
