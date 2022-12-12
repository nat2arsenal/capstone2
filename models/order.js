const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

	orderProducts: [{
	    type: mongoose.Schema.Types.ObjectId,
	    ref: "OrderProduct",
	    required:true
	}],
	shippingAddress: {
	    type: String,
	    required: [true, "Shipping address is required."]
	},
	city: {
	    type: String,
	    required: [true, "City is required."]
	},
	zip: {
	    type: String,
	    required: [true, "ZIP Code is required."]
	},
	country: {
	    type: String,
	    default: "Philippines"
	},
	mobileNumber: {
		type: String,
		required: [true, "Mobile number is required."]
	},
	status: {
	    type: String,
	    required: true,
	    default: "Pending",
	},
	totalAmount: {
	    type: Number,
	},
	user: {
	    type: mongoose.Schema.Types.ObjectId,
	    ref: "User",
	},
	transactionDate: {
		type: Date,
		default: new Date()
	}

});

module.exports = mongoose.model("Order", orderSchema);

/**
Order Example:

{
    "orderProducts" : [
        {
            "quantity": 3,
            "product" : "5fcfc406ae79b0a6a90d2585"
        },
        {
            "quantity": 2,
            "product" : "5fd293c7d3abe7295b1403c4"
        }
    ],
    "shippingAddress" : "Flowers Street , 45",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic",
    "mobileNumber": "+420702241333",
    "user": "5fd51bc7e39ba856244a3b44"
}

 */