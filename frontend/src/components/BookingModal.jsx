import React, { useState, useMemo } from 'react';
import { X, Calendar, User, Phone, CheckCircle, Loader2, Fuel, UserCheck, Receipt } from 'lucide-react';
import { createBooking } from '../services/api';

const BookingModal = ({ item, type, onClose, onSuccess }) => {
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [areaInKatha, setAreaInKatha] = useState('5');
  const [quantityQuintals, setQuantityQuintals] = useState('20');
  const [fuelOption, setFuelOption] = useState('With_Fuel');
  const [withOperator, setWithOperator] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isMachine = type === 'machine';

  // लाइव अनुमानित बिल गणना (Live Bill Calculation)
  const billingDetails = useMemo(() => {
    const qty = isMachine ? Number(areaInKatha) || 0 : Number(quantityQuintals) || 0;
    const baseRate = isMachine
      ? Number(item.rentPerKatha || item.rentPerHour || 150)
      : Number(item.ratePerQuintal || 40);

    // यदि बिना डीजल के चुना है तो बेस रेट में 30% की छूट
    const effectiveRate =
      isMachine && fuelOption === 'Without_Fuel' ? Math.round(baseRate * 0.7) : baseRate;

    const operatorCharge = isMachine && withOperator ? qty * 15 : 0;
    const subTotal = qty * effectiveRate + operatorCharge;
    const platformFee = Math.round(subTotal * 0.03); // 3% स्टार्टअप प्लेटफॉर्म सेवा शुल्क
    const grandTotal = subTotal + platformFee;

    return {
      qty,
      baseRate,
      effectiveRate,
      operatorCharge,
      subTotal,
      platformFee,
      grandTotal,
    };
  }, [isMachine, areaInKatha, quantityQuintals, fuelOption, withOperator, item]);

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

    if (billingDetails.qty <= 0) {
      setErrorMsg('कृपया सही क्षेत्रफल या मात्रा दर्ज करें।');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        farmerName,
        farmerPhone,
        bookingType: isMachine ? 'Machine' : 'Storage',
        serviceType: isMachine ? 'Machine_Rent' : 'Storage_Space',
        serviceDate: startDate,
        startDate: startDate,
        durationOrQuantity: billingDetails.qty,
        machineId: isMachine ? item._id : undefined,
        storageId: !isMachine ? item._id : undefined,
        areaInKatha: isMachine ? Number(areaInKatha) : undefined,
        quantityQuintals: !isMachine ? Number(quantityQuintals) : undefined,
        fuelOption: isMachine ? fuelOption : 'Not_Applicable',
        withOperator: isMachine ? withOperator : false,
        baseRate: billingDetails.effectiveRate,
        estimatedTotal: billingDetails.grandTotal,
        platformFee: billingDetails.platformFee,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            {isMachine ? 'कृषि यंत्र बुकिंग' : 'गोदाम स्लॉट बुकिंग'}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-1.5">{item.name}</h2>
          <p className="text-xs text-slate-500">
            स्थान: {item.block}, {item.district}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                किसान का नाम
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
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                मोबाइल नंबर (10 अंक)
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
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
                  required
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
                  required
                  value={quantityQuintals}
                  onChange={(e) => setQuantityQuintals(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>
            )}
          </div>

          {/* डीजल एवं ऑपरेटर विकल्प (केवल मशीन के लिए) */}
          {isMachine && (
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1.5">
                  <Fuel className="w-3.5 h-3.5 text-amber-600" />
                  ईंधन / डीजल विकल्प चुनें:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFuelOption('With_Fuel')}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      fuelOption === 'With_Fuel'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    डीजल सहित (Full Rate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFuelOption('Without_Fuel')}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      fuelOption === 'Without_Fuel'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    बिना डीजल (30% छूट)
                  </button>
                </div>
              </div>

              <label className="flex items-center justify-between text-xs text-slate-700 pt-1 cursor-pointer">
                <span className="flex items-center gap-1.5 font-medium">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  प्रशिक्षित ड्राइवर / ऑपरेटर चाहिए (+₹15/कट्ठा)
                </span>
                <input
                  type="checkbox"
                  checked={withOperator}
                  onChange={(e) => setWithOperator(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 rounded"
                />
              </label>
            </div>
          )}

          {/* पारदर्शी अनुमानित बिल कार्ड (Live Bill Breakdown) */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900 border-b border-emerald-200 pb-1.5 mb-1">
              <Receipt className="w-4 h-4 text-emerald-700" />
              <span>अनुमानित पारदर्शी बिल विवरण</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>
                मूल किराया ({billingDetails.qty} {isMachine ? 'कट्ठा' : 'क्विंटल'} × ₹{billingDetails.effectiveRate}):
              </span>
              <span className="font-semibold text-slate-800">
                ₹{billingDetails.qty * billingDetails.effectiveRate}
              </span>
            </div>
            {isMachine && withOperator && (
              <div className="flex justify-between text-slate-600">
                <span>ऑपरेटर शुल्क ({billingDetails.qty} × ₹15):</span>
                <span className="font-semibold text-slate-800">₹{billingDetails.operatorCharge}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>किसान साथी प्लेटफॉर्म सेवा शुल्क (3%):</span>
              <span>₹{billingDetails.platformFee}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-emerald-900 border-t border-emerald-200 pt-1.5 mt-1">
              <span>कुल अनुमानित राशि:</span>
              <span>₹{billingDetails.grandTotal}</span>
            </div>
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-md"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  रसीद तैयार की जा रही है...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  पुष्टि करें एवं अनुरोध भेजें (₹{billingDetails.grandTotal})
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