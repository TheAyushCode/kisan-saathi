import React from 'react';
import { Tractor, Warehouse, PhoneCall, Sprout, ClipboardList, PlusCircle } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onOpenAddListing }) => {
  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div 
            className="flex items-center space-x-3 cursor-pointer shrink-0" 
            onClick={() => setActiveTab('machines')}
          >
            <div className="bg-emerald-600 p-2 rounded-xl text-amber-300">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-white block">किसान साथी बिहार</span>
              <span className="text-[11px] text-emerald-200 hidden sm:block">ई-साझा साधन एवं भंडारण मंच</span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <nav className="flex space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('machines')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'machines'
                  ? 'bg-emerald-950 text-amber-300 shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span className="hidden sm:inline">कृषि यंत्र</span>
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
              <span className="hidden sm:inline">पैक्स व शीतगृह</span>
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
              <span className="hidden sm:inline">मेरी बुकिंग्स</span>
            </button>
          </nav>

          {/* Action & Helpline */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAddListing}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-1.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>साधन जोड़ें</span>
            </button>

            <div className="hidden xl:flex items-center space-x-1 text-xs bg-emerald-700/60 border border-emerald-600 px-3 py-1.5 rounded-full">
              <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
              <span>1800-180-1551</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;