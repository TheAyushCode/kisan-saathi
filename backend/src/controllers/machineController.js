const Machine = require('../models/Machine');

// 1. सभी मशीनें प्राप्त करें (जिले और प्रकार के अनुसार फ़िल्टर के साथ)
exports.getAllMachines = async (req, res) => {
  try {
    const { district, type, isSubsidized } = req.query;
    let query = { isAvailable: true };

    if (district) {
      query.district = new RegExp(district, 'i');
    }
    if (type) {
      query.type = type;
    }
    if (isSubsidized !== undefined) {
      query.isSubsidized = isSubsidized === 'true';
    }

    const machines = await Machine.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: machines.length,
      data: machines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. नई कृषि मशीन जोड़ें (किसान / मालिक द्वारा)
exports.createMachine = async (req, res) => {
  try {
    const machine = await Machine.create(req.body);
    res.status(201).json({
      success: true,
      message: 'कृषि यंत्र सफलतापूर्वक सूचीबद्ध किया गया 🚜',
      data: machine
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 3. विशिष्ट मशीन का विवरण प्राप्त करें
exports.getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({ success: false, message: 'मशीन नहीं मिली' });
    }
    res.status(200).json({ success: true, data: machine });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};