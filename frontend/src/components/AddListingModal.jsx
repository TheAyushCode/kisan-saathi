import React, { useState } from 'react';
import { X, PlusCircle, Tractor, Warehouse, Loader2 } from 'lucide-react';
import { createMachine, createStorage } from '../services/api';

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

const AddListingModal = ({ onClose, onSuccess }) => {
  const [listingType, setListingType] = useState('machine'); // 'machine' | 'storage'
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // साझा फ़ील्ड्स
  const [name, setName] = useState('');
  const [district, setDistrict] = useState(BIHAR_DISTRICTS[0]);
  const [block, setBlock] = useState('');
  const [phone, setPhone] = useState('');

  // मशीन विशिष्ट फ़ील्ड्स
  const [ownerName, setOwnerName] = useState('');
  const [machineType, setMachineType] = useState(MACHINE_TYPES[0]);
  const [ratePerHour, setRatePerHour] = useState('');
  const [ratePerKatha, setRatePerKatha] = useState('');
  const [isSubsidized, setIsSubsidized] = useState(false);

  // स्टोरेज विशिष्ट फ़ील्ड्स
  const [storageType, setStorageType] = useState(STORAGE_TYPES[0]);
  const [totalCapacity, setTotalCapacity] = useState('');
  const [availableCapacity, setAvailableCapacity] = useState('');
  const [ratePerQuintal, setRatePerQuintal] = useState('');
  const [sharedTransport, setSharedTransport] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (phone.length !== 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    setSubmitting(true);

    try {
      if (listingType === 'machine') {
        const payload = {
          name,
          type: machineType,
          district,
          block,
          ownerName,
          ownerPhone: phone,
          ratePerHour: Number(ratePerHour),
          ratePerKatha: ratePerKatha ? Number(ratePerKatha) : 0,
          isSubsidized,
          isAvailable: true
        };
        await createMachine(payload);
        onSuccess(`कृषि यंत्र '${name}' सफलतापूर्वक सूचीबद्ध किया गया!`);
      } else {
        const payload = {
          name,
          type: storageType,
          district,
          block,
          operatorPhone: phone,
          totalCapacityQuintals: Number(totalCapacity),
          availableCapacityQuintals: Number(availableCapacity),
          ratePerQuintalMonth: Number(ratePerQuintal),
          temperatureRange: storageType === 'Cold Storage' ? '2°C - 8°C' : 'सामान्य गोदाम (Ambient)',
          suitableForCrops: ['धान/चावल (Paddy/Rice)', 'गेहूँ (Wheat)', 'मक्का (Maize)'],
          sharedTransportAvailable: sharedTransport
        };
        await createStorage(payload);
        onSuccess(`भंडारण केंद्र '${name}' सफलतापूर्वक पंजीकृत हुआ!`);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'लिस्टिंग दर्ज करने में विफल। पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-slate-900">किराया / भंडारण हेतु नया साधन जोड़ें</h2>
        <p className="text-xs text-slate-500 mb-4">
          बिहार के साथी किसानों के साथ अपनी मशीनें या खाली गोदाम साझा करें
        </p>

        {/* Type Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
          <button
            type="button"
            onClick={() => setListingType('machine')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              listingType === 'machine' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tractor className="w-4 h-4" />
            कृषि यंत्र (मशीन)
          </button>
          <button
            type="button"
            onClick={() => setListingType('storage')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              listingType === 'storage' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            पैक्स / शीतगृह (Storage)
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* नाम */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {listingType === 'machine' ? 'मशीन का नाम व मॉडल' : 'गोदाम / पैक्स केंद्र का नाम'}
            </label>
            <input
              type="text"
              required
              placeholder={listingType === 'machine' ? 'उदा. महिंद्रा 575 DI' : 'उदा. बिहटा पैक्स गोदाम'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* श्रेणी */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">प्रकार (Category)</label>
            <select
              value={listingType === 'machine' ? machineType : storageType}
              onChange={(e) => listingType === 'machine' ? setMachineType(e.target.value) : setStorageType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            >
              {(listingType === 'machine' ? MACHINE_TYPES : STORAGE_TYPES).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* ज़िला और प्रखंड */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">ज़िला (District)</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                {BIHAR_DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">प्रखंड / ब्लॉक (Block)</label>
              <input
                type="text"
                required
                placeholder="उदा. दानापुर"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* संपर्क सूत्र */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {listingType === 'machine' ? (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">मालिक का नाम</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. सुरेश यादव"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            ) : null}

            <div className={listingType === 'storage' ? 'sm:col-span-2' : ''}>
              <label className="font-semibold text-slate-700 block mb-1">मोबाइल नंबर</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10 अंकों का नंबर"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          {/* मशीन दरें */}
          {listingType === 'machine' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">दर (₹ / घंटा)</label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="उदा. 600"
                  value={ratePerHour}
                  onChange={(e) => setRatePerHour(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">दर (₹ / कट्ठा) [वैकल्पिक]</label>
                <input
                  type="number"
                  min="0"
                  placeholder="उदा. 100"
                  value={ratePerKatha}
                  onChange={(e) => setRatePerKatha(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">कुल क्षमता (क्विंटल)</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 5000"
                  value={totalCapacity}
                  onChange={(e) => setTotalCapacity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">उपलब्ध (क्विंटल)</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 2000"
                  value={availableCapacity}
                  onChange={(e) => setAvailableCapacity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">दर (₹/क्विंटल/माह)</label>
                <input
                  type="number"
                  required
                  placeholder="उदा. 30"
                  value={ratePerQuintal}
                  onChange={(e) => setRatePerQuintal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* चेकबॉक्सेस */}
          <div className="pt-1">
            {listingType === 'machine' ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSubsidized}
                  onChange={(e) => setIsSubsidized(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">यह यंत्र बिहार सरकार द्वारा अनुदानित (Subsidized) है</span>
              </label>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sharedTransport}
                  onChange={(e) => setSharedTransport(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span className="text-slate-700">शेयर्ड पिकअप एवं ढुलाई की सुविधा उपलब्ध है</span>
              </label>
            )}
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  जोड़ा जा रहा है...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  सूचीबद्ध करें (Publish Listing)
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddListingModal;