import React, { useState } from 'react';
import { Search, Check, Droplet } from 'lucide-react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import Alert from '../../components/ui/Alert';
import { stationApi } from '../../services/api';
import { Vehicle } from '../../types';

const RecordTransaction: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'search' | 'form'>('search');

  const fuelTypes = [
    { value: 'petrol92', label: 'Petrol 92 Octane' },
    { value: 'petrol95', label: 'Petrol 95 Octane' },
    { value: 'diesel', label: 'Auto Diesel' },
    { value: 'superdiesel', label: 'Super Diesel' }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const result = await stationApi.validateVehicle(searchQuery);
      if (result) {
        setVehicle(result);
        setStep('form');
      } else {
        setError('Vehicle not found or not eligible for fuel quota');
      }
    } catch (err) {
      setError('Failed to validate vehicle. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || !fuelType || !amount) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const amountValue = parseFloat(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      setIsLoading(false);
      return;
    }
    
    if (amountValue > vehicle.remainingQuota) {
      setError(`Amount exceeds remaining quota (${vehicle.remainingQuota}L)`);
      setIsLoading(false);
      return;
    }
    
    try {
      await stationApi.recordTransaction({
        vehicleId: vehicle.id,
        amount: amountValue,
        fuelType
      });
      
      setSuccess('Transaction recorded successfully!');
      // Reset form
      setVehicle(null);
      setFuelType('');
      setAmount('');
      setStep('search');
      setSearchQuery('');
    } catch (err) {
      setError('Failed to record transaction. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVehicle(null);
    setFuelType('');
    setAmount('');
    setStep('search');
    setSearchQuery('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Record Fuel Transaction</h1>
        <p className="text-gray-600 mt-1">Distribute fuel to eligible vehicles</p>
      </div>
      
      {success && (
        <Alert variant="success" title="Success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert variant="error" title="Error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {step === 'search' ? (
        <Card title="Find Vehicle" subtitle="Enter vehicle registration number to proceed">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                id="vehicleSearch"
                placeholder="Enter vehicle registration number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
                icon={<Search size={18} />}
              />
              <Button 
                type="submit" 
                variant="primary"
                isLoading={isSearching}
              >
                Search
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card
          title="Record Transaction"
          subtitle={`Vehicle: ${vehicle?.registrationNumber}`}
        >
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Registration Number</p>
                <p className="font-medium">{vehicle?.registrationNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Vehicle Type</p>
                <p className="font-medium">{vehicle?.vehicleType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Remaining Quota</p>
                <p className="font-medium flex items-center">
                  <Droplet className="h-4 w-4 text-blue-500 mr-1" />
                  {vehicle?.remainingQuota} L
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Select
              id="fuelType"
              label="Fuel Type"
              options={fuelTypes}
              value={fuelType}
              onChange={setFuelType}
              placeholder="Select fuel type"
              required
            />
            
            <Input
              id="amount"
              type="number"
              label="Amount (Liters)"
              placeholder="Enter fuel amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              helperText={`Maximum allowed: ${vehicle?.remainingQuota}L`}
              required
            />
            
            <div className="flex justify-end space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                icon={<Check size={16} />}
              >
                Record Transaction
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default RecordTransaction;