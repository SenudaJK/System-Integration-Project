import React from 'react';
import QRCode from 'react-qr-code';
import { User, Vehicle } from '../../types';

interface QRCodeDisplayProps {
  user: User;
  selectedVehicle: Vehicle;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ user, selectedVehicle }) => {
  // Create QR data with user and vehicle information
  const qrData = JSON.stringify({
    userId: user.id,
    name: user.name,
    vehicleNumber: selectedVehicle.vehicleNumber,
    vehicleType: selectedVehicle.vehicleType,
    fuelType: selectedVehicle.fuelType,
    remainingQuota: selectedVehicle.remainingQuota,
    timestamp: new Date().toISOString(),
  });

  return (
    <div className="card p-6 md:p-8 text-center animate-fade-in">
      <h3 className="text-xl font-bold text-primary-700 mb-4">Your Fuel Quota QR Code</h3>
      
      <p className="text-neutral-600 mb-6">
        Present this QR code at the fuel station for verification and quota allocation.
      </p>
      
      <div className="mx-auto w-48 h-48 md:w-64 md:h-64 bg-white p-3 rounded-lg shadow-lg">
        <QRCode
          value={qrData}
          size={256}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox="0 0 256 256"
        />
      </div>
      
      <div className="mt-6 border-t border-neutral-200 pt-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-left">
            <p className="text-neutral-500">Vehicle Number</p>
            <p className="font-semibold">{selectedVehicle.vehicleNumber}</p>
          </div>
          
          <div className="text-left">
            <p className="text-neutral-500">Fuel Type</p>
            <p className="font-semibold">{selectedVehicle.fuelType}</p>
          </div>
          
          <div className="text-left">
            <p className="text-neutral-500">Quota Remaining</p>
            <p className="font-semibold">{selectedVehicle.remainingQuota} Liters</p>
          </div>
          
          <div className="text-left">
            <p className="text-neutral-500">Quota Reset</p>
            <p className="font-semibold">{new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-primary-50 rounded-lg p-4 text-primary-800 text-sm">
        <p className="font-semibold">Important Note:</p>
        <p className="mt-1">This QR code is valid only with your National ID card. Please carry your NIC for verification.</p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;