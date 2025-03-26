// import React, { useEffect, useRef, useState } from "react";
// import { Viewer, Worker, ZoomInButton, ZoomOutButton } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import { pdfjs } from "react-pdf";

// // Set worker for PDF.js
// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// const ProtectedPDFViewer = ({ pdfUrl }) => {
//     const containerRef = useRef(null);
//     const overlayRef = useRef(null);
//     const [isMobile, setIsMobile] = useState(false);
//     const [blurred, setBlurred] = useState(false);

//     useEffect(() => {
//         // Comprehensive security measures
//         const setupSecurityMeasures = () => {
//             // Disable all keyboard shortcuts that could expose content
//             const blockedKeys = [
//                 "F12", "Insert", "PrintScreen",
//                 "c", "C", "x", "X", "v", "V", "a", "A",
//                 "p", "P", "s", "S", "u", "U"
//             ];

//             const blockedCombinations = [
//                 { ctrlKey: true, shiftKey: true, key: "I" },
//                 { ctrlKey: true, shiftKey: true, key: "J" },
//                 { ctrlKey: true, shiftKey: true, key: "C" },
//                 { ctrlKey: true, key: "U" },
//                 { ctrlKey: true, key: "S" },
//                 { ctrlKey: true, key: "P" },
//                 { ctrlKey: true, key: "A" },
//                 { metaKey: true, key: "C" }, // Mac Cmd+C
//                 { metaKey: true, key: "A" }, // Mac Cmd+A
//             ];

//             function isCombinationBlocked(event) {
//                 return blockedCombinations.some(combo => {
//                     return (
//                         (combo.ctrlKey === undefined || combo.ctrlKey === event.ctrlKey) &&
//                         (combo.shiftKey === undefined || combo.shiftKey === event.shiftKey) &&
//                         (combo.metaKey === undefined || combo.metaKey === event.metaKey) &&
//                         combo.key === event.key
//                     );
//                 });
//             }

//             const handleKeyDown = function (event) {
//                 // Block single keys
//                 if (blockedKeys.includes(event.key)) {
//                     event.preventDefault();
//                     // alert('This action is restricted for security reasons');
//                     return false;
//                 }

//                 // Block key combinations
//                 if (isCombinationBlocked(event)) {
//                     event.preventDefault();
//                     // alert('This action is restricted for security reasons');
//                     return false;
//                 }

//                 // Prevent screenshots on Windows (Windows + Shift + S)
//                 if (event.key === 's' && event.shiftKey && (event.metaKey || event.ctrlKey)) {
//                     event.preventDefault();
//                     // alert('Screenshots are disabled for security reasons');
//                     return false;
//                 }
//             };

//             const handleContextMenu = function (event) {
//                 event.preventDefault();
//                 return false;
//             };

//             const handleSelectStart = function (event) {
//                 event.preventDefault();
//                 return false;
//             };

//             const handleDragStart = function (event) {
//                 event.preventDefault();
//                 return false;
//             };

//             // Add event listeners
//             document.addEventListener('keydown', handleKeyDown);
//             document.addEventListener('contextmenu', handleContextMenu);
//             document.addEventListener('selectstart', handleSelectStart);
//             document.addEventListener('dragstart', handleDragStart);

//             // Clear clipboard periodically
//             const clipboardInterval = setInterval(function () {
//                 navigator.clipboard.writeText('').catch(function () { });
//             }, 2000);

//             // Prevent taking photos of the screen with mobile devices
//             const handleVisibilityChange = function () {
//                 if (document.hidden) {
//                     alert('Switching away from this page is not allowed');
//                     document.title = 'Please return to the document';
//                 } else {
//                     document.title = 'Secure PDF Viewer';
//                 }
//             };

//             document.addEventListener('visibilitychange', handleVisibilityChange);

//             // Cleanup function
//             return () => {
//                 document.removeEventListener('keydown', handleKeyDown);
//                 document.removeEventListener('contextmenu', handleContextMenu);
//                 document.removeEventListener('selectstart', handleSelectStart);
//                 document.removeEventListener('dragstart', handleDragStart);
//                 document.removeEventListener('visibilitychange', handleVisibilityChange);
//                 clearInterval(clipboardInterval);
//             };
//         };

//         // Detect mobile devices
//         const checkIfMobile = () => {
//             return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//         };

//         const mobile = checkIfMobile();
//         setIsMobile(mobile);

