import React from 'react';
import { Tractor, Warehouse, PhoneCall, Sprout, ClipboardList } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setActiveTab('machines')}
          >
            <div className="bg-emerald-600 p-2 rounded-xl text-amber-300">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">किसान साथी बिहार</span>
              <span className="text-xs text-emerald-200">ई-साझा साधन एवं भंडारण मंच</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <nav className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => setActiveTab('machines')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'machines'
                  ? 'bg-emerald-950 text-amber-300 shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>कृषि यंत्र</span>
            </button>

            <button
              onClick={() => setActiveTab('storage')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'storage'
                  ? 'bg-emerald-950 text-amber-300 shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>पैक्स व शीतगृह</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'my-bookings'
                  ? 'bg-emerald-950 text-amber-300 shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>मेरी बुकिंग्स</span>
            </button>
          </nav>

          {/* Helpline Indicator */}
          <div className="hidden lg:flex items-center space-x-2 text-xs bg-emerald-700/60 border border-emerald-600 px-3 py-1.5 rounded-full">
            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
            <span>कॉल सेंटर: 1800-180-1551</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;