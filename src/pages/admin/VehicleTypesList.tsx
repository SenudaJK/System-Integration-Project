import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, DropletIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { adminApi } from '../../services/api';

interface VehicleType {
  id: number;
  name: string;
  description: string;
  weeklyQuota: number;
  fuelType: 'PETROL' | 'DIESEL' | 'KEROSENE' | 'ELECTRIC';
  createdAt: string;
  updatedAt: string;
}

const VehicleTypesList: React.FC = () => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const data = await adminApi.getVehicleTypes();
        console.log('Fetched vehicle types:', data);
        setVehicleTypes(data as VehicleType[]);
      } catch (err) {
        console.error('Failed to fetch vehicle types:', err);
        setError('Failed to load vehicle types. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleTypes();
  }, [refreshTrigger]);

  const getFuelTypeBadge = (fuelType: string) => {
    switch (fuelType) {
      case 'PETROL':
        return <Badge variant="primary">Petrol</Badge>;
      case 'DIESEL':
        return <Badge variant="warning">Diesel</Badge>;
      case 'KEROSENE':
        return <Badge variant="success">Kerosene</Badge>;
      case 'ELECTRIC':
        return <Badge variant="primary">Electric</Badge>;
      default:
        return <Badge>{fuelType}</Badge>;
    }
  };

  const handleDeleteVehicleType = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vehicle type?')) {
      return;
    }
    
    try {
      await adminApi.deleteVehicleType(id);
      // Update local state to remove the deleted item
      setVehicleTypes(prevTypes => prevTypes.filter(type => type.id !== id));
    } catch (err) {
      console.error('Failed to delete vehicle type:', err);
      alert('Failed to delete vehicle type. Please try again.');
    }
  };

  const columns = [
    { 
      header: 'Name',
      accessor: (row: VehicleType) => row.name
    },
    { 
      header: 'Description',
      accessor: (row: VehicleType) => (
        <div className="max-w-xs truncate">
          {row.description || 'No description provided'}
        </div>
      )
    },
    { 
      header: 'Fuel Type',
      accessor: (row: VehicleType) => getFuelTypeBadge(row.fuelType)
    },
    { 
      header: 'Weekly Quota',
      accessor: (row: VehicleType) => (
        <div className="flex items-center">
          <DropletIcon size={14} className="mr-1 text-blue-600" />
          <span className="font-medium">{row.weeklyQuota} L</span>
        </div>
      )
    },
    { 
      header: 'Actions',
      accessor: (row: VehicleType) => (
        <div className="flex space-x-2">
          <Link to={`/admin/vehicle-types/edit/${row.id}`}>
            <Button
              size="sm"
              variant="secondary"
              icon={<Edit size={14} />}
            >
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="danger"
            icon={<Trash2 size={14} />}
            onClick={() => handleDeleteVehicleType(row.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => setRefreshTrigger(prev => prev + 1)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Types</h1>
          <p className="text-gray-600 mt-1">Manage vehicle types and their weekly fuel quotas</p>
        </div>
        <Link to="/admin/vehicle-types/new">
          <Button
            variant="primary"
            icon={<Plus size={16} />}
          >
            Add Vehicle Type
          </Button>
        </Link>
      </div>
      
      <Card>
        <Table
          columns={columns}
          data={vehicleTypes}
          keyField="id"
          isLoading={isLoading}
          emptyMessage="No vehicle types registered yet"
        />
      </Card>
    </div>
  );
};

export default VehicleTypesList;