//         // Initialize security measures
//         const cleanupSecurity = setupSecurityMeasures();

//         // Mobile-specific protections
//         if (mobile) {
//             // Detect when app loses focus (potential screenshot attempt)
//             const handleMobileVisibilityChange = () => {
//                 if (document.hidden) {
//                     setBlurred(true);
//                     // alert('Switching apps or taking screenshots is not allowed!');
//                 } else {
//                     setBlurred(false);
//                 }
//             };

//             // Detect hardware key combinations (Android screenshot)
//             const handleMobileKeyDown = (e) => {
//                 // Detect Power + Volume Down (common screenshot combo)
//                 if (e.key === 'Power' || e.keyCode === 24) { // 24 = Volume Down
//                     e.preventDefault();
//                     setBlurred(true);
//                     setTimeout(() => setBlurred(false), 2000);
//                     // alert('Screenshots are disabled for security reasons');
//                 }
//             };

//             document.addEventListener('visibilitychange', handleMobileVisibilityChange);
//             document.addEventListener('keydown', handleMobileKeyDown);

//             // Dynamic watermark with timestamp
//             const updateWatermark = () => {
//                 const timestamp = new Date().toLocaleString();
//                 const watermark = document.getElementById('dynamic-watermark');
//                 if (watermark) {
//                     watermark.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" opacity="0.1"><text x="50" y="50" font-family="Arial" font-size="20" fill="red">CONFIDENTIAL - ${timestamp}</text></svg>')`;
//                 }
//             };

//             const watermarkInterval = setInterval(updateWatermark, 5000);
//             updateWatermark(); // Initial watermark

//             return () => {
//                 cleanupSecurity();
//                 document.removeEventListener('visibilitychange', handleMobileVisibilityChange);
//                 document.removeEventListener('keydown', handleMobileKeyDown);
//                 clearInterval(watermarkInterval);
//             };
//         }

//         return cleanupSecurity;
//     }, []);

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 height: "100vh",
//                 position: "relative",
//                 overflow: "hidden",
//                 filter: blurred ? 'blur(8px)' : 'none',
//                 transition: 'filter 0.3s ease'
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
//                                     const { Download, ZoomIn, ZoomOut } = slots;
//                                     return (
//                                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                                             <div style={{ padding: '0 4px' }}>
//                                                 <ZoomOut>
//                                                     {(props) => (
//                                                         <button
//                                                             style={{
//                                                                 backgroundColor: '#fff',
//                                                                 border: '1px solid rgba(0, 0, 0, 0.3)',
//                                                                 borderRadius: '4px',
//                                                                 cursor: 'pointer',
//                                                                 padding: '8px',
//                                                             }}
//                                                             onClick={props.onClick}
//                                                         >
//                                                             Zoom Out
//                                                         </button>
//                                                     )}
//                                                 </ZoomOut>
//                                             </div>
//                                             <div style={{ padding: '0 4px' }}>
//                                                 <ZoomIn>
//                                                     {(props) => (
//                                                         <button
//                                                             style={{
//                                                                 backgroundColor: '#fff',
//                                                                 border: '1px solid rgba(0, 0, 0, 0.3)',
//                                                                 borderRadius: '4px',
//                                                                 cursor: 'pointer',
//                                                                 padding: '8px',
//                                                             }}
//                                                             onClick={props.onClick}
//                                                         >
//                                                             Zoom In
//                                                         </button>
//                                                     )}
//                                                 </ZoomIn>
//                                             </div>
//                                             {Download && <Download children={() => <></>} />}
//                                         </div>
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

//             {/* Dynamic Watermark overlay */}
//             <div
//                 id="dynamic-watermark"
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

//             {/* Mobile-specific warning */}
//             {isMobile && (
//                 <div style={{
//                     position: "absolute",
//                     bottom: "20px",
//                     left: "0",
//                     width: "100%",
//                     textAlign: "center",
//                     color: "red",
//                     fontWeight: "bold",
//                     zIndex: 11,
//                     pointerEvents: "none"
//                 }}>
//                     Screenshots are disabled on this device
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProtectedPDFViewer;

// import React, { useEffect, useRef, useState } from "react";
// import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import { pdfjs } from "react-pdf";

// // Set worker for PDF.js
// pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

