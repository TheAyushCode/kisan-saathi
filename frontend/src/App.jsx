import React, { useState } from 'react';
import Navbar from './components/Navbar';

function App() {
  const [activeTab, setActiveTab] = useState('machines');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            {activeTab === 'machines' ? '🚜 ई-साझा कृषि यंत्र (किराया मंच)' : '🏢 पैक्स गोदाम एवं कोल्ड स्टोरेज उपलब्धता'}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            बिहार के 38 ज़िलों के लिए डेटा सर्विस सफलतापूर्वक लिंक हो चुकी है।
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;