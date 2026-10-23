import React from 'react';
import { Sprout } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-200 text-center max-w-md w-full">
        <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-700">
          <Sprout size={36} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          किसान साथी बिहार 🌾
        </h1>
        <p className="text-emerald-700 font-medium text-sm mb-4">
          Day 1: सेटअप सफलतापूर्वक पूरा हुआ!
        </p>
        <p className="text-gray-500 text-xs">
          React, Tailwind CSS, Lucide Icons और Node.js का वातावरण तैयार है।
        </p>
      </div>
    </div>
  );
}