const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

	userId: {
	    type: String,
	    required: true
	},
	userFirstName: {
		type: String,
		required: true
	},
	userLastName: {
		type: String,
		required: true
	},
	orderProducts: [
		{
		    productId: {
		            type: String,
		            required: true
		    },
		    quantity: {
		        type: Number,
		        required: true
		    }
		}
	],
	// shippingAddress: {
	//     type: String,
	//     required: [true, "Shipping address is required."]
	// },
	// city: {
	//     type: String,
	//     required: [true, "City is required."]
	// },
	// zip: {
	//     type: String,
	//     required: [true, "ZIP Code is required."]
	// },
	// country: {
	//     type: String,
	//     default: "Philippines"
	// },
	// mobileNumber: {
	// 	type: String,
	// 	required: [true, "Mobile number is required."]
	// },
	status: {
	    type: String,
	    required: true,
	    default: "Pending",
	},
	totalAmount: {
	    type: Number,
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
	"userId": "req.params.userId",
    "orderProducts" : [  
        {
        	"productId" : "", reqBody.orderProducts.productId
            "quantity": 3  reqBody.orderProducts.quantity

        },
        {
        	"productId" : "", reqBody.orderProducts.productId
            "quantity": 3  reqBody.orderProducts.quantity

        }
    ],
    "shippingAddress" : "Flowers Street , 45",     reqBody.shippingAddress
    "city": "Prague",                  reqBody.city
    "zip": "00000",					   reqBody.zip
    "country": "Czech Republic",	   reqBody.country
    "mobileNumber": "+420702241333",   reqBody.mobileNumber
    "totalAmount" : order.orderProducts.subtotal.forEach (subtotal => {
		
    })
    
}

 */

