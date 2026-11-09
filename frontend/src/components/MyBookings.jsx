import React, { useState } from 'react';
import { Search, Calendar, Phone, Clock, CheckCircle2, XCircle, Tractor, Warehouse, AlertCircle } from 'lucide-react';
import { fetchBookings } from '../services/api';

const MyBookings = () => {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length !== 10) {
      setError('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetchBookings();
      // किसान के फ़ोन नंबर से फ़िल्टर करें
      const userBookings = (res.data || []).filter(
        (b) => b.farmerPhone.trim() === phone.trim()
      );
      setBookings(userBookings);
    } catch (err) {
      setError('बुकिंग लोड करने में समस्या हुई। कृपया सुनिश्चित करें कि बैकएंड चालू है।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            स्वीकृत (Confirmed)
          </span>
        );
      case 'Cancelled':
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5" />
            रद्द (Cancelled)
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            लंबित (Pending)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-1">मेरी बुकिंग्स ट्रैक करें</h2>
        <p className="text-xs text-slate-500 mb-5">
          बुकिंग दर्ज करते समय उपयोग किया गया 10 अंकों का मोबाइल नंबर दर्ज करें
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              maxLength={10}
              placeholder="98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? 'खोज रहे हैं...' : 'खोजें'}
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-600 mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>

      {/* Results Section */}
      {searched && !loading && (
        <div>
          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 max-w-lg mx-auto">
              इस मोबाइल नंबर ({phone}) से कोई बुकिंग नहीं मिली।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => {
                const isMachine = b.serviceType === 'Machine_Rent';
                const item = isMachine ? b.machineId : b.storageId;

                return (
                  <div
                    key={b._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                          {isMachine ? <Tractor className="w-5 h-5" /> : <Warehouse className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-800">
                            {item?.name || (isMachine ? 'कृषि यंत्र' : 'भंडारण स्लॉट')}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {isMachine ? 'यंत्र किराया सेवा' : 'पैक्स / शीतगृह सेवा'}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div>
                        <span className="text-slate-500 block">किसान का नाम</span>
                        <span className="font-semibold text-slate-800">{b.farmerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">सेवा प्रारंभ तिथि</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(b.startDate).toLocaleDateString('hi-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          {isMachine ? 'खेत का क्षेत्रफल' : 'भंडारण मात्रा'}
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {isMachine
                            ? `${b.areaInKatha || 'N/A'} कट्ठा`
                            : `${b.quantityQuintals || 'N/A'} क्विंटल`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">स्थान (ज़िला)</span>
                        <span className="font-semibold text-slate-800">
                          {item?.district || 'बिहार'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyBookings;