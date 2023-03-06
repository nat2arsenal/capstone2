const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stocks: { type: Number, required: true },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  image: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);
