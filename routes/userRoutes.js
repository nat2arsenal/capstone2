const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const userController = require("../controllers/userController.js");
const orderController = require("../controllers/orderController.js");

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

// Add to cart products - under improvements
/*
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

/*
router.post("/:userId/checkout", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === true) {
		res.send({message: "Sorry, Admins can't access this feature."});
	} else {
		const userId = auth.decode(req.headers.authorization).id;
		orderController.checkout(userId, req.body).then(resultFromController => res.send(resultFromController));
	}
});
*/


router.post("/:userId/checkout", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === true) {
		res.send(false);
	} else {
		const userId = auth.decode(req.headers.authorization).id;
		userController.checkout(userId, req.body).then(resultFromController => res.send(resultFromController));
	}
})
router.get("/:userId/myOrders", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === true) {
		res.send(false);
	} else {
		userController.getMyOrders(userData.id).then(resultFromController => res.send(resultFromController));
	}
})

router.get("/orders", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === false) {
		res.send(false);
	} else {
		userController.getAllOrders().then(resultFromController => res.send(resultFromController));
	}
})

module.exports = router;