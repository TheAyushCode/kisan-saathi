const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🌿 MongoDB सफलतापूर्वक कनेक्ट हो गया: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ डेटाबेस कनेक्शन में त्रुटि: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;