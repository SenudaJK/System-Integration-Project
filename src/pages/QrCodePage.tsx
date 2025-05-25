import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { toPng } from 'html-to-image';

const QrCodePage: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || { email: '' }; // Retrieve the email passed via navigation
  const [vehicleInfo, setVehicleInfo] = useState<{ qrCode: string; vehicleNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null); // Reference to the QR code container

  useEffect(() => {
    const fetchVehicleInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/vehicle/vehicle-info-by-owner-email', {
          params: { email },
        });

        // Assuming the API returns an array, take the first item
        const vehicleData = response.data[0];
        setVehicleInfo(vehicleData);
      } catch (err) {
        console.error('Failed to fetch vehicle info:', err);
        setError('Failed to fetch vehicle information. Please try again.');
      }
    };

    if (email) {
      fetchVehicleInfo();
    }
  }, [email]);

  const handleDownload = async () => {
    if (qrCodeRef.current) {
      try {
        const dataUrl = await toPng(qrCodeRef.current, {
          width: 400,
          height: 400, 
          backgroundColor: '#ffffff', // Add a white background
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${vehicleInfo?.vehicleNumber || 'qr-code'}.png`;
        link.click();
      } catch (err) {
        console.error('Failed to download QR code:', err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-primary-700 mb-4">Vehicle QR Code</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : vehicleInfo ? (
          <>
            <p className="text-lg text-neutral-800 mb-4">
              Vehicle Number: <strong>{vehicleInfo.vehicleNumber}</strong>
            </p>
            <div
              ref={qrCodeRef}
              className="mx-auto w-64 h-64 bg-white p-6 rounded-lg shadow-lg flex items-center justify-center"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '400px',
                height: '400px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
              }}
            >
              <img
                src={`data:image/png;base64,${vehicleInfo.qrCode}`}
                alt="QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <button
              onClick={handleDownload}
              className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Download QR Code
            </button>
          </>
        ) : (
          <p className="text-neutral-600">Loading vehicle information...</p>
        )}
      </div>
    </div>
  );
};

export default QrCodePage;