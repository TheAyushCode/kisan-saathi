import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MachineCard from './components/MachineCard';
import StorageCard from './components/StorageCard';
import FilterBar from './components/FilterBar';
import BookingModal from './components/BookingModal';
import MyBookings from './components/MyBookings';
import AddListingModal from './components/AddListingModal';
import LandCalculatorModal from './components/LandCalculatorModal';
import Footer from './components/Footer';
import { fetchMachines, fetchStorage } from './services/api';
import { Loader2, CheckCircle2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('machines');
  const [machines, setMachines] = useState([]);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // फ़िल्टर स्टेट्स
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // मॉडल्स स्टेट्स
  const [selectedItemForBooking, setSelectedItemForBooking] = useState(null);
  const [bookingType, setBookingType] = useState('machine');
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    if (activeTab !== 'my-bookings') {
      loadData();
    }
  }, [activeTab, selectedDistrict, selectedCategory]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedCategory) params.type = selectedCategory;

      if (activeTab === 'machines') {
        const res = await fetchMachines(params);
        setMachines(res.data || []);
      } else if (activeTab === 'storage') {
        const res = await fetchStorage(params);
        setStorages(res.data || []);
      }
    } catch (err) {
      setError('डेटा लोड करने में त्रुटि हुई। कृपया सुनिश्चित करें कि बैकएंड सर्वर चालू है।');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedDistrict('');
    setSelectedCategory('');
  };

  const handleMachineBook = (machine) => {
    setBookingType('machine');
    setSelectedItemForBooking(machine);
  };

  const handleStorageBook = (storage) => {
    setBookingType('storage');
    setSelectedItemForBooking(storage);
  };

  const handleBookingSuccess = (itemName) => {
    setSelectedItemForBooking(null);
    setSuccessToast(`बधाई! '${itemName}' के लिए आपका बुकिंग अनुरोध दर्ज हो गया है।`);
    setTimeout(() => setSuccessToast(''), 5000);
  };

  const handleListingSuccess = (msg) => {
    setIsAddListingOpen(false);
    setSuccessToast(msg);
    loadData();
    setTimeout(() => setSuccessToast(''), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          handleResetFilters();
        }}
        onOpenAddListing={() => setIsAddListingOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Toast */}
        {successToast && (
          <div className="mb-6 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successToast}</span>
            </div>
            <button
              onClick={() => setSuccessToast('')}
              className="text-white/80 hover:text-white text-xs ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* View 1: My Bookings Dashboard */}
        {activeTab === 'my-bookings' && <MyBookings />}

        {/* View 2: Machines / Storage Marketplace */}
        {activeTab !== 'my-bookings' && (
          <>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {activeTab === 'machines'
                    ? '🚜 ई-साझा कृषि यंत्र (किराया मंच)'
                    : '🏢 पैक्स गोदाम एवं शीतगृह (कोल्ड स्टोरेज)'}
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  बिहार के 38 ज़िलों के किसानों के लिए सीधी बुकिंग व पारदर्शी दरें (कट्ठा / बीघा / क्विंटल)
                </p>
              </div>
              <button
                onClick={loadData}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-300 font-medium"
              >
                रिफ्रेश करें 🔄
              </button>
            </div>

            <FilterBar
              activeTab={activeTab}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onReset={handleResetFilters}
            />

            {loading && (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mb-2" />
                <p className="text-sm">डेटा खोजा जा रहा है...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm mb-6">
                {error}
              </div>
            )}

            {!loading && !error && activeTab === 'machines' && machines.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                चुने गए फ़िल्टर के अनुसार कोई कृषि यंत्र उपलब्ध नहीं मिला। कृपया दूसरा ज़िला या श्रेणी चुनें।
              </div>
            )}

            {!loading && !error && activeTab === 'storage' && storages.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
                चुने गए फ़िल्टर के अनुसार कोई गोदाम/कोल्ड स्टोरेज उपलब्ध नहीं मिला। कृपया दूसरा ज़िला चुनें।
              </div>
            )}

            {!loading && !error && activeTab === 'machines' && machines.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {machines.map((machine) => (
                  <MachineCard key={machine._id} machine={machine} onBook={handleMachineBook} />
                ))}
              </div>
            )}

            {!loading && !error && activeTab === 'storage' && storages.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storages.map((storage) => (
                  <StorageCard key={storage._id} storage={storage} onBook={handleStorageBook} />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedItemForBooking && (
        <BookingModal
          item={selectedItemForBooking}
          type={bookingType}
          onClose={() => setSelectedItemForBooking(null)}
          onSuccess={handleBookingSuccess}
        />
      )}

      {isAddListingOpen && (
        <AddListingModal
          onClose={() => setIsAddListingOpen(false)}
          onSuccess={handleListingSuccess}
        />
      )}

      {isCalculatorOpen && (
        <LandCalculatorModal onClose={() => setIsCalculatorOpen(false)} />
      )}
    </div>
  );
}

export default App;