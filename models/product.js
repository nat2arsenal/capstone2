const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

	productName: {
		type: String,
		required: [true, "Product name is required."]
	},
	description: {
		type: String,
		required: [true, "Product description is required."]
	},
	price: {
		type: Number,
		required: [true, "Product price is required."]
	},
	stocks:{
		type: Number,
		required: [true, "Stock number is required."]
	},
	isActive: {
		type: Boolean,
		default: true
	},
	createdOn: {
		type: Date,
		default: new Date()
	},
});

module.exports = mongoose.model("Product", productSchema);