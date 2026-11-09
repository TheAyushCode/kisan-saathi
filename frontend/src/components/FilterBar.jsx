import React from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

const BIHAR_DISTRICTS = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 
  'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'East Champaran (Motihari)', 
  'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur (Bhabhua)', 
  'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 
  'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda (Bihar Sharif)', 'Nawada', 
  'Patna', 'Purnia', 'Rohtas (Sasaram)', 'Saharsa', 'Samastipur', 
  'Saran (Chhapra)', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 
  'Supaul', 'Vaishali (Hajipur)', 'West Champaran (Bettiah)'
];

const MACHINE_TYPES = [
  'Tractor (ट्रैक्टर)', 
  'Rotavator (रोटावेटर)', 
  'Harvester (कंबाइन हार्वेस्टर)', 
  'Laser Land Leveler (लेज़र लेवलर)', 
  'Happy Seeder (हैप्पी सीडर)', 
  'Solar Pump Set (सोलर पंप)'
];

const STORAGE_TYPES = [
  'PACS Warehouse', 
  'Cold Storage', 
  'State Warehousing (BSWC)'
];

const FilterBar = ({ 
  activeTab, 
  selectedDistrict, 
  setSelectedDistrict, 
  selectedCategory, 
  setSelectedCategory,
  onReset 
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* ज़िला फ़िल्टर */}
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            ज़िला चुनें (District)
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          >
            <option value="">सभी 38 ज़िले</option>
            {BIHAR_DISTRICTS.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        {/* श्रेणी फ़िल्टर (मशीन प्रकार / गोदाम प्रकार) */}
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            {activeTab === 'machines' ? 'यंत्र प्रकार (Machine Type)' : 'गोदाम प्रकार (Storage Type)'}
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
          >
            <option value="">सभी श्रेणियाँ</option>
            {(activeTab === 'machines' ? MACHINE_TYPES : STORAGE_TYPES).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* रीसेट बटन */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-xl border border-slate-300 text-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            फ़िल्टर साफ़ करें (Reset)
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;