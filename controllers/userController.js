const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");

// User Registration - OK
module.exports.registerUser = (reqBody) => {
	return User.findOne({email : reqBody.email}).then(result => {

		// Checking if the email is already registered
		if (result !== null){ // Email already has a registered account
			return {ERROR: "There is already a registered account under the same email, kindly register again using another email. Thank you."}; 
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
					return {ERROR: "User registration failed."}; 
				} else {
					return {message: "Congratulations! You are now registered."}; 
				}
			})
		}
	});
};

// User Login - OK
module.exports.loginUser = (reqBody) => {
	return User.findOne({email: reqBody.email}).then(result => {
			if (result == null){
				return {ERROR: "Cannot login. Non-existent account."};
			} else {
				// compareSynct is a bcrypt function that compares an unhashed password to a hashed password
				const isPasswordCorrect = bcrypt.compareSync(reqBody.password, result.password);

				if(isPasswordCorrect){

					return {access: auth.createAccessToken(result)};

				} else { //if passwords do not match
					return {ERROR: "Incorrect password."};
					// return "Incorrect password"
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
			return {ERROR: "User does not exist."};
		} else {
			result.password = "******";
			return result;
		}
	});
};

// Add to cart products - under improvement
/*
module.exports.addToCart = (userId, product) => {

	return User.findById(userId).then(user => {
		if(user === null){
			return false;
		} else {
			user.myCart.products.push(
				{
					productName: product.productName,
					quantity: product.quantity
				}
			);

			return user.save().then((updatedUserCart, error) => {
				if(error){
					return false;
				} else {
					return updatedUserCart.myCart.products;
				}
			})
		}
	})
};
*/

module.exports.checkout = (userId, cart) => {
	console.log(cart.products[0].productName);

	return User.findById(userId).then(user => {
		if(user === null){
			return false;
		} else {
			user.orders.push(
				{
					products: cart.products,
					totalAmount: cart.totalAmount
				}
			);
			console.log(user.orders);
			return user.save().then((updatedUser, error) => {
				if(error){
					return false;
				} else {
					const currentOrder = updatedUser.orders[updatedUser.orders.length-1];
					
					currentOrder.products.forEach(product => {
						Product.findById(product.productId).then(foundProduct => {
							foundProduct.orders.push({orderId: currentOrder._id})

							foundProduct.save()
						})
					});

					return true;
				}
			})
		}
	})
}

module.exports.getMyOrders = (userId) => {
	return User.findById(userId).then(user => {
		if(user === null){
			return false;
		} else {
			return user.orders;
		}
	})
}

module.exports.getAllOrders = () => {
	return User.find({isAdmin: false}).then(users => {
		let allOrders = [];
		users.forEach(user => {
			allOrders.push({
				email: user.email,
				userId: user._id,
				orders: user.orders
			});
		})
		return allOrders;
	})
}




