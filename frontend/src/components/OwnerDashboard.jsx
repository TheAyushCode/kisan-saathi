import React, { useState } from 'react';
import { Search, Phone, Calendar, Check, X, Tractor, Warehouse, AlertCircle, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { fetchBookings, updateBookingStatus } from '../services/api';

const OwnerDashboard = () => {
  const [ownerPhone, setOwnerPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [incomingBookings, setIncomingBookings] = useState([]);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!ownerPhone || ownerPhone.trim().length !== 10) {
      setError('कृपया सही 10 अंकों का मालिक/संचालक मोबाइल नंबर दर्ज करें।');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetchBookings();
      const allBookings = res.data || [];

      // केवल वे बुकिंग्स निकालें जिनकी मशीन या गोदाम का मालिक फ़ोन नंबर मैच करता है
      const filtered = allBookings.filter((b) => {
        const machinePhone = b.machineId?.ownerPhone?.trim();
        const storagePhone = b.storageId?.operatorPhone?.trim();
        return machinePhone === ownerPhone.trim() || storagePhone === ownerPhone.trim();
      });

      setIncomingBookings(filtered);
    } catch (err) {
      setError('अनुरोध लोड करने में समस्या हुई। कृपया सुनिश्चित करें कि बैकएंड चालू है।');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setIncomingBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert('स्थिति बदलने में त्रुटि हुई।');
    } finally {
      setActionLoadingId(null);
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
      {/* Header Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-1">मशीन मालिक एवं पैक्स प्रबंधक पोर्टल</h2>
        <p className="text-xs text-slate-500 mb-5">
          साधन जोड़ते समय दिया गया अपना 10 अंकों का मोबाइल नंबर दर्ज करें
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="tel"
              maxLength={10}
              placeholder="मालिक का 10 अंकों का नंबर"
              value={ownerPhone}
              onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-5 py-2 rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? 'खोज रहे हैं...' : 'अनुरोध देखें'}
          </button>
        </form>

        {error && (
          <p className="text-xs text-red-600 mt-3 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {error}
          </p>
        )}
      </div>

      {/* Results Box */}
      {searched && !loading && (
        <div>
          {incomingBookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 max-w-lg mx-auto">
              इस मोबाइल नंबर ({ownerPhone}) से जुड़ी मशीनों या गोदामों पर कोई नया किसान अनुरोध नहीं मिला।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingBookings.map((b) => {
                const isMachine = b.serviceType === 'Machine_Rent' || b.bookingType === 'Machine';
                const item = isMachine ? b.machineId : b.storageId;

                return (
                  <div
                    key={b._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                          {isMachine ? <Tractor className="w-5 h-5" /> : <Warehouse className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-800">
                            {item?.name || 'कृषि साधन'}
                          </h3>
                          <span className="text-xs text-slate-500">
                            स्थान: {item?.block}, {item?.district}
                          </span>
                        </div>
                      </div>
                      {getStatusBadge(b.status)}
                    </div>

                    {/* Kisan Details */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-500">किसान का नाम:</span>
                        <span className="font-bold text-slate-800">{b.farmerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">किसान का मोबाइल:</span>
                        <a
                          href={`tel:${b.farmerPhone}`}
                          className="font-bold text-emerald-700 underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {b.farmerPhone}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">तारीख (दिनांक):</span>
                        <span className="font-medium text-slate-800 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(b.serviceDate || b.startDate).toLocaleDateString('hi-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">मात्रा / रकबा:</span>
                        <span className="font-bold text-emerald-700">
                          {isMachine
                            ? `${b.areaInKatha || b.durationOrQuantity || 0} कट्ठा`
                            : `${b.quantityQuintals || b.durationOrQuantity || 0} क्विंटल`}
                        </span>
                      </div>
                    </div>

                    {/* Accept / Reject Buttons */}
                    {b.status === 'Pending' ? (
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          disabled={actionLoadingId === b._id}
                          onClick={() => handleStatusUpdate(b._id, 'Confirmed')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          स्वीकार करें (Accept)
                        </button>
                        <button
                          disabled={actionLoadingId === b._id}
                          onClick={() => handleStatusUpdate(b._id, 'Cancelled')}
                          className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          रद्द करें (Reject)
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-1 text-xs text-slate-400 italic">
                        यह अनुरोध पहले ही {b.status === 'Confirmed' ? 'स्वीकृत' : 'रद्द'} किया जा चुका है
                      </div>
                    )}
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

export default OwnerDashboard;