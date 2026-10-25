const Storage = require('../models/Storage');

// 1. सभी पैक्स व कोल्ड स्टोरेज प्राप्त करें
exports.getAllStorage = async (req, res) => {
  try {
    const { district, type, crop } = req.query;
    let query = {};

    if (district) {
      query.district = new RegExp(district, 'i');
    }
    if (type) {
      query.type = type;
    }
    if (crop) {
      query.suitableForCrops = crop;
    }

    const storages = await Storage.find(query).sort({ availableCapacityQuintals: -1 });
    res.status(200).json({
      success: true,
      count: storages.length,
      data: storages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. नया स्टोरेज/पैक्स गोदाम जोड़ें
exports.createStorage = async (req, res) => {
  try {
    const storage = await Storage.create(req.body);
    res.status(201).json({
      success: true,
      message: 'भंडारण केंद्र सफलतापूर्वक जोड़ा गया 🏢',
      data: storage
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. विशिष्ट स्टोरेज का विवरण
exports.getStorageById = async (req, res) => {
  try {
    const storage = await Storage.findById(req.params.id);
    if (!storage) {
      return res.status(404).json({ success: false, message: 'भंडारण केंद्र नहीं मिला' });
    }
    res.status(200).json({ success: true, data: storage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};