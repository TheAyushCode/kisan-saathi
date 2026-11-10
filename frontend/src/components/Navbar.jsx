import React from 'react';
import { Tractor, Warehouse, ClipboardList, PlusCircle, Calculator, ShieldCheck } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onOpenAddListing, onOpenCalculator }) => {
  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer shrink-0" 
            onClick={() => setActiveTab('machines')}
          >
            <div className="bg-emerald-600 p-2 rounded-xl text-amber-300">
              <Tractor className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-base sm:text-xl font-bold tracking-tight text-white block">किसान साथी बिहार</span>
              <span className="text-[10px] sm:text-xs text-emerald-200 hidden sm:block">ई-साझा साधन एवं भंडारण मंच</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('machines')}
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
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
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'storage'
                  ? 'bg-emerald-950 text-amber-300 shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>पैक्स व गोदाम</span>
            </button>

            <button
              onClick={() => setActiveTab('my-bookings')}
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'my-bookings'
                  ? 'bg-emerald-950 text-amber-300 shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              <span>मेरी बुकिंग्स</span>
            </button>

            <button
              onClick={() => setActiveTab('owner-dashboard')}
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors shrink-0 ${
                activeTab === 'owner-dashboard'
                  ? 'bg-emerald-950 text-amber-300 shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>मालिक पोर्टल</span>
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onOpenCalculator}
              title="भूमि मापक कैलकुलेटर"
              className="bg-emerald-700 hover:bg-emerald-600 text-amber-300 p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 border border-emerald-600 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              <span className="hidden md:inline">भूमि मापक</span>
            </button>

            <button
              onClick={onOpenAddListing}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 px-2.5 sm:px-3 py-1.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>साधन जोड़ें</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;