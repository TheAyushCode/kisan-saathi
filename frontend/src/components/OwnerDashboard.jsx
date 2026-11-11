import React, { useState, useEffect } from 'react';
import { User, Phone, Tractor, Warehouse, Calendar, Clock, CheckCircle2, XCircle, LogOut, PlusCircle, Check, X } from 'lucide-react';
import { loginOwnerApi, registerOwnerApi, fetchOwnerBookings, updateBookingStatus } from '../services/api';

const BIHAR_DISTRICTS = [
  'Patna', 'Gaya', 'Nalanda (Bihar Sharif)', 'Muzaffarpur', 'Rohtas (Sasaram)',
  'Bhagalpur', 'Darbhanga', 'Samastipur', 'Begusarai', 'Vaishali (Hajipur)'
];

const OwnerDashboard = ({ onOpenAddListing }) => {
  const [currentOwner, setCurrentOwner] = useState(() => {
    const saved = localStorage.getItem('kisan_owner');
    return saved ? JSON.parse(saved) : null;
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', district: 'Patna', block: '' });
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (currentOwner?.phone) {
      loadBookings(currentOwner.phone);
    }
  }, [currentOwner]);

  const loadBookings = async (phone) => {
    setLoadingBookings(true);
    try {
      const res = await fetchOwnerBookings(phone);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    try {
      let res;
      if (isRegistering) {
        res = await registerOwnerApi(formData);
      } else {
        res = await loginOwnerApi({ phone: formData.phone, password: formData.password });
      }

      if (res.success) {
        setCurrentOwner(res.data);
        localStorage.setItem('kisan_owner', JSON.stringify(res.data));
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'लॉगिन / पंजीकरण विफल रहा');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kisan_owner');
    setCurrentOwner(null);
    setBookings([]);
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert('स्थिति बदलने में त्रुटि हुई');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!currentOwner) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl my-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Tractor className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {isRegistering ? 'मशीन मालिक पंजीकरण' : 'मशीन मालिक लॉगिन'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {isRegistering ? 'अपनी मशीनों के अनुरोध देखने के लिए खाता बनाएँ' : 'अनुरोध स्वीकार या रद्द करने के लिए लॉगिन करें'}
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 border border-red-200">
            {authError}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
          {isRegistering && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">पूरा नाम</label>
              <input
                type="text"
                required
                placeholder="उदा. संजय कुमार"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>
          )}

          <div>
            <label className="font-semibold text-slate-700 block mb-1">मोबाइल नंबर (10 अंक)</label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="98XXXXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">पासवर्ड</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {isRegistering && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">ज़िला</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs focus:ring-2 focus:ring-emerald-600"
                >
                  {BIHAR_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">प्रखंड (Block)</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. दानापुर"
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50 mt-2"
          >
            {authLoading ? 'कृपया प्रतीक्षा करें...' : isRegistering ? 'पंजीकरण करें' : 'लॉगिन करें'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setAuthError('');
            }}
            className="text-xs text-emerald-700 font-semibold hover:underline"
          >
            {isRegistering ? 'पहले से खाता है? लॉगिन करें' : 'नया खाता बनाएँ (New Registration)'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 p-2 rounded-xl">
            <User className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{currentOwner.name}</h2>
            <p className="text-xs text-slate-500">
              मो: <strong>{currentOwner.phone}</strong> | {currentOwner.block}, {currentOwner.district}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenAddListing}
            className="flex-1 sm:flex-none bg-amber-400 hover:bg-amber-500 text-amber-950 px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>नया साधन जोड़ें</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1 border border-slate-200"
          >
            <LogOut className="w-4 h-4" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-slate-800 mb-3">
          किसानों के अनुरोध एवं बुकिंग हिस्ट्री ({bookings.length})
        </h3>

        {loadingBookings ? (
          <div className="text-center py-10 text-slate-500 text-sm">लोड हो रहा है...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 max-w-md mx-auto">
            आपके पंजीकृत नंबर ({currentOwner.phone}) से जुड़ी मशीनों पर अभी कोई अनुरोध नहीं आया है।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => {
              const isMachine = b.serviceType === 'Machine_Rent' || b.bookingType === 'Machine';
              const item = isMachine ? b.machineId : b.storageId;

              return (
                <div key={b._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                        {isMachine ? <Tractor className="w-5 h-5" /> : <Warehouse className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{item?.name || 'कृषि साधन'}</h4>
                        <span className="text-[11px] text-slate-500">{item?.block}, {item?.district}</span>
                      </div>
                    </div>
                    {b.status === 'Confirmed' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> स्वीकृत
                      </span>
                    )}
                    {b.status === 'Cancelled' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-800 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> रद्द
                      </span>
                    )}
                    {b.status === 'Pending' && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> लंबित
                      </span>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">किसान का नाम:</span>
                      <span className="font-bold text-slate-800">{b.farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">किसान का संपर्क:</span>
                      <a href={`tel:${b.farmerPhone}`} className="font-bold text-emerald-700 underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {b.farmerPhone}
                      </a>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">तारीख:</span>
                      <span className="font-medium text-slate-700">
                        {new Date(b.serviceDate || b.startDate).toLocaleDateString('hi-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">मात्रा / क्षेत्रफल:</span>
                      <span className="font-bold text-emerald-700">
                        {isMachine ? `${b.areaInKatha || b.durationOrQuantity || 0} कट्ठा` : `${b.quantityQuintals || b.durationOrQuantity || 0} क्विंटल`}
                      </span>
                    </div>
                  </div>

                  {b.status === 'Pending' ? (
                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={actionLoadingId === b._id}
                        onClick={() => handleStatusUpdate(b._id, 'Confirmed')}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> स्वीकार करें
                      </button>
                      <button
                        disabled={actionLoadingId === b._id}
                        onClick={() => handleStatusUpdate(b._id, 'Cancelled')}
                        className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <X className="w-4 h-4" /> रद्द करें
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-1 text-xs text-slate-400">
                      यह स्थिति अपडेट हो चुकी है
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;