// const ProtectedPDFViewer = ({ pdfUrl }) => {
//     const containerRef = useRef(null);
//     const overlayRef = useRef(null);
//     const viewerRef = useRef(null);
//     const [isMobile, setIsMobile] = useState(false);
//     const [blurred, setBlurred] = useState(false);
//     const [scale, setScale] = useState(1.0);

//     const zoomIn = () => {
//         if (viewerRef.current) {
//             viewerRef.current.zoom(scale + 0.25);
//         }
//     };

//     const zoomOut = () => {
//         if (viewerRef.current && scale > 0.5) {
//             viewerRef.current.zoom(scale - 0.25);
//         }
//     };

//     useEffect(() => {
//         // Comprehensive security measures
//         const setupSecurityMeasures = () => {
//             // Disable all keyboard shortcuts that could expose content
//             const blockedKeys = [
//                 "F12", "Insert", "PrintScreen",
//                 "c", "C", "x", "X", "v", "V", "a", "A",
//                 "p", "P", "s", "S", "u", "U"
//             ];

//             const blockedCombinations = [
//                 { ctrlKey: true, shiftKey: true, key: "I" },
//                 { ctrlKey: true, shiftKey: true, key: "J" },
//                 { ctrlKey: true, shiftKey: true, key: "C" },
//                 { ctrlKey: true, key: "U" },
//                 { ctrlKey: true, key: "S" },
//                 { ctrlKey: true, key: "P" },
//                 { ctrlKey: true, key: "A" },
//                 { metaKey: true, key: "C" }, // Mac Cmd+C
//                 { metaKey: true, key: "A" }, // Mac Cmd+A
//             ];

//             function isCombinationBlocked(event) {
//                 return blockedCombinations.some(combo => {
//                     return (
//                         (combo.ctrlKey === undefined || combo.ctrlKey === event.ctrlKey) &&
//                         (combo.shiftKey === undefined || combo.shiftKey === event.shiftKey) &&
//                         (combo.metaKey === undefined || combo.metaKey === event.metaKey) &&
//                         combo.key === event.key
//                     );
//                 });
//             }

//             const handleKeyDown = function (event) {
//                 // Block single keys
//                 if (blockedKeys.includes(event.key)) {
//                     event.preventDefault();
//                     // alert('This action is restricted for security reasons');
//                     return false;
//                 }

//                 // Block key combinations
//                 if (isCombinationBlocked(event)) {
//                     event.preventDefault();
//                     // alert('This action is restricted for security reasons');
//                     return false;
//                 }

//                 // Prevent screenshots on Windows (Windows + Shift + S)
//                 if (event.key === 's' && event.shiftKey && (event.metaKey || event.ctrlKey)) {
//                     event.preventDefault();
//                     // alert('Screenshots are disabled for security reasons');
//                     return false;
//                 }
//             };

//             const handleContextMenu = function (event) {
//                 event.preventDefault();
//                 return false;
//             };

//             const handleSelectStart = function (event) {
//                 event.preventDefault();
//                 return false;
//             };

//             const handleDragStart = function (event) {
//                 event.preventDefault();
//                 return false;
//             };

//             // Add event listeners
//             document.addEventListener('keydown', handleKeyDown);
//             document.addEventListener('contextmenu', handleContextMenu);
//             document.addEventListener('selectstart', handleSelectStart);
//             document.addEventListener('dragstart', handleDragStart);

//             // Clear clipboard periodically
//             const clipboardInterval = setInterval(function () {
//                 navigator.clipboard.writeText('').catch(function () { });
//             }, 2000);

//             // Prevent taking photos of the screen with mobile devices
//             const handleVisibilityChange = function () {
//                 if (document.hidden) {
//                     alert('Switching away from this page is not allowed');
//                     document.title = 'Please return to the document';
//                 } else {
//                     document.title = 'Secure PDF Viewer';
//                 }
//             };

//             document.addEventListener('visibilitychange', handleVisibilityChange);

//             // Cleanup function
//             return () => {
//                 document.removeEventListener('keydown', handleKeyDown);
//                 document.removeEventListener('contextmenu', handleContextMenu);
//                 document.removeEventListener('selectstart', handleSelectStart);
//                 document.removeEventListener('dragstart', handleDragStart);
//                 document.removeEventListener('visibilitychange', handleVisibilityChange);
//                 clearInterval(clipboardInterval);
//             };
//         };

