import React, { useEffect, useRef } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";

// Set worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const ProtectedPDFViewer = ({pdfUrl}) => {
    // const pdfUrl = "/Starfall.pdf";
    const containerRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        // Security measures
        const disableDevTools = () => {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'F12' || 
                    (e.ctrlKey && e.shiftKey && e.key === 'I') || 
                    (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                    (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                    (e.ctrlKey && e.key === 'U')) {
                    e.preventDefault();
                    alert('Developer tools are disabled for security reasons');
                    return false;
                }
            });
        };

        const disableRightClick = () => {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                return false;
            });
        };

        const disablePrintScreen = () => {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'PrintScreen') {
                    e.preventDefault();
                    navigator.clipboard.writeText('');
                    alert('Screenshots are disabled for security reasons');
                    return false;
                }
            });
        };

        const disableTextSelection = () => {
            document.addEventListener('selectstart', (e) => {
                e.preventDefault();
                return false;
            });
        };

        // Initialize security measures
        disableDevTools();
        disableRightClick();
        disablePrintScreen();
        disableTextSelection();

        // Clear clipboard periodically
        const clipboardClearInterval = setInterval(() => {
            navigator.clipboard.writeText('').catch(err => {});
        }, 3000);

        return () => {
            clearInterval(clipboardClearInterval);
        };
    }, []);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Main container with scroll */}
            <div
                ref={containerRef}
                style={{
                    width: "100%",
                    height: "100%",
                    overflow: "auto",
                    position: "relative",
                }}
            >
                <Worker workerUrl={`/pdf.worker.min.js`}>
                    <Viewer 
                        fileUrl={pdfUrl}
                        renderToolbar={(Toolbar) => (
                            <Toolbar>
                                {(slots) => {
                                    const { Download } = slots;
                                    return (
                                        <>
                                            {Download && <Download children={() => <></>} />}
                                        </>
                                    );
                                }}
                            </Toolbar>
                        )}
                    />
                </Worker>
            </div>

            {/* Security overlay - allows pointer events for scrolling but blocks selection */}
            <div
                ref={overlayRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 10,
                    userSelect: "none",
                    pointerEvents: "none",
                }}
                onContextMenu={(e) => e.preventDefault()}
            />

            {/* Watermark overlay */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"400\" opacity=\"0.05\"><text x=\"50\" y=\"50\" font-family=\"Arial\" font-size=\"20\" fill=\"black\">CONFIDENTIAL - DO NOT COPY</text></svg>')",
                    backgroundRepeat: "repeat",
                    zIndex: 9,
                    pointerEvents: "none",
                }}
            />
        </div>
    );
};

export default ProtectedPDFViewer;