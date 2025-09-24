const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: { type: Number, required: true },
  quantity: { type: Number, required: true },
  title: { type: String, required: true },
  imageAlt: { type: String, },
  subTitle: { type: String,  },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  availableProduct: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
