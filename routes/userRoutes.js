const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const userController = require("../controllers/userController.js");
const orderController = require("../controllers/orderController.js");
const productController = require("../controllers/productController.js");
const Product = require("../models/product.js");

// User Registration - OK
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

// User Login - OK
router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
});

// Set an account as admin (admin only)
router.patch("/:userId/setAsAdmin", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "You can't access this feature, please seek admin assistance."});
	} else {
		userController.setAsAdmin(req.params.userId, req).then(resultFromController => res.send(resultFromController));
	}
});

// Get all users' details (admin only) - OK
router.get("/details", (req, res) => {
	let user = auth.decode(req.headers.authorization);
	if(user.isAdmin === false) {
		res.send({message: "Failed to retrieve users' information, please seek admin assistance."});
	} else {
		userController.getAllUserProfiles().then(resultFromController => res.send(resultFromController));
	}
});

// Get a specific user's details - OK
router.get("/:userId/details", (req, res) => {
		userController.getUserProfile(req.params.userId).then(resultFromController => res.send(resultFromController));	
});
/*
	// Add to cart products - under improvements

	router.post("/:userId/cart", (req, res) => {
		if(auth.decode(req.headers.authorization).isAdmin === true) { // Admins can't add to cart
			res.send({message: "Admins can't add to cart."});
		} else {
			const userId = auth.decode(req.headers.authorization).id;
			userController.addToCart(userId, req.body).then(resultFromController => res.send(resultFromController));
		}
	});
*/

// ORDERS SECTION

router.post("/:userId/checkout", auth.verify, async (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === true) {
		res.send({message: "Sorry, Admins can't access this feature."});
	} else {
		const userId = auth.decode(req.headers.authorization).id;
		if(req.params.userId === userId){ //Check if bearer token is the same as params.id     // OK		
			let isValid = await validateOrder(req.body, res);
		/*   
			// ALTERNATE SOLUTION

			const verifyProduct = Promise.all(req.body.orderProducts.map(async (orderProduct) =>{
				let isExisting = await isProductExisting(orderProduct.productId);

				if (isExisting === false){ 
					res.send({ERROR: `Order error, productId ${orderProduct.productId} is not found.`}); // OK up to this point 
					return false;
				} else {
					let isActive = await isProductActive(orderProduct.productId);
					if (isActive === false) {
						res.send({ERROR: `Order error, productId ${orderProduct.productId} is currently not active.`});
						return false;
					} else {
						let isEnough = await isProductEnough(orderProduct.productId, orderProduct.quantity);
						const product = await Product.findById(orderProduct.productId);
						let productStocks = product.stocks;

						if (isEnough === false){			
							res.send({ERROR: `Order error, not enough stocks for productId ${orderProduct.productId}. Please order a quantity of ${productStocks} or less. Thank you.`});
							return false;
						} else {
							return true;
						}
					}
				}
			})).catch(err => console.log( err ))

			let isValid = await verifyProduct;
		*/
			if (isValid === true) {
				orderController.checkout(userId, req.body).then(resultFromController => res.send(resultFromController));
			} else {
				return false;
			}

		} else {
			res.send({ERROR: "You can't checkout using someone else's account."}); 
		}
	};
});



router.get("/:userId/myOrders", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization) === true) {
		res.send({message: "Sorry, Admins can't access this feature."});
	} else {
		const userId = auth.decode(req.headers.authorization).id;
		if(req.params.userId === userId){
			userController.getMyOrders(userId).then(resultFromController => res.send(resultFromController));
		} else {
			res.send({ERROR: "You can't view someone else's orders."}); 
		}
	}
});

// CALLABLE FUNCTIONS

// Function to identify if product is existing - OK
const isProductExisting = async (productId) => {
	const product = await Product.findById(productId);
	if (product !== null) {
		return true;
	} else {
		console.log("Product is not existing");
		return false;
	}
};

// Function to identify if product is active - OK
const isProductActive = async (productId) => {
	const product = await Product.findById(productId);
	if (product.isActive === true){
		return true;
	} else {
		console.log("Product is not active.");
		return false;
	}
};

// Function to identify if product has enough stocks - OK
const isProductEnough = async (productId, quantity) => {
	const product = await Product.findById(productId);
		if (quantity <= product.stocks){
				return true;	
		} else {
			console.log("Product does not have enough stocks.");
			return false;
		}
};

// Function to validate order - OK but need to be revised as the code is currently 5 deep which is not good practice
const validateOrder = async (reqBody, res) => {

	let isValid = false; // Initialize return value for validateOrder function

	for(let i=0; i< reqBody.orderProducts.length; i++) {
		if (reqBody.orderProducts[i].quantity >0 ){
			let isExisting = await isProductExisting(reqBody.orderProducts[i].productId);
			if (isExisting === false){ 
				res.send({ERROR: `Order error, productId ${reqBody.orderProducts[i].productId} is not found.`}); // OK up to this point 
				isValid = false;
				break;
			} else {
				let isActive = await isProductActive(reqBody.orderProducts[i].productId);
				if (isActive === false) {
					res.send({ERROR: `Order error, productId ${reqBody.orderProducts[i].productId} is currently not active.`});
					isValid = false;
					break;
				} else {
					let isEnough = await isProductEnough(reqBody.orderProducts[i].productId, reqBody.orderProducts[i].quantity);
					const product = await Product.findById(reqBody.orderProducts[i].productId);
					let productStocks = product.stocks;

					if (isEnough === false){			
						res.send({ERROR: `Order error, not enough stocks for productId ${reqBody.orderProducts[i].productId}. Please order a quantity of ${productStocks} or less. Thank you.`});
						isValid = false;
						break;
					} else {
						isValid = true;
					}
				}
			}
		} else {
			res.send({ERROR: `Order for productId ${reqBody.orderProducts[i].productId} should contain at least 1 quantity.`});
			isValid = false;
			break;
		}
	};
	return isValid;
};

module.exports = router;

