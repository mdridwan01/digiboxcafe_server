const mongoose = require('mongoose');

const vendingSchema = new mongoose.Schema({
   "1": { type: String, default: "off" },
  "2": { type: String, default: "off" },
  "3": { type: String, default: "off" },
  "4": { type: String, default: "off" },
}, { timestamps: true });

module.exports = mongoose.model('Vending', vendingSchema);

