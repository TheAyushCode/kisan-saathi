import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Tractor,
  Warehouse,
  Clock,
  CheckCircle2,
  XCircle,
  LogOut,
  PlusCircle,
  Check,
  X,
  KeyRound,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import {
  sendRegisterEmailOtpApi,
  verifyAndRegisterOwnerApi,
  loginOwnerApi,
  sendOwnerEmailOtpApi,
  resetOwnerPasswordByEmailApi,
  fetchOwnerBookings,
  updateBookingStatus,
} from '../services/api';

const BIHAR_DISTRICTS = [
  'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur (Ara)',
  'Buxar', 'Darbhanga', 'East Champaran (Motihari)', 'Gaya', 'Gopalganj', 'Jamui',
  'Jehanabad', 'Kaimur (Bhabua)', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai',
  'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda (Bihar Sharif)', 'Nawada',
  'Patna', 'Purnia', 'Rohtas (Sasaram)', 'Saharsa', 'Samastipur', 'Saran (Chhapra)',
  'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali (Hajipur)',
  'West Champaran (Bettiah)'
];

const OwnerDashboard = ({ onOpenAddListing }) => {
  const [currentOwner, setCurrentOwner] = useState(() => {
    const saved = localStorage.getItem('kisan_owner');
    return saved ? JSON.parse(saved) : null;
  });

  // 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    district: 'Patna',
    block: '',
  });

  // Registration Email Verification State
  const [regOtpSent, setRegOtpSent] = useState(false);
  const [regOtpCode, setRegOtpCode] = useState('');

  // Forgot Password Email OTP State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [demoOtpHint, setDemoOtpHint] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Dashboard Bookings States
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

  // 1. लॉगिन सबमिट
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setAuthLoading(true);

    try {
      const res = await loginOwnerApi({
        email: formData.email,
        password: formData.password,
      });

      if (res.success) {
        setCurrentOwner(res.data);
        localStorage.setItem('kisan_owner', JSON.stringify(res.data));
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'लॉगिन विफल रहा। ईमेल या पासवर्ड जाँचें।');
    } finally {
      setAuthLoading(false);
    }
  };

  // 2A. रजिस्ट्रेशन के लिए ईमेल पर OTP भेजें
  const handleSendRegisterOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setDemoOtpHint('');

    if (formData.phone.trim().length !== 10) {
      setAuthError('कृपया सही 10 अंकों का संपर्क मोबाइल नंबर दर्ज करें।');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await sendRegisterEmailOtpApi(formData);
      if (res.success) {
        setRegOtpSent(true);
        setAuthSuccess(res.message);
        if (res.demoOtp) {
          setDemoOtpHint(`ईमेल सत्यापन OTP: ${res.demoOtp}`);
        }
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'ईमेल पर OTP भेजने में समस्या हुई');
    } finally {
      setAuthLoading(false);
    }
  };

  // 2B. ईमेल OTP वेरिफाई करके खाता बनाएँ
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!regOtpCode || regOtpCode.trim().length !== 6) {
      setAuthError('कृपया 6 अंकों का ईमेल OTP दर्ज करें।');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await verifyAndRegisterOwnerApi({
        email: formData.email,
        otp: regOtpCode,
      });

      if (res.success) {
        setCurrentOwner(res.data);
        localStorage.setItem('kisan_owner', JSON.stringify(res.data));
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'OTP सत्यापन विफल रहा');
    } finally {
      setAuthLoading(false);
    }
  };

  // 3A. पासवर्ड भूलने पर ईमेल पर OTP भेजें
  const handleSendForgotOtp = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setDemoOtpHint('');

    if (!forgotEmail.trim()) {
      setAuthError('कृपया अपनी पंजीकृत ईमेल आईडी दर्ज करें।');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await sendOwnerEmailOtpApi(forgotEmail);
      if (res.success) {
        setForgotOtpSent(true);
        setAuthSuccess(res.message);
        if (res.demoOtp) {
          setDemoOtpHint(`पासवर्ड रीसेट ईमेल OTP: ${res.demoOtp}`);
        }
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'OTP भेजने में समस्या हुई');
    } finally {
      setAuthLoading(false);
    }
  };

  // 3B. ईमेल OTP वेरिफाई करके नया पासवर्ड सेट करें
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!forgotOtpCode || !newPassword || newPassword.length < 4) {
      setAuthError('कृपया सही OTP और नया पासवर्ड दर्ज करें।');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await resetOwnerPasswordByEmailApi({
        email: forgotEmail,
        otp: forgotOtpCode,
        newPassword,
      });

      if (res.success) {
        setAuthSuccess(res.message);
        setFormData((prev) => ({ ...prev, email: forgotEmail, password: '' }));
        setForgotOtpSent(false);
        setForgotOtpCode('');
        setNewPassword('');
        setDemoOtpHint('');
        setAuthMode('login');
      }
    } catch (err) {
      setAuthError(err.response?.data?.message || 'पासवर्ड रीसेट विफल रहा');
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

  const resetMessages = () => {
    setAuthError('');
    setAuthSuccess('');
    setDemoOtpHint('');
  };

  // यदि मालिक लॉगिन नहीं है -> Login / Register (Email Verified) / Forgot Password UI
  if (!currentOwner) {
    return (
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl my-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-3">
            {authMode === 'forgot' ? (
              <KeyRound className="w-6 h-6" />
            ) : authMode === 'register' ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <Tractor className="w-6 h-6" />
            )}
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {authMode === 'register'
              ? 'मशीन मालिक ईमेल पंजीकरण'
              : authMode === 'forgot'
              ? 'ईमेल OTP द्वारा पासवर्ड रीसेट'
              : 'मशीन मालिक लॉगिन'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {authMode === 'register'
              ? 'पंजीकरण के लिए आपकी ईमेल आईडी का OTP सत्यापन आवश्यक है'
              : authMode === 'forgot'
              ? 'अपनी पंजीकृत ईमेल आईडी पर OTP मँगाकर नया पासवर्ड सेट करें'
              : 'अपनी पंजीकृत ईमेल आईडी और पासवर्ड से लॉगिन करें'}
          </p>
        </div>

        {authError && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 border border-red-200 flex items-start gap-1.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{authError}</span>
          </div>
        )}

        {authSuccess && (
          <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl mb-4 border border-emerald-200 font-medium">
            {authSuccess}
          </div>
        )}

        {demoOtpHint && (
          <div className="bg-amber-50 text-amber-900 text-xs p-3 rounded-xl mb-4 border border-amber-300 font-bold text-center tracking-wide">
            📧 {demoOtpHint}
          </div>
        )}

        {/* ================= 1. FORGOT PASSWORD EMAIL OTP FLOW ================= */}
        {authMode === 'forgot' && (
          <div className="space-y-4 text-xs">
            {!forgotOtpSent ? (
              <form onSubmit={handleSendForgotOtp} className="space-y-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    पंजीकृत ईमेल आईडी (Email ID)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="owner@gmail.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {authLoading ? 'ईमेल भेजा जा रहा है...' : 'ईमेल पर OTP भेजें'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ईमेल पर प्राप्त 6-अंकों का OTP दर्ज करें
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="XXXXXX"
                    value={forgotOtpCode}
                    onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    नया पासवर्ड (New Password)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="नया पासवर्ड लिखें"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {authLoading ? 'अपडेट हो रहा है...' : 'पासवर्ड बदलें और सुरक्षित करें'}
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setForgotOtpSent(false);
                  resetMessages();
                }}
                className="text-xs text-slate-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                वापस लॉगिन पेज पर जाएँ
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. REGISTER WITH EMAIL VERIFICATION FLOW ================= */}
        {authMode === 'register' && (
          <div className="space-y-4 text-xs">
            {!regOtpSent ? (
              <form onSubmit={handleSendRegisterOtp} className="space-y-3.5">
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

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ईमेल आईडी (सत्यापन हेतु अनिवार्य)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    संपर्क मोबाइल नंबर (मशीन लिस्टिंग मैच करने हेतु)
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">पासवर्ड बनाएँ</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">ज़िला</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2 py-2 text-xs focus:ring-2 focus:ring-emerald-600"
                    >
                      {BIHAR_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
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

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50 mt-2"
                >
                  {authLoading ? 'ईमेल OTP भेजा जा रहा है...' : 'ईमेल सत्यापन हेतु OTP भेजें'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <span className="text-slate-500 block">सत्यापन ईमेल:</span>
                  <strong className="text-slate-800 text-sm">{formData.email}</strong>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    ईमेल पर प्राप्त 6-अंकों का OTP दर्ज करें
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="XXXXXX"
                    value={regOtpCode}
                    onChange={(e) => setRegOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-base font-bold tracking-widest text-center focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {authLoading ? 'सत्यापित हो रहा है...' : 'OTP सत्यापित करें और खाता बनाएँ'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegOtpSent(false);
                    resetMessages();
                  }}
                  className="w-full text-center text-xs text-slate-500 hover:text-emerald-700 underline"
                >
                  ईमेल आईडी बदलें / पुनः विवरण भरें
                </button>
              </form>
            )}

            <div className="mt-4 text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setRegOtpSent(false);
                  resetMessages();
                }}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                पहले से खाता है? लॉगिन करें
              </button>
            </div>
          </div>
        )}

        {/* ================= 3. LOGIN FLOW ================= */}
        {authMode === 'login' && (
          <>
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  पंजीकृत ईमेल आईडी (Email ID)
                </label>
                <input
                  type="email"
                  required
                  placeholder="owner@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">पासवर्ड</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot');
                      setForgotEmail(formData.email);
                      resetMessages();
                    }}
                    className="text-[11px] text-emerald-700 hover:underline font-semibold"
                  >
                    पासवर्ड भूल गए? (Email OTP)
                  </button>
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm disabled:opacity-50 mt-2"
              >
                {authLoading ? 'कृपया प्रतीक्षा करें...' : 'लॉगिन करें'}
              </button>
            </form>

            <div className="mt-4 text-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setRegOtpSent(false);
                  resetMessages();
                }}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                नया खाता बनाएँ (ईमेल सत्यापन के साथ)
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // लॉगिन होने के बाद ओनर का डैशबोर्ड
  return (
    <div className="space-y-6">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl">
            <User className="w-5 h-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{currentOwner.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Verified Email
              </span>
            </div>
            <p className="text-xs text-slate-600 flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-700" />
                <strong>{currentOwner.email}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <strong>{currentOwner.phone}</strong>
              </span>
              <span>
                | {currentOwner.block}, {currentOwner.district}
              </span>
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
        <h3 className="text-base font-bold text-white bg-emerald-950/60 backdrop-blur-md px-4 py-2.5 rounded-xl inline-block mb-3 border border-white/15">
          किसानों के अनुरोध एवं बुकिंग हिस्ट्री ({bookings.length})
        </h3>

        {loadingBookings ? (
          <div className="text-center py-10 text-white text-sm">लोड हो रहा है...</div>
        ) : bookings.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-8 text-center text-slate-500 max-w-md mx-auto shadow-md">
            आपके पंजीकृत संपर्क नंबर ({currentOwner.phone}) से जुड़ी मशीनों पर अभी कोई अनुरोध नहीं आया है।
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => {
              const isMachine = b.serviceType === 'Machine_Rent' || b.bookingType === 'Machine';
              const item = isMachine ? b.machineId : b.storageId;

              return (
                <div
                  key={b._id}
                  className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md p-5 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
                        {isMachine ? (
                          <Tractor className="w-5 h-5" />
                        ) : (
                          <Warehouse className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">
                          {item?.name || 'कृषि साधन'}
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          {item?.block}, {item?.district}
                        </span>
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
                      <a
                        href={`tel:${b.farmerPhone}`}
                        className="font-bold text-emerald-700 underline flex items-center gap-1"
                      >
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
                        {isMachine
                          ? `${b.areaInKatha || b.durationOrQuantity || 0} कट्ठा`
                          : `${b.quantityQuintals || b.durationOrQuantity || 0} क्विंटल`}
                      </span>
                    </div>
                    {b.estimatedTotal > 0 && (
                      <div className="flex justify-between border-t border-slate-200 pt-1">
                        <span className="text-slate-500">कुल अनुमानित बिल:</span>
                        <span className="font-extrabold text-emerald-800">₹{b.estimatedTotal}</span>
                      </div>
                    )}
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