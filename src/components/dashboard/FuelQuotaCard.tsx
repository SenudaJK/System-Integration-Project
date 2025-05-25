import React from 'react';
import { Droplet, Info } from 'lucide-react';
import { Vehicle } from '../../types';

interface FuelQuotaCardProps {
  vehicle: Vehicle;
  onSelectVehicle: () => void;
}

const FuelQuotaCard: React.FC<FuelQuotaCardProps> = ({ vehicle, onSelectVehicle }) => {
  // Calculate percentage of fuel used
  const percentageUsed = Math.round(
    ((vehicle.quotaAmount - vehicle.remainingQuota) / vehicle.quotaAmount) * 100
  );
  
  // Determine the progress bar color based on remaining quota
  const getProgressBarColor = () => {
    const percentageRemaining = 100 - percentageUsed;
    if (percentageRemaining <= 20) return 'bg-error';
    if (percentageRemaining <= 50) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="card card-interactive hover:scale-105 transition-transform duration-300" onClick={onSelectVehicle}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-primary-700">{vehicle.vehicleNumber}</h3>
          <p className="text-sm text-neutral-500">{vehicle.vehicleType}</p>
        </div>
        <div className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
          {vehicle.fuelType}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-neutral-600">Remaining Quota</span>
          <span className="text-sm font-semibold">
            {vehicle.remainingQuota} / {vehicle.quotaAmount} Liters
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${getProgressBarColor()}`} 
            style={{ width: `${100 - percentageUsed}%` }}
          ></div>
        </div>
      </div>
      
      <div className="flex items-center text-xs text-neutral-500">
        <Droplet size={14} className="mr-1" />
        <span>Last filled: 7 days ago</span>
      </div>
      
      <div className="mt-4 flex justify-center">
        <button className="btn-primary text-sm py-1.5">
          View QR Code
        </button>
      </div>
    </div>
  );
};

export default FuelQuotaCard;