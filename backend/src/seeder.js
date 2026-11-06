const mongoose = require('mongoose');
require('dotenv').config();
const Machine = require('./models/Machine');
const Storage = require('./models/Storage');

const sampleMachines = [
  {
    ownerName: 'रामनरेश यादव',
    ownerPhone: '9835012345',
    name: 'Mahindra 575 DI (45 HP)',
    type: 'Tractor (ट्रैक्टर)',
    ratePerHour: 650,
    ratePerKatha: 120,
    district: 'Patna',
    block: 'Danapur',
    isSubsidized: true,
    isAvailable: true,
    rating: 4.8
  },
  {
    ownerName: 'संजय कुमार सिंह',
    ownerPhone: '9431023456',
    name: 'Shaktiman Rotary Tiller 7ft',
    type: 'Rotavator (रोटावेटर)',
    ratePerHour: 550,
    ratePerKatha: 90,
    district: 'Muzaffarpur',
    block: 'Mushahari',
    isSubsidized: false,
    isAvailable: true,
    rating: 4.9
  },
  {
    ownerName: 'अमरेन्द्र महतो',
    ownerPhone: '9123456780',
    name: 'Preet Combine Harvester 987',
    type: 'Harvester (कंबाइन हार्वेस्टर)',
    ratePerHour: 2200,
    ratePerKatha: 350,
    district: 'Rohtas (Sasaram)',
    block: 'Karakat',
    isSubsidized: true,
    isAvailable: true,
    rating: 4.7
  },
  {
    ownerName: 'मोहम्मद आरिफ',
    ownerPhone: '9934098765',
    name: 'Fieldking Laser Land Leveler',
    type: 'Laser Land Leveler (लेज़र लेवलर)',
    ratePerHour: 900,
    ratePerKatha: 160,
    district: 'Nalanda (Bihar Sharif)',
    block: 'Biharsharif',
    isSubsidized: true,
    isAvailable: true,
    rating: 4.9
  },
  {
    ownerName: 'दिलीप कुमार',
    ownerPhone: '9708112233',
    name: 'Kirloskar 5HP Solar Pump',
    type: 'Solar Pump Set (सोलर पंप)',
    ratePerHour: 150,
    ratePerKatha: 40,
    district: 'Gaya',
    block: 'Bodh Gaya',
    isSubsidized: true,
    isAvailable: true,
    rating: 4.6
  }
];

const sampleStorages = [
  {
    name: 'मुशहरी पैक्स अन्न भंडारण केंद्र',
    type: 'PACS Warehouse',
    district: 'Muzaffarpur',
    block: 'Mushahari',
    totalCapacityQuintals: 5000,
    availableCapacityQuintals: 2100,
    suitableForCrops: ['धान/चावल (Paddy/Rice)', 'गेहूँ (Wheat)', 'मक्का (Maize)'],
    temperatureRange: 'सामान्य गोदाम (Ambient)',
    ratePerQuintalMonth: 25,
    sharedTransportAvailable: true,
    operatorPhone: '9470011223'
  },
  {
    name: 'मिथिलांचल मखाना एवं शीतगृह केंद्र',
    type: 'Cold Storage',
    district: 'Darbhanga',
    block: 'Keoti',
    totalCapacityQuintals: 8000,
    availableCapacityQuintals: 3400,
    suitableForCrops: ['मखाना (Makhana)', 'आलू (Potato)', 'प्याज (Onion)'],
    temperatureRange: '2°C - 8°C',
    ratePerQuintalMonth: 45,
    sharedTransportAvailable: true,
    operatorPhone: '9801234567'
  },
  {
    name: 'मगध एग्रो कोल्ड स्टोरेज',
    type: 'Cold Storage',
    district: 'Patna',
    block: 'Fatuha',
    totalCapacityQuintals: 12000,
    availableCapacityQuintals: 4500,
    suitableForCrops: ['आलू (Potato)', 'सब्जियाँ (Vegetables)', 'लीची (Litchi)'],
    temperatureRange: '0°C - 4°C',
    ratePerQuintalMonth: 50,
    sharedTransportAvailable: true,
    operatorPhone: '9304056789'
  },
  {
    name: 'रोहतास राज्य भण्डारण निगम (BSWC)',
    type: 'State Warehousing (BSWC)',
    district: 'Rohtas (Sasaram)',
    block: 'Sasaram',
    totalCapacityQuintals: 15000,
    availableCapacityQuintals: 6200,
    suitableForCrops: ['धान/चावल (Paddy/Rice)', 'गेहूँ (Wheat)'],
    temperatureRange: 'सामान्य गोदाम (Ambient)',
    ratePerQuintalMonth: 22,
    sharedTransportAvailable: false,
    operatorPhone: '9955123456'
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌿 MongoDB सीडिंग के लिए कनेक्ट हुआ...');

    await Machine.deleteMany();
    await Storage.deleteMany();
    console.log('🗑️ पुराना डेटा साफ़ किया गया...');

    await Machine.insertMany(sampleMachines);
    console.log('🚜 कृषि यंत्रों का डेटा सफलतापूर्वक डाला गया!');

    await Storage.insertMany(sampleStorages);
    console.log('🏢 पैक्स एवं कोल्ड स्टोरेज डेटा सफलतापूर्वक डाला गया!');

    console.log('✨ डेटाबेस सीडिंग पूर्ण हुई!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ त्रुटि: ${error.message}`);
    process.exit(1);
  }
};

seedData();