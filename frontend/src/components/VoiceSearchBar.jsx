import React, { useState } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Languages } from 'lucide-react';

// बिहार के सभी 38 ज़िलों के हिंदी/अंग्रेज़ी नाम (वॉइस से ज़िला पहचानने के लिए)
const DISTRICT_KEYWORDS = [
  { key: 'Araria', words: ['अररिया', 'araria'] },
  { key: 'Arwal', words: ['अरवल', 'arwal'] },
  { key: 'Aurangabad', words: ['औरंगाबाद', 'aurangabad'] },
  { key: 'Banka', words: ['बांका', 'बाँका', 'banka'] },
  { key: 'Begusarai', words: ['बेगूसराय', 'begusarai'] },
  { key: 'Bhagalpur', words: ['भागलपुर', 'bhagalpur'] },
  { key: 'Bhojpur (Ara)', words: ['भोजपुर', 'आरा', 'bhojpur', 'ara'] },
  { key: 'Buxar', words: ['बक्सर', 'buxar'] },
  { key: 'Darbhanga', words: ['दरभंगा', 'darbhanga'] },
  { key: 'East Champaran (Motihari)', words: ['मोतिहारी', 'पूर्वी चंपारण', 'motihari', 'east champaran'] },
  { key: 'Gaya', words: ['गया', 'gaya'] },
  { key: 'Gopalganj', words: ['गोपालगंज', 'gopalganj'] },
  { key: 'Jamui', words: ['जमुई', 'jamui'] },
  { key: 'Jehanabad', words: ['जहानाबाद', 'jehanabad'] },
  { key: 'Kaimur (Bhabua)', words: ['कैमूर', 'भभुआ', 'kaimur', 'bhabua'] },
  { key: 'Katihar', words: ['कटिहार', 'katihar'] },
  { key: 'Khagaria', words: ['खगड़िया', 'khagaria'] },
  { key: 'Kishanganj', words: ['किशनगंज', 'kishanganj'] },
  { key: 'Lakhisarai', words: ['लखीसराय', 'lakhisarai'] },
  { key: 'Madhepura', words: ['मधेपुरा', 'madhepura'] },
  { key: 'Madhubani', words: ['मधुबनी', 'madhubani'] },
  { key: 'Munger', words: ['मुंगेर', 'munger'] },
  { key: 'Muzaffarpur', words: ['मुजफ्फरपुर', 'muzaffarpur'] },
  { key: 'Nalanda (Bihar Sharif)', words: ['नालंदा', 'बिहारशरीफ', 'बिहार शरीफ', 'nalanda', 'bihar sharif'] },
  { key: 'Nawada', words: ['नवादा', 'nawada'] },
  { key: 'Patna', words: ['पटना', 'दानापुर', 'फतुहा', 'patna'] },
  { key: 'Purnia', words: ['पूर्णिया', 'पूर्णियाँ', 'purnia'] },
  { key: 'Rohtas (Sasaram)', words: ['रोहतास', 'सासाराम', 'rohtas', 'sasaram'] },
  { key: 'Saharsa', words: ['सहरसा', 'saharsa'] },
  { key: 'Samastipur', words: ['समस्तीपुर', 'samastipur'] },
  { key: 'Saran (Chhapra)', words: ['सारण', 'छपरा', 'saran', 'chhapra'] },
  { key: 'Sheikhpura', words: ['शेखपुरा', 'sheikhpura'] },
  { key: 'Sheohar', words: ['शिवहर', 'sheohar'] },
  { key: 'Sitamarhi', words: ['सीतामढ़ी', 'sitamarhi'] },
  { key: 'Siwan', words: ['सीवान', 'siwan'] },
  { key: 'Supaul', words: ['सुपौल', 'supaul'] },
  { key: 'Vaishali (Hajipur)', words: ['वैशाली', 'हाजीपुर', 'vaishali', 'hajipur'] },
  { key: 'West Champaran (Bettiah)', words: ['बेतिया', 'पश्चिमी चंपारण', 'bettiah', 'west champaran'] },
];

// क्षेत्रीय भाषाओं के स्वागत संदेश (हिंदी, भोजपुरी, मैथिली, अंगिका)
const REGIONAL_GREETINGS = {
  hi: {
    label: 'हिंदी',
    promptHint: 'बोलें: "पटना में ट्रैक्टर" या "नालंदा में कोल्ड स्टोरेज" या "मंडी भाव"',
    voiceGuide: 'किसान साथी बिहार में आपका स्वागत है। माइक दबाकर अपने जिले और कृषि यंत्र का नाम बोलें।',
  },
  bho: {
    label: 'भोजपुरी',
    promptHint: 'बोलीं: "आरा में रोटावेटर चाहीं" या "बक्सर में गोदाम"',
    voiceGuide: 'किसान साथी बिहार में रउआ सबके स्वागत बा। माइक दबा के आपन जिला आ मशीन के नाम बोलीं।',
  },
  mai: {
    label: 'मैथिली',
    promptHint: 'बाजू: "दरभंगा में थ्रेशर चाही" या "मधुबनी में मखाना भाव"',
    voiceGuide: 'किसान साथी बिहार मे अहाँक स्वागत अछि। माइक दबा क अपन जिला आ यंत्रक नाम बाजू।',
  },
};

