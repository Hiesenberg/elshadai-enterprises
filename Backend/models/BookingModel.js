const mongoose = require("mongoose");
const bookingSchema = require("./BookingSchema");

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;