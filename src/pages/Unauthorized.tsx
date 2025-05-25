import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../components/ui/Button';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center">
          <ShieldAlert className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">
          You don't have permission to access this page. Please log in with an appropriate account.
        </p>
        <div className="mt-6">
          <Button
            variant="primary"
            onClick={() => navigate('/login')}
            className="w-full"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;