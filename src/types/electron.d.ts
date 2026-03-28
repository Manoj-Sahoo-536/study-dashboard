import * as React from 'react';

declare global {
    // ─── Webview JSX Element ──────────────────────────────────────────────────
    namespace JSX {
        interface IntrinsicElements {
            webview: React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement> & {
                    src?: string;
                    autosize?: string;
                    nodeintegration?: string;
                    plugins?: string;
                    preload?: string;
                    httpreferrer?: string;
                    useragent?: string;
                    disablewebsecurity?: string;
                    partition?: string;
                    allowpopups?: string;
                    webpreferences?: string;
                    blinkfeatures?: string;
                    disableblinkfeatures?: string;
                    guestinstance?: string;
                    disableguestresize?: string;
                },
                HTMLElement
            >;
        }
    }

    // ─── Window API Surface ───────────────────────────────────────────────────
    interface Window {
        ipcRenderer: import('electron').IpcRenderer;

        swiftShuttleAPI: {
            openFile: () => Promise<string | null>;
            openVideo: () => Promise<string | null>;
            getAppPath: () => Promise<string>;
        };
    }
}