//         // Detect mobile devices
//         const checkIfMobile = () => {
//             return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
//         };

//         const mobile = checkIfMobile();
//         setIsMobile(mobile);

//         // Initialize security measures
//         const cleanupSecurity = setupSecurityMeasures();

//         // Mobile-specific protections
//         if (mobile) {
//             // Detect when app loses focus (potential screenshot attempt)
//             const handleMobileVisibilityChange = () => {
//                 if (document.hidden) {
//                     setBlurred(true);
//                     // alert('Switching apps or taking screenshots is not allowed!');
//                 } else {
//                     setBlurred(false);
//                 }
//             };

//             // Detect hardware key combinations (Android screenshot)
//             const handleMobileKeyDown = (e) => {
//                 // Detect Power + Volume Down (common screenshot combo)
//                 if (e.key === 'Power' || e.keyCode === 24) { // 24 = Volume Down
//                     e.preventDefault();
//                     setBlurred(true);
//                     setTimeout(() => setBlurred(false), 2000);
//                     // alert('Screenshots are disabled for security reasons');
//                 }
//             };

//             document.addEventListener('visibilitychange', handleMobileVisibilityChange);
//             document.addEventListener('keydown', handleMobileKeyDown);

//             // Dynamic watermark with timestamp
//             const updateWatermark = () => {
//                 const timestamp = new Date().toLocaleString();
//                 const watermark = document.getElementById('dynamic-watermark');
//                 if (watermark) {
//                     watermark.style.backgroundImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" opacity="0.1"><text x="50" y="50" font-family="Arial" font-size="20" fill="red">CONFIDENTIAL - ${timestamp}</text></svg>')`;
//                 }
//             };

//             const watermarkInterval = setInterval(updateWatermark, 5000);
//             updateWatermark(); // Initial watermark

//             return () => {
//                 cleanupSecurity();
//                 document.removeEventListener('visibilitychange', handleMobileVisibilityChange);
//                 document.removeEventListener('keydown', handleMobileKeyDown);
//                 clearInterval(watermarkInterval);
//             };
//         }

//         return cleanupSecurity;
//     }, []);

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 height: "100vh",
//                 position: "relative",
//                 overflow: "hidden",
//                 filter: blurred ? 'blur(8px)' : 'none',
//                 transition: 'filter 0.3s ease'
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
//                         onZoom={(zoom) => setScale(zoom.scale)}
//                         ref={viewerRef}
//                         renderToolbar={(Toolbar) => (
//                             <Toolbar>
//                                 {(slots) => {
//                                     const { Download } = slots;
//                                     return (
//                                         <div style={{
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             padding: '4px',
//                                             backgroundColor: '#EEE',
//                                             borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
//                                         }}>
//                                             <div style={{ padding: '0 4px' }}>
//                                                 <button
//                                                     style={{
//                                                         backgroundColor: '#fff',
//                                                         border: '1px solid rgba(0, 0, 0, 0.3)',
//                                                         borderRadius: '4px',
//                                                         cursor: 'pointer',
//                                                         padding: '8px 12px',
//                                                         marginRight: '4px'
//                                                     }}
//                                                     onClick={zoomOut}
//                                                     disabled={scale <= 0.5}
//                                                 >
//                                                     Zoom Out
//                                                 </button>
//                                             </div>
//                                             <div style={{
//                                                 padding: '0 8px',
//                                                 minWidth: '60px',
//                                                 textAlign: 'center'
//                                             }}>
//                                                 {Math.round(scale * 100)}%
//                                             </div>
//                                             <div style={{ padding: '0 4px' }}>
//                                                 <button
//                                                     style={{
//                                                         backgroundColor: '#fff',
//                                                         border: '1px solid rgba(0, 0, 0, 0.3)',
//                                                         borderRadius: '4px',
//                                                         cursor: 'pointer',
//                                                         padding: '8px 12px',
//                                                         marginLeft: '4px'
//                                                     }}
//                                                     onClick={zoomIn}
//                                                     disabled={scale >= 2.0}
//                                                 >
//                                                     Zoom In
//                                                 </button>
//                                             </div>
//                                             {Download && <Download children={() => <></>} />}
//                                         </div>
//                                     );
//                                 }}
//                             </Toolbar>
//                         )}
//                     />
//                 </Worker>
//             </div>

//             {/* Rest of your existing overlay and watermark code */}
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

