import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, Wifi, WifiOff, X } from 'lucide-react';

const MobileAppBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // नेट कनेक्शन स्टेटस ट्रैक करें (गाँव में कम नेटवर्क के लिए)
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // PWA Install Prompt पकड़ें
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'अपने मोबाइल में ऐप इंस्टॉल करने के लिए ब्राउज़र के ऊपर दाईं ओर (⋮) मेनू पर क्लिक करें और "Add to Home Screen" या "Install App" चुनें।'
      );
    }
  };

  const handleWhatsAppShare = () => {
    const shareText = encodeURIComponent(
      '🌾 *किसान साथी बिहार* — अब अपने मोबाइल से नज़दीकी ट्रैक्टर, रोटावेटर, पैक्स गोदाम बुक करें और 38 ज़िलों के लाइव मंडी भाव व 80% सरकारी सब्सिडी की जानकारी पाएं:\n' +
        window.location.origin
    );
    window.open(`https://wa.me/?text=${shareText}`, '_blank', 'noopener,noreferrer');
  };

  if (dismissed && isOnline) return null;

  return (
    <div className="mb-5 space-y-2">
      {/* Offline Warning Strip if Internet Drops in Rural Area */}
      {!isOnline && (
        <div className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>इंटरनेट संपर्क टूट गया है — कृपया नेटवर्क जाँचें।</span>
        </div>
      )}

      {/* App Install & WhatsApp Share Strip */}
      {!dismissed && (
        <div className="bg-gradient-to-r from-amber-500/95 via-amber-400/95 to-yellow-400/95 backdrop-blur-md text-amber-950 rounded-2xl px-4 py-3 shadow-lg border border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm">
            <div className="bg-amber-950 text-amber-300 p-2 rounded-xl shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <strong className="block font-extrabold">
                {isInstalled
                  ? 'किसान साथी बिहार मोबाइल ऐप सक्रिय है'
                  : 'बिना Play Store के 2 MB में मोबाइल ऐप इंस्टॉल करें'}
              </strong>
              <span className="text-[11px] text-amber-900 flex items-center gap-1">
                <Wifi className="w-3 h-3" /> कम इंटरनेट (2G/3G) में भी तेज़ काम करता है
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex-1 sm:flex-none bg-emerald-800 hover:bg-emerald-900 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp पर भेजें</span>
            </button>

            {!isInstalled && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 sm:flex-none bg-amber-950 hover:bg-slate-900 text-amber-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ऐप इंस्टॉल करें</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setDismissed(true)}
              title="बंद करें"
              className="p-1.5 text-amber-950/70 hover:text-amber-950 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAppBanner;