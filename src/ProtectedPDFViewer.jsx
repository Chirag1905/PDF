// import React, { useEffect, useRef } from "react";
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import { pdfjs } from "react-pdf";

// // Set worker for PDF.js
// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// const ProtectedPDFViewer = ({pdfUrl}) => {
//     // const pdfUrl = "/Starfall.pdf";
//     const containerRef = useRef(null);
//     const overlayRef = useRef(null);

//     useEffect(() => {
//         // Security measures
//         const disableDevTools = () => {
//             document.addEventListener('keydown', (e) => {
//                 if (e.key === 'F12' || 
//                     (e.ctrlKey && e.shiftKey && e.key === 'I') || 
//                     (e.ctrlKey && e.shiftKey && e.key === 'J') ||
//                     (e.ctrlKey && e.shiftKey && e.key === 'C') ||
//                     (e.ctrlKey && e.key === 'U')) {
//                     e.preventDefault();
//                     alert('Developer tools are disabled for security reasons');
//                     return false;
//                 }
//             });
//         };

//         const disableRightClick = () => {
//             document.addEventListener('contextmenu', (e) => {
//                 e.preventDefault();
//                 return false;
//             });
//         };

//         const disablePrintScreen = () => {
//             document.addEventListener('keydown', (e) => {
//                 if (e.key === 'PrintScreen') {
//                     e.preventDefault();
//                     navigator.clipboard.writeText('');
//                     alert('Screenshots are disabled for security reasons');
//                     return false;
//                 }
//             });
//         };

//         const disableTextSelection = () => {
//             document.addEventListener('selectstart', (e) => {
//                 e.preventDefault();
//                 return false;
//             });
//         };

//         // Initialize security measures
//         disableDevTools();
//         disableRightClick();
//         disablePrintScreen();
//         disableTextSelection();

//         // Clear clipboard periodically
//         const clipboardClearInterval = setInterval(() => {
//             navigator.clipboard.writeText('').catch(err => {});
//         }, 3000);

//         return () => {
//             clearInterval(clipboardClearInterval);
//         };
//     }, []);

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 height: "100vh",
//                 position: "relative",
//                 overflow: "hidden",
//             }}
//         >
//             {/* Main container with scroll */}
//             <div
//                 ref={containerRef}
//                 style={{
//                     width: "100%",
//                     height: "100%",
//                     overflow: "auto",
//                     position: "relative",
//                 }}
//             >
//                 <Worker workerUrl={`/pdf.worker.min.js`}>
//                     <Viewer 
//                         fileUrl={pdfUrl}
//                         renderToolbar={(Toolbar) => (
//                             <Toolbar>
//                                 {(slots) => {
//                                     const { Download } = slots;
//                                     return (
//                                         <>
//                                             {Download && <Download children={() => <></>} />}
//                                         </>
//                                     );
//                                 }}
//                             </Toolbar>
//                         )}
//                     />
//                 </Worker>
//             </div>

//             {/* Security overlay - allows pointer events for scrolling but blocks selection */}
//             <div
//                 ref={overlayRef}
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     zIndex: 10,
//                     userSelect: "none",
//                     pointerEvents: "none",
//                 }}
//                 onContextMenu={(e) => e.preventDefault()}
//             />

//             {/* Watermark overlay */}
//             <div
//                 style={{
//                     position: "absolute",
//                     top: 0,
//                     left: 0,
//                     width: "100%",
//                     height: "100%",
//                     backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"400\" opacity=\"0.05\"><text x=\"50\" y=\"50\" font-family=\"Arial\" font-size=\"20\" fill=\"black\">CONFIDENTIAL - DO NOT COPY</text></svg>')",
//                     backgroundRepeat: "repeat",
//                     zIndex: 9,
//                     pointerEvents: "none",
//                 }}
//             />
//         </div>
//     );
// };

// export default ProtectedPDFViewer;

import React, { useEffect, useRef, useState } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";

// Set worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const ProtectedPDFViewer = ({ pdfUrl }) => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [blurred, setBlurred] = useState(false);

    useEffect(() => {
        // Detect mobile devices
        const checkIfMobile = () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };
        
        const mobile = checkIfMobile();
        setIsMobile(mobile);

        // Security measures for all devices
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

        // Mobile-specific protections
        if (mobile) {
            // Detect when app loses focus (potential screenshot attempt)
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    setBlurred(true);
                    alert('Switching apps or taking screenshots is not allowed!');
                } else {
                    setBlurred(false);
                }
            };

            // Detect hardware key combinations (Android screenshot)
            const handleKeyDown = (e) => {
                // Detect Power + Volume Down (common screenshot combo)
                if (e.key === 'Power' || e.keyCode === 24) { // 24 = Volume Down
                    e.preventDefault();
                    setBlurred(true);
                    setTimeout(() => setBlurred(false), 2000);
                    alert('Screenshots are disabled for security reasons');
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            document.addEventListener('keydown', handleKeyDown);

            // Dynamic watermark with timestamp
            const updateWatermark = () => {
                const timestamp = new Date().toLocaleString();
                const watermark = document.getElementById('dynamic-watermark');
                if (watermark) {
                    watermark.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" opacity="0.1"><text x="50" y="50" font-family="Arial" font-size="20" fill="red">CONFIDENTIAL - ${timestamp}</text></svg>')`;
                }
            };

            const watermarkInterval = setInterval(updateWatermark, 5000);
            updateWatermark(); // Initial watermark

            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                document.removeEventListener('keydown', handleKeyDown);
                clearInterval(watermarkInterval);
            };
        }

        // Clear clipboard periodically for all devices
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
                filter: blurred ? 'blur(8px)' : 'none',
                transition: 'filter 0.3s ease'
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

            {/* Dynamic Watermark overlay */}
            <div
                id="dynamic-watermark"
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

            {/* Mobile-specific warning */}
            {isMobile && (
                <div style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "0",
                    width: "100%",
                    textAlign: "center",
                    color: "red",
                    fontWeight: "bold",
                    zIndex: 11,
                    pointerEvents: "none"
                }}>
                    Screenshots are disabled on this device
                </div>
            )}
        </div>
    );
};

export default ProtectedPDFViewer;