import React, { useState } from 'react';
import { X, Calendar, User, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { createBooking } from '../services/api';

const BookingModal = ({ item, type, onClose, onSuccess }) => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [areaInKatha, setAreaInKatha] = useState('');
  const [quantityQuintals, setQuantityQuintals] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isMachine = type === 'machine';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!farmerName.trim() || !farmerPhone.trim() || !startDate) {
      setErrorMsg('कृपया नाम, फ़ोन नंबर और तारीख सही से भरें।');
      return;
    }

    if (farmerPhone.trim().length !== 10) {
      setErrorMsg('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    setSubmitting(true);

    try {
      // बैकएंड स्कीमा के लिए संख्या तय करें
      const quantityValue = isMachine
        ? (areaInKatha ? Number(areaInKatha) : 1)
        : (quantityQuintals ? Number(quantityQuintals) : 1);

      const payload = {
        farmerName,
        farmerPhone,
        // बैकएंड स्कीमा के ज़रूरी फ़ील्ड्स
        bookingType: isMachine ? 'Machine' : 'Storage',
        serviceType: isMachine ? 'Machine_Rent' : 'Storage_Space',
        serviceDate: startDate,
        startDate: startDate,
        durationOrQuantity: quantityValue,
        // आईडी एवं अतिरिक्त माप फ़ील्ड्स
        itemId: item._id,
        machineId: isMachine ? item._id : undefined,
        storageId: !isMachine ? item._id : undefined,
        areaInKatha: isMachine && areaInKatha ? Number(areaInKatha) : undefined,
        quantityQuintals: !isMachine && quantityQuintals ? Number(quantityQuintals) : undefined,
      };

      await createBooking(payload);
      onSuccess(item.name || item.type);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'बुकिंग अनुरोध दर्ज करने में विफल। पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            {isMachine ? 'कृषि यंत्र बुकिंग' : 'गोदाम स्लॉट बुकिंग'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">{item.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            स्थान: {item.block}, {item.district}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              किसान का नाम (Farmer Name)
            </label>
            <input
              type="text"
              required
              placeholder="उदा. रमेश कुमार"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              मोबाइल नंबर (10 Digit Mobile)
            </label>
            <input
              type="tel"
              required
              maxLength={10}
              placeholder="98XXXXXXXX"
              value={farmerPhone}
              onChange={(e) => setFarmerPhone(e.target.value.replace(/\D/g, ''))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                प्रारंभ तिथि (Date)
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            {isMachine ? (
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  खेत का क्षेत्रफल (कट्ठा में)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="उदा. 10 कट्ठा"
                  value={areaInKatha}
                  onChange={(e) => setAreaInKatha(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">
                  भंडारण मात्रा (क्विंटल)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="उदा. 50 क्विंटल"
                  value={quantityQuintals}
                  onChange={(e) => setQuantityQuintals(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  दर्ज किया जा रहा है...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  पुष्टि करें एवं अनुरोध भेजें
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;