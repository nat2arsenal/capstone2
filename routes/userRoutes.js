const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const userController = require("../controllers/userController.js");

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
router.get("/details/:userId", (req, res) => {
		userController.getUserProfile(req.params.userId).then(resultFromController => res.send(resultFromController));	
});

// Add to cart products - under construction

module.exports = router;