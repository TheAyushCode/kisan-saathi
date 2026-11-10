import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-200 mt-16 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-white mb-2">
              <Sprout className="w-5 h-5 text-amber-300" />
              <span className="font-bold text-lg">किसान साथी बिहार</span>
            </div>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              बिहार के सभी 38 ज़िलों के छोटे व सीमांत किसानों को पारदर्शी किराए पर कृषि यंत्र और सुरक्षित पैक्स/शीतगृह भंडारण से जोड़ने की डिजिटल पहल।
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-300" />
              आपातकालीन एवं सहायता नंबर
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-200/90">
              <li>• किसान कॉल सेंटर: <strong>1800-180-1551</strong> (टोल फ्री)</li>
              <li>• कृषि विभाग बिहार हेल्पलाइन: <strong>0612-2215612</strong></li>
              <li>• पैक्स सहयोग केंद्र: <strong>सहकारिता विभाग, बिहार सरकार</strong></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              किसान सुरक्षा एवं भरोसा
            </h4>
            <p className="text-xs text-emerald-300/80 leading-relaxed">
              सीधी बातचीत, बिचौलियों से मुक्ति, और स्थानीय ब्लॉक स्तर पर मशीनों की उपलब्धता।
            </p>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-amber-300">
              <MapPin className="w-3.5 h-3.5" />
              <span>38 ज़िले | 534 प्रखंड (बिहार)</span>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900/80 mt-8 pt-6 text-center text-xs text-emerald-400/60">
          © {new Date().getFullYear()} किसान साथी बिहार • आत्मनिर्भर किसान, समृद्ध बिहार
        </div>
      </div>
    </footer>
  );
};

export default Footer;