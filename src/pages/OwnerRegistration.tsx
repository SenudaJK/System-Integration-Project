import React, { useState } from 'react';
import { FuelStationService } from '../../services/FuelStationService';

interface FuelStationForm {
    name: string;
    location: string;
    ownerName: string;
    contactNumber: string;
}

const OwnerRegistration: React.FC = () => {
    const [formData, setFormData] = useState<FuelStationForm>({
        name: '',
        location: '',
        ownerName: '',
        contactNumber: '',
    });
    const [errors, setErrors] = useState<Partial<FuelStationForm>>({});
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: Partial<FuelStationForm> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Station name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Station name cannot exceed 100 characters';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        } else if (formData.location.length > 200) {
            newErrors.location = 'Location cannot exceed 200 characters';
        }

        if (!formData.ownerName.trim()) {
            newErrors.ownerName = 'Owner name is required';
        } else if (formData.ownerName.length > 100) {
            newErrors.ownerName = 'Owner name cannot exceed 100 characters';
        }

        if (!formData.contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = 'Contact number must be exactly 10 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
        setSubmissionError(null);
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmissionError(null);
        setSuccessMessage(null);

        try {
            await FuelStationService.registerFuelStation({
                ...formData,
                active: false,
            });
            setSuccessMessage('Fuel station registered successfully! Awaiting approval.');
            setFormData({ name: '', location: '', ownerName: '', contactNumber: '' });
        } catch (error: any) {
            if (error.response?.status === 400) {
                setSubmissionError(error.response.data || 'Invalid input data');
            } else if (error.response?.status === 404) {
                setSubmissionError('API endpoint not found');
            } else {
                setSubmissionError('An error occurred while registering. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Fuel Station Registration</h2>
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {successMessage}
                </div>
            )}
            {submissionError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {submissionError}
                </div>
            )}
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Station Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        maxLength={100}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        maxLength={200}
                    />
                    {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>
                <div>
                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                        Owner Name
                    </label>
                    <input
                        type="text"
                        id="ownerName"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        maxLength={100}
                    />
                    {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
                </div>
                <div>
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        maxLength={10}
                    />
                    {errors.contactNumber && <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>}
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/fuel-station-owner/login" className="text-blue-600 hover:underline">
                    Login here
                </a>
            </p>
        </div>
    );
};

export default OwnerRegistration;