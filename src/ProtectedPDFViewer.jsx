import React from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";

// Set worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`; // Directly from public folder

const ProtectedPDFViewer = () => {
    const pdfUrl = "/Starfall.pdf"; // PDF stored in public folder

    return (
        <div
            style={{
                width: "100%",
                height: "100vh",
                userSelect: "none", // Disable text selection
                pointerEvents: "none", // Disable interactions
                position: "relative",
            }}
            // onContextMenu={(e) => e.preventDefault()} // Disable right-click
        >
            {/* Transparent Overlay to Prevent Screenshots */}
            <div
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100vh",
                    background: "rgba(255, 255, 255, 0)",
                    zIndex: 10,
                    pointerEvents: "none",
                }}
            ></div>

            <Worker workerUrl={`/pdf.worker.min.js`}>
                <Viewer fileUrl={pdfUrl} />
            </Worker>
        </div>
    );
};

export default ProtectedPDFViewer;
