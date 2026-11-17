import React, { useState } from 'react';
import {
  Search,
  Calendar,
  Phone,
  Clock,
  CheckCircle2,
  XCircle,
  Tractor,
  Warehouse,
  AlertCircle,
  Printer,
  Fuel,
  UserCheck,
} from 'lucide-react';
import { fetchBookings } from '../services/api';

const MyBookings = () => {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!phone || phone.trim().length !== 10) {
      setError('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetchBookings();
      const userBookings = (res.data || []).filter(
        (b) => b.farmerPhone && b.farmerPhone.trim() === phone.trim()
      );
      setBookings(userBookings);
    } catch (err) {
      setError('बुकिंग लोड करने में समस्या हुई। कृपया सुनिश्चित करें कि बैकएंड चालू है।');
    } finally {
      setLoading(false);
    }
  };

  // डिजिटल रसीद प्रिंट / PDF डाउनलोड फ़ंक्शन
  const handlePrintReceipt = (booking, item, isMachine) => {
    const receiptWindow = window.open('', '_blank', 'width=700,height=800');
    const qty = isMachine
      ? `${booking.areaInKatha || booking.durationOrQuantity || 1} कट्ठा`
      : `${booking.quantityQuintals || booking.durationOrQuantity || 1} क्विंटल`;
    const totalAmount = booking.estimatedTotal || 0;
    const fuelText =
      booking.fuelOption === 'Without_Fuel'
        ? 'बिना डीजल (Without Fuel)'
        : booking.fuelOption === 'With_Fuel'
        ? 'डीजल सहित (With Fuel)'
        : 'लागू नहीं';

    receiptWindow.document.write(`
      <html>
        <head>
          <title>डिजिटल बुकिंग रसीद - किसान साथी बिहार</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
            .box { border: 2px solid #065f46; border-radius: 12px; padding: 24px; max-width: 600px; margin: auto; }
            .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 16px; margin-bottom: 20px; }
            .header h1 { color: #065f46; margin: 0; font-size: 22px; }
            .header p { margin: 4px 0; font-size: 12px; color: #475569; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
            .total { font-size: 18px; font-weight: bold; color: #065f46; border-top: 2px solid #065f46; margin-top: 12px; padding-top: 12px; }
            .badge { background: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 20px; font-weight: bold; font-size: 12px; }
            .footer { text-align: center; margin-top: 24px; font-size: 11px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="header">
              <h1>🌾 किसान साथी बिहार (Kisan Saathi Bihar)</h1>
              <p>ई-साझा कृषि यंत्र एवं भंडारण डिजिटल बुकिंग रसीद</p>
              <p>रसीद संख्या: <strong>#${booking._id.slice(-8).toUpperCase()}</strong></p>
            </div>
            <div class="row"><span>किसान का नाम:</span><strong>${booking.farmerName}</strong></div>
            <div class="row"><span>मोबाइल नंबर:</span><strong>${booking.farmerPhone}</strong></div>
            <div class="row"><span>सेवा / साधन:</span><strong>${item?.name || 'कृषि सेवा'}</strong></div>
            <div class="row"><span>स्थान:</span><strong>${item?.block || ''}, ${item?.district || 'बिहार'}</strong></div>
            <div class="row"><span>सेवा तिथि:</span><strong>${new Date(booking.serviceDate || booking.startDate).toLocaleDateString('hi-IN')}</strong></div>
            <div class="row"><span>मात्रा / क्षेत्रफल:</span><strong>${qty}</strong></div>
            ${isMachine ? `<div class="row"><span>ईंधन विकल्प:</span><strong>${fuelText}</strong></div>` : ''}
            ${isMachine ? `<div class="row"><span>ऑपरेटर:</span><strong>${booking.withOperator ? 'सहित (Included)' : 'नहीं'}</strong></div>` : ''}
            <div class="row"><span>वर्तमान स्थिति:</span><span class="badge">${booking.status}</span></div>
            <div class="row total"><span>कुल अनुमानित बिल राशि:</span><span>₹${totalAmount}</span></div>
            <div class="footer">
              यह कंप्यूटर जनित डिजिटल रसीद है। सहायता हेतु किसान साथी बिहार पोर्टल पर जाएँ।
            </div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg p-6 max-w-xl mx-auto text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-1">मेरी बुकिंग्स एवं डिजिटल रसीद</h2>
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

      {searched && !loading && (
        <div>
          {bookings.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-8 text-center text-slate-500 max-w-lg mx-auto shadow-md">
              इस मोबाइल नंबर ({phone}) से कोई बुकिंग नहीं मिली।
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => {
                const isMachine =
                  b.serviceType === 'Machine_Rent' || b.bookingType === 'Machine';
                const item = isMachine ? b.machineId : b.storageId;

                return (
                  <div
                    key={b._id}
                    className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                          {isMachine ? (
                            <Tractor className="w-5 h-5" />
                          ) : (
                            <Warehouse className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-slate-800">
                            {item?.name || (isMachine ? 'कृषि यंत्र' : 'भंडारण केंद्र')}
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
                          {new Date(b.serviceDate || b.startDate).toLocaleDateString('hi-IN')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">
                          {isMachine ? 'खेत का क्षेत्रफल' : 'भंडारण मात्रा'}
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {isMachine
                            ? `${b.areaInKatha || b.durationOrQuantity || 0} कट्ठा`
                            : `${b.quantityQuintals || b.durationOrQuantity || 0} क्विंटल`}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">कुल अनुमानित बिल</span>
                        <span className="font-extrabold text-emerald-800 text-sm">
                          ₹{b.estimatedTotal || '—'}
                        </span>
                      </div>
                    </div>

                    {isMachine && (
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Fuel className="w-3 h-3" />
                          {b.fuelOption === 'Without_Fuel' ? 'बिना डीजल' : 'डीजल सहित'}
                        </span>
                        {b.withOperator && (
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            ऑपरेटर सहित
                          </span>
                        )}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => handlePrintReceipt(b, item, isMachine)}
                        className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        डिजिटल रसीद / PDF डाउनलोड करें
                      </button>
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