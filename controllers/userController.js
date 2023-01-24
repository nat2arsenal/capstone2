const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");

module.exports.checkEmailExist = (reqBody) => {

	// ".find" - a mongoose crud operation (query) to find a field value from a collection
	return User.find({email: reqBody.email}).then(result => {

		// condition if there is an existing user
		if(result.length >0){
			return true;
		}

		// condition if there is no existing user
		else {
			return false;
		}
	})

}

// module.exports.checkIfAdmin = (reqBody) => {

// 	// ".find" - a mongoose crud operation (query) to find a field value from a collection
// 	return User.find({email: reqBody.email}).then(result => {

// 		if(result.isAdmin === true) {
// 			return true;
// 		} else {
// 			userController.setAsAdmin(req.params.userId, req).then(resultFromController => res.send(resultFromController));
// 		}
// 	})

// }

/*
// User Registration - OK
module.exports.registerUser = (reqBody) => {
	return User.findOne({email : reqBody.email}).then(result => {

		// Checking if the email is already registered
		if (result !== null){ // Email already has a registered account
			// return {ERROR: "There is already a registered account under the same email, kindly register again using another email. Thank you."}; 
			return false;
		} else { // If email isn't registered, proceed with user registration
			let newUser = new User({
				firstName: reqBody.firstName,
				lastName: reqBody.lastName,
				email : reqBody.email,
				password : bcrypt.hashSync(reqBody.password, 10),
				mobileNumber: reqBody.mobileNumber
			});
		
			return newUser.save().then((user, error) => {
				if (error){
					// return {ERROR: "User registration failed."}; 
					return false;
				} else {
					// return {message: "Congratulations! You are now registered."}; 
					return true;
				}
			})
		}
	});
};
*/


module.exports.registerUser = (reqBody) => {
	
	let newUser = new User({
		firstName: reqBody.firstName,
		lastName: reqBody.lastName,
		email: reqBody.email,
		/*
			// bcrypt - package for password hashing
			// hashSync - synchronously generates a hash (needs to finish before proceeding to next code)
			// hash - asynchronously generates a hash
		*/
		password: bcrypt.hashSync(reqBody.password,10),
		/*
			// 10 = salt rounds
			// salt rounds is proportional to hashing rounds, the higher the salt rounds, the more hashing rounds and the longer it takes to generate an output
			// hashing - converts a value to another value
		*/
		mobileNumber: reqBody.mobileNumber
	})

	return newUser.save().then((user, error) => {

		if(error) {
			return false;
		} else {
			return true;
		}
	})
}

// User Login - OK
module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
			if (result == null){
				// return {ERROR: "Cannot login. Non-existent account."};
				return false;
			} else {
				// compareSynct is a bcrypt function that compares an unhashed password to a hashed password
				const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

				if(isPasswordCorrect){

					return {access: auth.createAccessToken(result)};

				} else { //if passwords do not match
					// return {ERROR: "Incorrect password."};
					return false;
				}
			}
	});
};

// Setting an account to admin (admin only) - OK
module.exports.setAsAdmin = (userId, req) => {

	let loggedInUser = auth.decode(req.headers.authorization);


	return User.findById(userId).then(user => {
		if(user === null){ // Checking if user does not exist

			return {ERROR: "User does not exist."};

		} else if (loggedInUser.email === user.email){ // Checking if the user (with admin permissions) is setting himself as admin

			return {ERROR: "You are already an admin."};

		} else if (user.isAdmin === true){ // Checking if the user (with admin permissions) is setting another user (who already has admin permissions) as an admin

			return {ERROR: "The account already has admin permissions."};

		} else{
			user.isAdmin = true;
			return user.save().then((updatedUser, error) => {
				if(error){
					return {ERROR: "An unexpected error has occurred."};
				} else {
					return {message : "Congrats! You now have admin permissions."};
				}
			})
		}
	});
};

// Get all users' details (admin only) - OK
module.exports.getAllUserProfiles = () => {
	return User.find().then(result => {
		return result;
	});
};

// Get a user's details - OK
module.exports.getUserProfile = (userId) => {

	return User.findById(userId).then(result => {

		if (result == null){
			return false;
		} else {
			result.password = "******";
			return result;
		}
	});
};

module.exports.getMyOrders = (userId) => {
	return Order.find({userId: userId}).then(order => {
		if(order === null){
			return false;
		} else {

			return order;
		}
	})
};	

module.exports.getProfile = (userId) => {

	return User.findById(userId).then(result => {

		if (result == null){
			return false;
		} else {
			result.password = "******";
			return result;
		}
	});
};



