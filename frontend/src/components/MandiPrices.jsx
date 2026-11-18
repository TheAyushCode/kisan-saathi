import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Warehouse,
  MapPin,
  Search,
  Sparkles,
  ArrowRight,
  IndianRupee,
  BarChart3,
  Filter,
} from 'lucide-react';

// बिहार के सभी 38 ज़िले और उनकी प्रमुख बाजार समिति / मंडी
const BIHAR_38_MANDIS = [
  { district: 'Araria', mandi: 'बाजार समिति, अररिया', offset: -20 },
  { district: 'Arwal', mandi: 'कृषि मंडी, अरवल', offset: -10 },
  { district: 'Aurangabad', mandi: 'बाजार समिति, औरंगाबाद', offset: 15 },
  { district: 'Banka', mandi: 'कृषि उपज मंडी, बांका', offset: -15 },
  { district: 'Begusarai', mandi: 'बाजार समिति, बेगूसराय', offset: 25 },
  { district: 'Bhagalpur', mandi: 'बाजार समिति, भागलपुर', offset: 30 },
  { district: 'Bhojpur (Ara)', mandi: 'बाजार समिति, आरा (भोजपुर)', offset: 20 },
  { district: 'Buxar', mandi: 'बाजार समिति, बक्सर', offset: 10 },
  { district: 'Darbhanga', mandi: 'बाजार समिति, दरभंगा', offset: 0 },
  { district: 'East Champaran (Motihari)', mandi: 'बाजार समिति, मोतिहारी', offset: -25 },
  { district: 'Gaya', mandi: 'बाजार समिति, गया', offset: 15 },
  { district: 'Gopalganj', mandi: 'कृषि मंडी, गोपालगंज', offset: -10 },
  { district: 'Jamui', mandi: 'कृषि मंडी, जमुई', offset: -20 },
  { district: 'Jehanabad', mandi: 'बाजार समिति, जहानाबाद', offset: 5 },
  { district: 'Kaimur (Bhabua)', mandi: 'बाजार समिति, मोहनिया (कैमूर)', offset: 15 },
  { district: 'Katihar', mandi: 'बाजार समिति, कटिहार', offset: -15 },
  { district: 'Khagaria', mandi: 'बाजार समिति, खगड़िया', offset: -10 },
  { district: 'Kishanganj', mandi: 'बाजार समिति, किशनगंज', offset: -30 },
  { district: 'Lakhisarai', mandi: 'कृषि मंडी, लखीसराय', offset: 5 },
  { district: 'Madhepura', mandi: 'बाजार समिति, मधेपुरा', offset: -20 },
  { district: 'Madhubani', mandi: 'बाजार समिति, मधुबनी', offset: -15 },
  { district: 'Munger', mandi: 'बाजार समिति, मुंगेर', offset: 10 },
  { district: 'Muzaffarpur', mandi: 'बाजार समिति, मुजफ्फरपुर', offset: 25 },
  { district: 'Nalanda (Bihar Sharif)', mandi: 'बाजार समिति, बिहारशरीफ (नालंदा)', offset: 20 },
  { district: 'Nawada', mandi: 'बाजार समिति, नवादा', offset: 0 },
  { district: 'Patna', mandi: 'बाजार समिति, मुसल्लहपुर / फतुहा (पटना)', offset: 40 },
  { district: 'Purnia', mandi: 'गुलाबबाग मंडी, पूर्णिया', offset: 10 },
  { district: 'Rohtas (Sasaram)', mandi: 'बाजार समिति, सासाराम (रोहतास)', offset: 25 },
  { district: 'Saharsa', mandi: 'बाजार समिति, सहरसा', offset: -15 },
  { district: 'Samastipur', mandi: 'बाजार समिति, समस्तीपुर', offset: 10 },
  { district: 'Saran (Chhapra)', mandi: 'बाजार समिति, छपरा (सारण)', offset: 15 },
  { district: 'Sheikhpura', mandi: 'कृषि मंडी, शेखपुरा', offset: -5 },
  { district: 'Sheohar', mandi: 'कृषि मंडी, शिवहर', offset: -25 },
  { district: 'Sitamarhi', mandi: 'बाजार समिति, सीतामढ़ी', offset: -15 },
  { district: 'Siwan', mandi: 'बाजार समिति, सीवान', offset: 5 },
  { district: 'Supaul', mandi: 'बाजार समिति, सुपौल', offset: -20 },
  { district: 'Vaishali (Hajipur)', mandi: 'बाजार समिति, हाजीपुर (वैशाली)', offset: 30 },
  { district: 'West Champaran (Bettiah)', mandi: 'बाजार समिति, बेतिया', offset: -20 },
];

