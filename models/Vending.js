const mongoose = require('mongoose');

const vendingSchema = new mongoose.Schema({
   "box_1": { type: String, default: "off" },
  "2": { type: String, default: "off" },
  "3": { type: String, default: "off" },
  "4": { type: String, default: "off" },
  "uiToken": { type: String, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Vending', vendingSchema);

