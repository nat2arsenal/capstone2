const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	
	firstName: {
		type: String,
		required: [true, "First name is required."]
	},
	lastName: {
		type: String,
		required: [true, "Last name is required."]
	},
	email: {
		type: String,
		required: [true, "Email is required."]
	},
	password: {
		type: String,
		required: [true, "Password is required."]
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	mobileNumber: {
		type: String,
		required: [true, "Mobile number is required."]
	},
	cart: {
		products : [
			{
				productName : {
					type: String,
					required : [true, "Product name is required"]
				},
				quantity : {
					type: Number,
					required : [true, "Product quantity is required"]
				}
			}
		]
	}


});

module.exports = mongoose.model("User", userSchema);