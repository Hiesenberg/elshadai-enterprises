const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 100 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  service: { type: String, required: true, trim: true, maxlength: 50 },
  location: { type: String, required: true, trim: true, maxlength: 50 },
  message: { type: String, trim: true, maxlength: 500 },
});
module.exports = bookingSchema;
