import React from 'react';
import { Link } from 'react-router-dom';
import { Fuel, Shield, Smartphone, Clock, ArrowRight, ChevronRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Hero section */}
      <section className="bg-primary-700 text-white relative">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.pexels.com/photos/2078043/pexels-photo-2078043.jpeg')] bg-cover bg-center"></div>
        <div className="container-custom py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Fuel size={28} className="text-white" />
                <h1 className="text-3xl md:text-4xl font-bold">
                  Fuel Quota Management System
                </h1>
              </div>
              <p className="text-xl text-primary-100 mb-8">
                A Government of Sri Lanka Initiative
              </p>
              <p className="text-lg mb-8 max-w-xl">
                Efficiently manage your fuel consumption with the official Sri Lankan
                fuel quota management system. Register your vehicles, track usage, and access fuel
                stations seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link to="/signup" className="btn bg-white text-primary-700 hover:bg-primary-50 transition-colors">
                  Register Now
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <Link to="/login" className="btn border border-white text-white hover:bg-primary-600 transition-colors">
                  Login
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img 
                src="https://images.pexels.com/photos/5699376/pexels-photo-5699376.jpeg" 
                alt="Fuel Quota System" 
                className="rounded-lg shadow-lg max-h-96 object-cover animate-fade-in"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 text-center mb-12">
            Key Features of the System
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-3">Secure Registration</h3>
              <p className="text-neutral-600">
                Multi-step verification process ensures secure and authenticated registration of vehicles.
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                <Smartphone size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-3">QR Code Integration</h3>
              <p className="text-neutral-600">
                Digital QR codes for seamless verification at fuel stations without the need for physical documents.
              </p>
            </div>
            
            <div className="card flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center mb-4">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-bold text-primary-700 mb-3">Real-time Tracking</h3>
              <p className="text-neutral-600">
                Monitor your fuel consumption history and remaining quota in real-time through your personal dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 text-center mb-12">
            How It Works
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary-200"></div>
              
              {/* Steps */}
              <div className="space-y-8">
                {/* Step 1 */}
                <div className="relative pl-16">
                  <div className="absolute left-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-primary-700 mb-2">Register Your Account</h3>
                  <p className="text-neutral-600">
                    Create an account using your email and complete the verification process.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="relative pl-16">
                  <div className="absolute left-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-primary-700 mb-2">Add Vehicle Details</h3>
                  <p className="text-neutral-600">
                    Provide your vehicle information including registration number, chassis number, vehicle type, and fuel type.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="relative pl-16">
                  <div className="absolute left-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-primary-700 mb-2">Receive Your QR Code</h3>
                  <p className="text-neutral-600">
                    Once registered, you'll receive a QR code unique to your vehicle for fuel station verification.
                  </p>
                </div>
                
                {/* Step 4 */}
                <div className="relative pl-16">
                  <div className="absolute left-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-primary-700 mb-2">Get Fuel at Stations</h3>
                  <p className="text-neutral-600">
                    Visit any authorized fuel station, present your QR code, and receive your allocated quota.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/signup" className="btn-primary inline-flex items-center">
              Get Started Now
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-700 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary-700 mb-2">How do I register multiple vehicles?</h3>
              <p className="text-neutral-600">
                After registering your first vehicle, you can add additional vehicles from your dashboard by clicking "Add Vehicle" and following the same registration process.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary-700 mb-2">What if I change my vehicle?</h3>
              <p className="text-neutral-600">
                You can update your vehicle information from your profile settings. Any changes will require verification and approval from the system administrators.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary-700 mb-2">How often is the fuel quota reset?</h3>
              <p className="text-neutral-600">
                The fuel quota is reset on a monthly basis. Any unused quota does not carry over to the next month.
              </p>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-bold text-primary-700 mb-2">What if my QR code doesn't scan at the station?</h3>
              <p className="text-neutral-600">
                If your QR code doesn't scan, you can request the station attendant to manually enter your vehicle registration number into the system.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Sri Lankans in efficiently managing their fuel consumption
            through the official government system.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/signup" className="btn bg-white text-primary-700 hover:bg-primary-50 transition-colors">
              Register Now
            </Link>
            <Link to="/login" className="btn border border-white text-white hover:bg-primary-600 transition-colors">
              Login to Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;