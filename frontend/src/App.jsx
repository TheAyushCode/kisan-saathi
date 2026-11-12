import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MachineCard from './components/MachineCard';
import StorageCard from './components/StorageCard';
import FilterBar from './components/FilterBar';
import BookingModal from './components/BookingModal';
import MyBookings from './components/MyBookings';
import OwnerDashboard from './components/OwnerDashboard';
import AddListingModal from './components/AddListingModal';
import LandCalculatorModal from './components/LandCalculatorModal';
import Footer from './components/Footer';
import { fetchMachines, fetchStorage } from './services/api';
import { Loader2, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('machines');
  const [machines, setMachines] = useState([]);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [selectedItemForBooking, setSelectedItemForBooking] = useState(null);
  const [bookingType, setBookingType] = useState('machine');
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    if (activeTab === 'machines' || activeTab === 'storage') {
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
    setSuccessToast(`बधाई! '${itemName}' के लिए आपका अनुरोध दर्ज हो गया है।`);
    setTimeout(() => setSuccessToast(''), 5000);
  };

  const handleListingSuccess = (msg) => {
    setIsAddListingOpen(false);
    setSuccessToast(msg);
    loadData();
    setTimeout(() => setSuccessToast(''), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      
      {/* ================= FULL SCREEN ANIMATED FARM & HARVESTING BACKGROUND ================= */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* चलता हुआ फसल एवं हार्वेस्टिंग वीडियो (वीडियो लोड न होने पर एनिमेटेड इमेज फॉलबैक के साथ) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover animate-farm-bg opacity-85"
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-harvesting-wheat-with-a-combine-harvester-42651-large.mp4"
            type="video/mp4"
          />
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-green-wheat-field-swaying-in-the-wind-42646-large.mp4"
            type="video/mp4"
          />
        </video>

        {/* हल्का हरा और साफ़ ग्लास ओवरले ताकि टेक्स्ट और कार्ड बिल्कुल साफ़ दिखें */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/55 via-slate-900/35 to-emerald-950/70 backdrop-blur-[2px]" />
      </div>
      {/* ===================================================================================== */}

      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          handleResetFilters();
        }}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {successToast && (
          <div className="mb-6 bg-emerald-600/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-between text-sm animate-in fade-in">
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

        {/* View 1: Farmer View */}
        {activeTab === 'my-bookings' && <MyBookings />}

        {/* View 2: Owner View */}
        {activeTab === 'owner-dashboard' && (
          <OwnerDashboard onOpenAddListing={() => setIsAddListingOpen(true)} />
        )}

        {/* View 3: Marketplace View */}
        {(activeTab === 'machines' || activeTab === 'storage') && (
          <>
            {/* Translucent Glass Banner */}
            <div className="bg-emerald-950/65 backdrop-blur-md rounded-3xl shadow-xl mb-6 border border-white/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>बिहार कृषि डिजिटल पहल</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                  {activeTab === 'machines'
                    ? '🚜 ई-साझा कृषि यंत्र (किराया मंच)'
                    : '🏢 पैक्स गोदाम एवं शीतगृह (कोल्ड स्टोरेज)'}
                </h1>
                <p className="text-sm sm:text-base text-emerald-100 mt-1.5">
                  बिहार के सभी 38 ज़िलों के किसानों के लिए आधुनिक मशीनों और सुरक्षित भंडारण की सीधी बुकिंग व पारदर्शी दरें
                </p>
              </div>

              <button
                onClick={loadData}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-md text-white px-4 py-2.5 rounded-xl border border-white/30 text-xs sm:text-sm font-medium flex items-center gap-2 transition-all shadow-sm shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                <span>डेटा रिफ्रेश करें</span>
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
              <div className="flex flex-col items-center justify-center py-16 text-white bg-black/30 backdrop-blur-sm rounded-2xl">
                <Loader2 className="w-8 h-8 animate-spin text-amber-400 mb-2" />
                <p className="text-sm font-medium">डेटा खोजा जा रहा है...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50/95 backdrop-blur-md border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm mb-6 shadow-md">
                {error}
              </div>
            )}

            {!loading && !error && activeTab === 'machines' && machines.length === 0 && (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 p-8 text-center text-slate-700 shadow-lg">
                चुने गए फ़िल्टर के अनुसार कोई कृषि यंत्र उपलब्ध नहीं मिला।
              </div>
            )}

            {!loading && !error && activeTab === 'storage' && storages.length === 0 && (
              <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 p-8 text-center text-slate-700 shadow-lg">
                चुने गए फ़िल्टर के अनुसार कोई गोदाम उपलब्ध नहीं मिला।
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

      <Footer />

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