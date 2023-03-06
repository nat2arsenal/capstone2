const mongoose = require('mongoose');

const orderProductSchema = mongoose.Schema({
  /*    orderId: {
        type: mongoose.Schema.Types.ObjectId
        ref: "Order"
    },*/
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  /*    quantity: {
        type: Number,
        required: true
    },
    */

  /*    orderId: {
        type: String,
        required: true
    },*/
  /*    productId: {
        type: String,
        required: true
    },*/
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('OrderProduct', orderProductSchema);