//             <div
//                 id="dynamic-watermark"
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

//             {isMobile && (
//                 <div style={{
//                     position: "absolute",
//                     bottom: "20px",
//                     left: "0",
//                     width: "100%",
//                     textAlign: "center",
//                     color: "red",
//                     fontWeight: "bold",
//                     zIndex: 11,
//                     pointerEvents: "none"
//                 }}>
//                     Screenshots are disabled on this device
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProtectedPDFViewer;

import React, { useEffect, useRef, useState } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";

// Set worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;

const ProtectedPDFViewer = ({ pdfUrl }) => {
    const containerRef = useRef(null);
    const overlayRef = useRef(null);
    const viewerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);
    const [blurred, setBlurred] = useState(false);
    const [scale, setScale] = useState(1.0);

    const zoomIn = () => {
        if (viewerRef.current) {
            viewerRef.current.zoom(scale + 0.25);
        }
    };

    const zoomOut = () => {
        if (viewerRef.current && scale > 0.5) {
            viewerRef.current.zoom(scale - 0.25);
        }
    };

    useEffect(() => {
        const checkIfMobile = () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        };

        setIsMobile(checkIfMobile());

        // Security Features
        const handleKeyDown = (event) => {
            const blockedKeys = ["F12", "Insert", "PrintScreen"];
            const blockedCombinations = [
                { ctrlKey: true, shiftKey: true, key: "I" }, // DevTools
                { ctrlKey: true, shiftKey: true, key: "J" }, // DevTools
                { ctrlKey: true, shiftKey: true, key: "C" }, // Inspect Element
                { ctrlKey: true, key: "U" }, // View Source
                { ctrlKey: true, key: "S" }, // Save
                { ctrlKey: true, key: "P" }, // Print
                { metaKey: true, key: "C" }, // Cmd + C (Mac)
                { metaKey: true, key: "A" }, // Cmd + A (Mac)
            ];

            if (blockedKeys.includes(event.key) || blockedCombinations.some(combo =>
                event.ctrlKey === combo.ctrlKey &&
                event.shiftKey === combo.shiftKey &&
                event.metaKey === combo.metaKey &&
                event.key === combo.key
            )) {
                event.preventDefault();
                return false;
            }

            // Prevent Windows + Shift + S (Windows Screenshot)
            if (event.key === 's' && event.shiftKey && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                return false;
            }
        };

        const handleContextMenu = (event) => event.preventDefault();
        const handleSelectStart = (event) => event.preventDefault();
        const handleDragStart = (event) => event.preventDefault();

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("selectstart", handleSelectStart);
        document.addEventListener("dragstart", handleDragStart);

        const clipboardInterval = setInterval(() => {
            navigator.clipboard.writeText("").catch(() => { });
        }, 1000);

        // Mobile Security Measures
        if (isMobile) {
            const handleVisibilityChange = () => {
                setBlurred(document.hidden);
            };

            const handleMobileKeyDown = (e) => {
                if (e.key === "Power" || e.keyCode === 24) { // Volume Down
                    e.preventDefault();
                    setBlurred(true);
                    setTimeout(() => setBlurred(false), 2000);
                }
            };

            document.addEventListener("visibilitychange", handleVisibilityChange);
            document.addEventListener("keydown", handleMobileKeyDown);

            return () => {
                document.removeEventListener("visibilitychange", handleVisibilityChange);
                document.removeEventListener("keydown", handleMobileKeyDown);
            };
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("selectstart", handleSelectStart);
            document.removeEventListener("dragstart", handleDragStart);
            clearInterval(clipboardInterval);
        };
    }, [isMobile]);

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                filter: blurred ? "blur(8px)" : "none",
                transition: "filter 0.3s ease",
            }}
        >
            <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "auto", position: "relative" }}>
                <Worker workerUrl={`/pdf.worker.min.js`}>
                    <Viewer fileUrl={pdfUrl} onZoom={(zoom) => setScale(zoom.scale)} ref={viewerRef} />
                </Worker>
            </div>

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

            {isMobile && (
                <div style={{ position: "absolute", bottom: "20px", left: "0", width: "100%", textAlign: "center", color: "red", fontWeight: "bold", zIndex: 11, pointerEvents: "none" }}>
                    Screenshots are disabled on this device
                </div>
            )}
        </div>
    );
};

export default ProtectedPDFViewer;