const VoiceSearchBar = ({ onVoiceCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [dialect, setDialect] = useState('hi');

  // बोलकर किसान को जवाब सुनाना (Text-to-Speech)
  const speakFeedback = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // बोले गए वाक्य से ज़िला, टैब और मशीन की पहचान करना
  const parseAndExecuteCommand = (transcript) => {
    const text = transcript.toLowerCase();
    let detectedDistrict = '';
    let detectedTab = '';
    let detectedCategory = '';

    // 1. ज़िला पहचानें
    for (const d of DISTRICT_KEYWORDS) {
      if (d.words.some((w) => text.includes(w))) {
        detectedDistrict = d.key;
        break;
      }
    }

    // 2. टैब / सेवा पहचानें
    if (text.includes('गोदाम') || text.includes('स्टोरेज') || text.includes('कोल्ड') || text.includes('पैक्स') || text.includes('storage')) {
      detectedTab = 'storage';
    } else if (text.includes('मंडी') || text.includes('भाव') || text.includes('दाम') || text.includes('रेट') || text.includes('mandi')) {
      detectedTab = 'mandi';
    } else if (text.includes('सब्सिडी') || text.includes('अनुदान') || text.includes('छूट') || text.includes('subsidy')) {
      detectedTab = 'subsidy';
    } else if (text.includes('बुकिंग') || text.includes('रसीद') || text.includes('booking')) {
      detectedTab = 'my-bookings';
    } else if (
      text.includes('ट्रैक्टर') ||
      text.includes('रोटावेटर') ||
      text.includes('थ्रेशर') ||
      text.includes('हार्वेस्टर') ||
      text.includes('मशीन') ||
      text.includes('यंत्र') ||
      text.includes('tractor')
    ) {
      detectedTab = 'machines';
    }

    // 3. मशीन श्रेणी पहचानें
    if (text.includes('ट्रैक्टर') || text.includes('tractor')) detectedCategory = 'Tractor';
    else if (text.includes('रोटावेटर') || text.includes('rotavator')) detectedCategory = 'Rotavator';
    else if (text.includes('हार्वेस्टर') || text.includes('harvester')) detectedCategory = 'Harvester';
    else if (text.includes('थ्रेशर') || text.includes('thresher')) detectedCategory = 'Thresher';

    onVoiceCommand({
      district: detectedDistrict,
      tab: detectedTab,
      category: detectedCategory,
      rawText: transcript,
    });

    const reply = detectedDistrict
      ? `${detectedDistrict} के लिए परिणाम दिखाए जा रहे हैं।`
      : 'आपकी खोज के अनुसार जानकारी खोली गई है।';

    setStatusMessage(reply);
    speakFeedback(reply);
  };

  // माइक चालू करना (Web Speech API)
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatusMessage('आपके ब्राउज़र में वॉइस सर्च समर्थित नहीं है। कृपया Google Chrome का उपयोग करें।');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // हिंदी, भोजपुरी व मैथिली शब्दों को सटीक पकड़ता है
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSpokenText('');
      setStatusMessage('सुन रहे हैं... कृपया बोलें...');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      parseAndExecuteCommand(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setStatusMessage('आवाज़ स्पष्ट नहीं सुनाई दी। कृपया माइक दबाकर पुनः बोलें।');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-emerald-200/80 shadow-lg p-3.5 sm:p-4 mb-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Dialect Switcher & Guide Audio */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg">
            <Languages className="w-3.5 h-3.5 text-emerald-700" />
            <span>बोली चुनें:</span>
          </span>

          {Object.entries(REGIONAL_GREETINGS).map(([key, info]) => (
            <button
              key={key}
              type="button"
              onClick={() => setDialect(key)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                dialect === key
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {info.label}
            </button>
          ))}

          <button
            type="button"
            onClick={() => speakFeedback(REGIONAL_GREETINGS[dialect].voiceGuide)}
            title="आवाज़ में निर्देश सुनें"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>निर्देश सुनें</span>
          </button>
        </div>

        {/* Right: Mic Trigger Button */}
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-slate-500 hidden lg:inline">
            {REGIONAL_GREETINGS[dialect].promptHint}
          </span>

          <button
            type="button"
            onClick={startListening}
            className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-amber-300'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4" />
                <span>सुन रहे हैं... बोलिए</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                <span>बोलकर खोजें (Voice Search)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spoken Result Feedback Strip */}
      {(spokenText || statusMessage) && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          {spokenText && (
            <span className="text-slate-700">
              आपने बोला: <strong className="text-emerald-800">“{spokenText}”</strong>
            </span>
          )}
          {statusMessage && (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              {statusMessage}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceSearchBar;