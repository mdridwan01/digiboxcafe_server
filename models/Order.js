const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product_id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  OrderStatus: {
    type: String,
    enum: ['Success', "Failed", 'Pending'],
    default: 'Pending',
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
