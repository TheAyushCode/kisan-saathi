import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import MachineCard from './components/MachineCard';
import StorageCard from './components/StorageCard';
import { fetchMachines, fetchStorage } from './services/api';
import { Loader2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('machines');
  const [machines, setMachines] = useState([]);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'machines') {
        const res = await fetchMachines();
        setMachines(res.data || []);
      } else {
        const res = await fetchStorage();
        setStorages(res.data || []);
      }
    } catch (err) {
      setError('डेटा लोड करने में त्रुटि हुई। कृपया सुनिश्चित करें कि बैकएंड सर्वर चालू है।');
    } finally {
      setLoading(false);
    }
  };

  const handleMachineBook = (machine) => {
    alert(`बुकिंग प्रक्रिया: ${machine.name} के लिए मालिक (${machine.ownerPhone}) से संपर्क करें।`);
  };

  const handleStorageBook = (storage) => {
    alert(`गोदाम स्लॉट बुकिंग: ${storage.name} के संचालक (${storage.operatorPhone}) से संपर्क करें।`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {activeTab === 'machines' ? '🚜 ई-साझा कृषि यंत्र (किराया मंच)' : '🏢 पैक्स गोदाम एवं शीतगृह (कोल्ड स्टोरेज)'}
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

        {/* Loading & Error States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-700 mb-2" />
            <p className="text-sm">डेटा लोड हो रहा है...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-sm mb-6">
            {error}
          </div>
        )}

        {/* Machines Grid */}
        {!loading && !error && activeTab === 'machines' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {machines.map((machine) => (
              <MachineCard key={machine._id} machine={machine} onBook={handleMachineBook} />
            ))}
          </div>
        )}

        {/* Storage Grid */}
        {!loading && !error && activeTab === 'storage' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storages.map((storage) => (
              <StorageCard key={storage._id} storage={storage} onBook={handleStorageBook} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;