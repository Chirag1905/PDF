import React, { useState } from 'react';
import ProtectedPDFViewer from './ProtectedPDFViewer';

const App = () => {
  // List of available PDFs
  const pdfList = [
    { id: 1, name: 'Screenshot 3', path: '/Starfall.pdf' },
    { id: 2, name: 'Document 2', path: '/Maths.pdf' },
    { id: 3, name: 'Document 3', path: '/Science.pdf' },
  ];

  const [selectedPdf, setSelectedPdf] = useState(null);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!selectedPdf ? (
        // Show PDF list when none is selected
        <div style={{
          padding: '20px',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <h2>Select a Document</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px',
            marginTop: '20px'
          }}>
            {pdfList.map((pdf) => (
              <div
                key={pdf.id}
                onClick={() => setSelectedPdf(pdf)}
                style={{
                  padding: '15px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  ':hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <div style={{ fontSize: '18px', fontWeight: '500' }}>{pdf.name}</div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>PDF Document</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Show the selected PDF with a back button
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            padding: '10px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setSelectedPdf(null)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back to Documents
            </button>
            <div style={{ fontWeight: 'bold' }}>{selectedPdf.name}</div>
            <div style={{ width: '100px' }}></div> {/* Spacer for alignment */}
          </div>
          <div style={{ flex: 1 }}>
            <ProtectedPDFViewer pdfUrl={selectedPdf.path} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;