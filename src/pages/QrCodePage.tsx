import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import axios from 'axios';

const QrCodePage: React.FC = () => {
  const location = useLocation();
  const { email } = location.state || { email: '' }; // Retrieve the email passed via navigation
  const [vehicleInfo, setVehicleInfo] = useState<{ vehicleNumber: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleInfo = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/vehicle/vehicle-info-by-owner-email', {
          params: { email },
        });
        setVehicleInfo(response.data);
      } catch (err) {
        console.error('Failed to fetch vehicle info:', err);
        setError('Failed to fetch vehicle information. Please try again.');
      }
    };

    if (email) {
      fetchVehicleInfo();
    }
  }, [email]);

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
            <QRCode value={vehicleInfo.vehicleNumber} size={200} />
          </>
        ) : (
          <p className="text-neutral-600">Loading vehicle information...</p>
        )}
      </div>
    </div>
  );
};

export default QrCodePage;