const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

	orderId: {
		type: String,
		required: [true, "Order ID is required."],
		orderedProducts : [
			{
				productId : {
					type: String,
					required : [true, "Product ID is required."]
				},
				quantity : {
					type: Number,
					required : [true, "Product quantity is required."]
				}
			}
		]
	},
	
	totalAmount : {
		type: Number,
		required : [true, "Total amount is required."]
	},
	purchasedOn : {
		type : Date,
		default : new Date()
	}
})

module.exports = mongoose.model("Order", orderSchema);