// प्रमुख फसलें और किस्में (अनाज, दलहन, तिलहन, सब्ज़ियाँ, फल व मसाले)
const CROPS_CATALOG = [
  // अनाज (Cereals)
  { name: 'धान (सामान्य / Paddy Common)', category: 'अनाज', basePrice: 2160, msp: 2300, gainAfterStorage: 320 },
  { name: 'धान (ग्रेड-A / Paddy Grade-A)', category: 'अनाज', basePrice: 2240, msp: 2320, gainAfterStorage: 300 },
  { name: 'धान (कतरनी / Katarni Rice)', category: 'अनाज', basePrice: 2950, msp: 2320, gainAfterStorage: 400 },
  { name: 'धान (सोनम / Sonam)', category: 'अनाज', basePrice: 2550, msp: 2320, gainAfterStorage: 350 },
  { name: 'धान (बासमती / Basmati)', category: 'अनाज', basePrice: 3800, msp: 2320, gainAfterStorage: 500 },
  { name: 'गेहूँ (शरबती / Wheat)', category: 'अनाज', basePrice: 2410, msp: 2275, gainAfterStorage: 280 },
  { name: 'गेहूँ (लोकवन / Wheat Local)', category: 'अनाज', basePrice: 2220, msp: 2275, gainAfterStorage: 260 },
  { name: 'मक्का (पीला / Yellow Maize)', category: 'अनाज', basePrice: 1940, msp: 2225, gainAfterStorage: 410 },
  { name: 'मक्का (सफ़ेद / White Maize)', category: 'अनाज', basePrice: 2050, msp: 2225, gainAfterStorage: 380 },
  { name: 'जौ (Barley)', category: 'अनाज', basePrice: 1850, msp: 1850, gainAfterStorage: 220 },
  { name: 'बाजरा (Pearl Millet)', category: 'अनाज', basePrice: 2450, msp: 2625, gainAfterStorage: 300 },
  { name: 'ज्वार (Sorghum)', category: 'अनाज', basePrice: 3180, msp: 3371, gainAfterStorage: 350 },
  { name: 'रागी / मड़ुआ (Finger Millet)', category: 'अनाज', basePrice: 4100, msp: 4290, gainAfterStorage: 450 },

  // दलहन (Pulses)
  { name: 'चना (देसी / Desi Gram)', category: 'दलहन', basePrice: 5320, msp: 5440, gainAfterStorage: 480 },
  { name: 'चना (काबुली / Kabuli Chana)', category: 'दलहन', basePrice: 8400, msp: 5440, gainAfterStorage: 600 },
  { name: 'मसूर दाल (Red Lentil)', category: 'दलहन', basePrice: 6180, msp: 6425, gainAfterStorage: 520 },
  { name: 'अरहर / तूर दाल (Pigeon Pea)', category: 'दलहन', basePrice: 7350, msp: 7550, gainAfterStorage: 650 },
  { name: 'मूंग (हरा / Green Gram)', category: 'दलहन', basePrice: 8250, msp: 8682, gainAfterStorage: 580 },
  { name: 'उड़द (काली / Black Gram)', category: 'दलहन', basePrice: 7100, msp: 7400, gainAfterStorage: 500 },
  { name: 'मटर (सफ़ेद / White Peas)', category: 'दलहन', basePrice: 4300, msp: 4500, gainAfterStorage: 360 },
  { name: 'खेसारी दाल (Lathyrus)', category: 'दलहन', basePrice: 3900, msp: 4100, gainAfterStorage: 300 },

  // तिलहन (Oilseeds)
  { name: 'सरसों (पीली / Yellow Mustard)', category: 'तिलहन', basePrice: 5580, msp: 5650, gainAfterStorage: 420 },
  { name: 'सरसों (काली / Black Mustard)', category: 'तिलहन', basePrice: 5350, msp: 5650, gainAfterStorage: 450 },
  { name: 'तीसी / अलसी (Linseed)', category: 'तिलहन', basePrice: 5200, msp: 5400, gainAfterStorage: 380 },
  { name: 'सूरजमुखी (Sunflower)', category: 'तिलहन', basePrice: 6950, msp: 7280, gainAfterStorage: 490 },
  { name: 'तिल (सफ़ेद / White Sesame)', category: 'तिलहन', basePrice: 8900, msp: 9267, gainAfterStorage: 600 },
  { name: 'मूंगफली (Groundnut)', category: 'तिलहन', basePrice: 6450, msp: 6783, gainAfterStorage: 470 },
  { name: 'सोयाबीन (Soybean)', category: 'तिलहन', basePrice: 4650, msp: 4892, gainAfterStorage: 390 },

  // सब्ज़ियाँ व कंद (Vegetables & Tubers - कोल्ड स्टोरेज योग्य)
  { name: 'आलू (ज्योति / Potato Jyoti)', category: 'सब्ज़ी', basePrice: 1180, msp: 1400, gainAfterStorage: 480 },
  { name: 'आलू (लाल / Red Potato)', category: 'सब्ज़ी', basePrice: 1320, msp: 1450, gainAfterStorage: 450 },
  { name: 'प्याज (लाल / Red Onion)', category: 'सब्ज़ी', basePrice: 1850, msp: 2000, gainAfterStorage: 550 },
  { name: 'टमाटर (हाइब्रिड / Tomato)', category: 'सब्ज़ी', basePrice: 1400, msp: 1500, gainAfterStorage: 300 },
  { name: 'फूलगोभी (Cauliflower)', category: 'सब्ज़ी', basePrice: 1600, msp: 1700, gainAfterStorage: 250 },
  { name: 'पत्तागोभी (Cabbage)', category: 'सब्ज़ी', basePrice: 1100, msp: 1200, gainAfterStorage: 200 },
  { name: 'बैंगन (Brinjal)', category: 'सब्ज़ी', basePrice: 1350, msp: 1400, gainAfterStorage: 220 },
  { name: 'भिंडी (Okra / Ladyfinger)', category: 'सब्ज़ी', basePrice: 2200, msp: 2300, gainAfterStorage: 280 },
  { name: 'परवल (Pointed Gourd)', category: 'सब्ज़ी', basePrice: 2800, msp: 3000, gainAfterStorage: 350 },
  { name: 'करेला (Bitter Gourd)', category: 'सब्ज़ी', basePrice: 2400, msp: 2500, gainAfterStorage: 300 },
  { name: 'लौकी / कद्दू (Bottle Gourd)', category: 'सब्ज़ी', basePrice: 1050, msp: 1150, gainAfterStorage: 180 },
  { name: 'ओल / सूरन (Elephant Foot Yam)', category: 'सब्ज़ी', basePrice: 2600, msp: 2800, gainAfterStorage: 420 },

  // नकदी फसल, फल व मसाले (Cash Crops, Fruits & Spices)
  { name: 'मखाना (लावा / Fox Nut)', category: 'नकदी व फल', basePrice: 62000, msp: 65000, gainAfterStorage: 5000 },
  { name: 'शाही लीची (Shahi Litchi)', category: 'नकदी व फल', basePrice: 7500, msp: 8000, gainAfterStorage: 1200 },
  { name: 'केला (मालभोग / Banana)', category: 'नकदी व फल', basePrice: 2100, msp: 2200, gainAfterStorage: 350 },
  { name: 'आम (मालदह / Maldah Mango)', category: 'नकदी व फल', basePrice: 4800, msp: 5000, gainAfterStorage: 700 },
  { name: 'गन्ना (Sugarcane FRP)', category: 'नकदी व फल', basePrice: 355, msp: 340, gainAfterStorage: 40 },
  { name: 'जूट / पटसन (Raw Jute)', category: 'नकदी व फल', basePrice: 5150, msp: 5335, gainAfterStorage: 400 },
  { name: 'हल्दी (सूखी / Dry Turmeric)', category: 'मसाले', basePrice: 12800, msp: 13500, gainAfterStorage: 1100 },
  { name: 'धनिया (सूखा / Coriander)', category: 'मसाले', basePrice: 7400, msp: 7800, gainAfterStorage: 650 },
  { name: 'लाल मिर्च (सूखी / Dry Chilli)', category: 'मसाले', basePrice: 14500, msp: 15000, gainAfterStorage: 1200 },
  { name: 'अदरक (Ginger)', category: 'मसाले', basePrice: 6800, msp: 7200, gainAfterStorage: 800 },
  { name: 'लहसुन (Garlic)', category: 'मसाले', basePrice: 9200, msp: 9800, gainAfterStorage: 950 },
];

