const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

	userId: {
		type: String,
		required: [true, "User ID is required."]
	},
	orders: [
		{
			products: [{
				productId : {
					type: String,
					required : [true, "Product ID is required."]
				},
				productName : {
					type: String,
					required : [true, "Product name is required."]
				},
				quantity : {
					type: Number,
					required : [true, "Product quantity is required."]
				}
			}],
			transactionDate: {
				type: Date,
				default: new Date()
			},
			isCompleted: {
				type: Boolean,
				default: false
			},	
			totalAmount : {
				type: Number,
				required : [true, "Total amount is required."]
			}
		}
	]
});

module.exports = mongoose.model("Order", orderSchema);