import React from 'react';
import { Mail, Phone, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-primary-800 text-white pt-8 pb-6">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold mb-4">Fuel Quota Management System</h4>
            <p className="text-primary-200 text-sm">
              A service provided by the Ministry of Energy, 
              Government of Sri Lanka to manage and monitor fuel consumption.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-primary-200 text-sm">
              <li>
                <a href="/" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="/help" className="hover:text-white transition-colors">Help & Support</a>
              </li>
              <li>
                <a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Information</h4>
            <ul className="space-y-3 text-primary-200 text-sm">
              <li className="flex items-start space-x-2">
                <Mail size={16} className="mt-0.5" />
                <span>support@fuelquota.gov.lk</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone size={16} className="mt-0.5" />
                <span>+94 11 123 4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <Globe size={16} className="mt-0.5" />
                <span>www.energy.gov.lk</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-700 mt-6 pt-6 text-center text-primary-300 text-xs">
          <p>© {currentYear} Fuel Quota Management System. All rights reserved.</p>
          <p className="mt-1">
            Official website of the Ministry of Energy, Government of Sri Lanka.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;