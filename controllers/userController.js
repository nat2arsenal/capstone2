const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");


module.exports.registerUser = (reqBody) => {
	return User.findOne({email : reqBody.email}).then(result => {

		// Checking if the email is already registered
		if (result !== null){ // Email already has a registered account
			return {message: "ERROR: There is already a registered account under the same email, kindly register again using another email. Thank you."}; 
		} else { // If email isn't registered, proceed with user registration
			let newUser = new User({
				email : reqBody.email,
				password : bcrypt.hashSync(reqBody.password, 10)
			});
		
			return newUser.save().then((user, error) => {
				if (error){
					return false; 
				} else {
					return true; 
				}
			})
		}
	})
}

module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
			if (result == null){
				return {message: "ERROR: Cannot login. Non-existent account."};
			} else {
				// compareSynct is a bcrypt function that compares an unhashed password to a hashed password
				const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

				if(isPasswordCorrect){

					return {access: auth.createAccessToken(result)};

				} else { //if passwords do not match
					return {message:"ERROR: Incorrect password."};
					// return "Incorrect password"
				}
			}
	})
}

module.exports.setAsAdmin = (userId) => {
	return User.findById(userId).then(user => {
		if(user === null){
			return false;
		}else{
			user.isAdmin = true;
			return user.save().then((updatedUser, error) => {
				if(error){
					return false;
				} else {
					return {message : "Congrats! You now have an admin account."};
				}
			})
		}
	})
}

module.exports.getProfile = (userId) => {

	return User.findById(userId).then(result => {

		if (result == null){
			return false;
		} else {

			result.password = "******"
			return result;
		}
	})
}