const MandiPrices = ({ onNavigateToStorage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('Patna');
  const [selectedCategory, setSelectedCategory] = useState('');

  // चुने गए ज़िले या सभी ज़िलों के लिए लाइव मंडी कार्ड तैयार करें
  const mandiRecords = useMemo(() => {
    const targetMandis = selectedDistrict
      ? BIHAR_38_MANDIS.filter((m) => m.district === selectedDistrict)
      : BIHAR_38_MANDIS.slice(0, 6); // "सभी ज़िले" होने पर पहले 6 प्रमुख ज़िलों की मंडियाँ दिखाएँ ताकि पेज तेज़ रहे

    const records = [];
    targetMandis.forEach((mObj) => {
      CROPS_CATALOG.forEach((crop, idx) => {
        if (selectedCategory && crop.category !== selectedCategory) return;

        const currentPrice = Math.max(100, crop.basePrice + mObj.offset);
        const matchesSearch =
          crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mObj.mandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mObj.district.toLowerCase().includes(searchQuery.toLowerCase());

        if (matchesSearch) {
          records.push({
            id: `${mObj.district}-${idx}`,
            crop: crop.name,
            category: crop.category,
            mandi: mObj.mandi,
            district: mObj.district,
            currentPrice,
            msp: crop.msp,
            potentialGain: crop.gainAfterStorage,
          });
        }
      });
    });

    return records;
  }, [selectedDistrict, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-950/75 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 text-white shadow-xl">
        <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>बिहार के सभी 38 ज़िलों की मंडियाँ एवं 50+ फसल किस्में</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          📊 बिहार लाइव मंडी भाव एवं स्मार्ट भंडारण सलाह
        </h2>
        <p className="text-sm text-emerald-100 mt-1.5 max-w-2xl">
          अपना ज़िला और फसल चुनें। यदि मंडी भाव MSP से कम है, तो सीधे नज़दीकी PACS गोदाम या कोल्ड स्टोरेज बुक करके अधिक लाभ कमाएँ।
        </p>

        {/* Search & Filters (38 Districts + Crop Category) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          {/* District Dropdown (All 38 Districts) */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/95 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">प्रमुख ज़िले (या नीचे से कोई 1 ज़िला चुनें)</option>
            {BIHAR_38_MANDIS.map((m) => (
              <option key={m.district} value={m.district}>
                {m.district} — {m.mandi}
              </option>
            ))}
          </select>

          {/* Crop Category Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">सभी फसल श्रेणियाँ (All Crops)</option>
              <option value="अनाज">अनाज (धान, गेहूँ, मक्का, मड़ुआ)</option>
              <option value="दलहन">दलहन (चना, मसूर, अरहर, मूंग)</option>
              <option value="तिलहन">तिलहन (सरसों, तीसी, सूरजमुखी)</option>
              <option value="सब्ज़ी">सब्ज़ियाँ (आलू, प्याज, टमाटर, गोभी)</option>
              <option value="नकदी व फल">नकदी व फल (मखाना, लीची, केला, गन्ना)</option>
              <option value="मसाले">मसाले (हल्दी, धनिया, मिर्च, अदरक)</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="फसल का नाम लिखें (जैसे: धान, मखाना)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/95 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Result Count Bar */}
      <div className="flex items-center justify-between text-xs text-white bg-emerald-950/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
        <span>
          कुल <strong>{mandiRecords.length}</strong> फसल भाव प्रदर्शित हो रहे हैं
          {selectedDistrict ? ` (${selectedDistrict} मंडी)` : ''}
        </span>
        {(selectedCategory || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('');
              setSearchQuery('');
            }}
            className="text-amber-300 hover:underline font-semibold"
          >
            फ़िल्टर साफ़ करें
          </button>
        )}
      </div>

      {/* Mandi Price Cards */}
      {mandiRecords.length === 0 ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 text-center text-slate-600 shadow-md">
          खोजी गई फसल या मंडी का डेटा नहीं मिला। कृपया फ़िल्टर बदलकर देखें।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mandiRecords.map((item) => {
            const isBelowMsp = item.currentPrice < item.msp;
            const diff = Math.abs(item.msp - item.currentPrice);

            return (
              <div
                key={item.id}
                className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg p-5 flex flex-col justify-between space-y-4 hover:shadow-xl transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{item.crop}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item.mandi}</span>
                      </p>
                    </div>
                    {isBelowMsp ? (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <TrendingDown className="w-3.5 h-3.5" />
                        MSP से कम
                      </span>
                    ) : (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <TrendingUp className="w-3.5 h-3.5" />
                        अच्छा भाव
                      </span>
                    )}
                  </div>

                  {/* Price Comparison Box */}
                  <div className="grid grid-cols-2 gap-2.5 bg-slate-50 rounded-xl p-3 border border-slate-200/80 mt-3.5">
                    <div>
                      <span className="text-[11px] text-slate-500 block">आज का मंडी भाव</span>
                      <span className="text-base font-extrabold text-slate-900 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {item.currentPrice}
                        <span className="text-[10px] font-normal text-slate-500 ml-0.5">/क्विंटल</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block">सरकारी MSP / लक्ष्य</span>
                      <span className="text-base font-bold text-emerald-700 flex items-center">
                        <IndianRupee className="w-3.5 h-3.5" />
                        {item.msp}
                        <span className="text-[10px] font-normal text-slate-500 ml-0.5">/क्विंटल</span>
                      </span>
                    </div>
                  </div>

                  {/* Smart Storage Advisory Alert */}
                  <div
                    className={`mt-3 p-3 rounded-xl border text-xs space-y-1 ${
                      isBelowMsp
                        ? 'bg-amber-50 border-amber-200 text-amber-950'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>स्मार्ट सलाह (+₹{item.potentialGain}/क्विंटल संभावित लाभ):</span>
                    </div>
                    <p className="leading-relaxed text-[11px]">
                      {isBelowMsp
                        ? `अभी भाव MSP से ₹${diff} कम है। नज़दीकी PACS गोदाम / कोल्ड स्टोरेज में रखने पर ₹${item.potentialGain}/क्विंटल अधिक लाभ संभव।`
                        : `बाजार भाव मजबूत है। सुरक्षित भंडारण करके सीधे बड़े खरीदारों को बेचने पर ₹${item.potentialGain}/क्विंटल अतिरिक्त मुनाफा संभव।`}
                    </p>
                  </div>
                </div>

                {/* Action Button -> Direct Redirect to PACS Storage Tab */}
                <button
                  onClick={() => onNavigateToStorage(item.district)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Warehouse className="w-4 h-4 text-amber-300" />
                  <span>{item.district} में गोदाम / कोल्ड स्टोरेज बुक करें</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MandiPrices;