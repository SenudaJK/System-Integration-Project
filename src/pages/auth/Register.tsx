import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Droplet, UserCircle, ShieldCheck } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { authApi } from '../../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ROLE_ADMIN' // Default role
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const roles = [
    { id: 'ROLE_USER', label: 'User' },
    { id: 'ROLE_ADMIN', label: 'Admin' },
    { id: 'ROLE_STATION_MANAGER', label: 'Station Manager' }
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) 
      newErrors.password = 'Password must include uppercase, lowercase, number and special character';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Update to match the expected backend format
      const response = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        roles: [formData.role.replace('ROLE_', '').toLowerCase()] // Convert ROLE_USER to "user"
      });
      
      console.log("Registration response:", response);
      
      // Registration successful, redirect to login
      navigate('/login', { 
        state: { message: 'Registration successful! You can now log in.' } 
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Droplet className="h-12 w-12 text-blue-800" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Register to manage your fuel quota
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <Alert variant="error" title="Registration Failed">
              {errorMessage}
            </Alert>
          )}
          
          <div className="space-y-4">
            <Input
              id="username"
              name="username"
              type="text"
              label="Username"
              icon={<UserCircle size={18} />}
              placeholder="Enter a unique username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              helperText="Username must be at least 3 characters"
              fullWidth
              required
            />
            
            <Input
              id="fullName"
              name="fullName"
              type="text"
              label="Full Name"
              icon={<User size={18} />}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              fullWidth
              required
            />
            
            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              icon={<Mail size={18} />}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              fullWidth
              required
            />
            
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              icon={<Lock size={18} />}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helperText="Password must include uppercase, lowercase, number and special character"
              fullWidth
              required
            />
            
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              icon={<Lock size={18} />}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              fullWidth
              required
            />
            
            {/* Role Selection */}
            <div className="space-y-1">
              <label 
                htmlFor="role" 
                className="block text-sm font-medium text-gray-700 flex items-center"
              >
                <ShieldCheck size={18} className="mr-2" />
                Select Role
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.role ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  required
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSubmitting}
            >
              Create Account
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;