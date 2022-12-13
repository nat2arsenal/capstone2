const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const orderController = require("../controllers/orderController.js");

// Get all orders (Admin only)
router.get("/", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === false) {
		res.send({message: "Only Admins can access this feature"});
	} else {
		orderController.getAllOrders().then(resultFromController => res.send(resultFromController));
	}
});

// Get all pending orders (Admin only)
router.get("/pending", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === false) {
		res.send({message: "Only Admins can access this feature"});
	} else {
		orderController.getAllPendingOrders().then(resultFromController => res.send(resultFromController));
	}
});

// Approve order (ADMIN ONLY)
router.patch("/approve/:orderId", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === false) {
		res.send({message: "Only Admins can access this feature"});
	} else {
		orderController.approveOrders(req.params.orderId).then(resultFromController => res.send(resultFromController));
	}
});

// dispprove order (ADMIN ONLY)
router.patch("/disapprove/:orderId", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === false) {
		res.send({message: "Only Admins can access this feature"});
	} else {
		orderController.disapproveOrders(req.params.orderId).then(resultFromController => res.send(resultFromController));
	}
});

// Get all APPROVED orders (Admin only)
router.get("/approved", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === false) {
		res.send({message: "Only Admins can access this feature"});
	} else {
		orderController.getAllApprovedOrders().then(resultFromController => res.send(resultFromController));
	}
});

// Get all DISAPPROVED orders (Admin only)
router.get("/disapproved", auth.verify, (req, res) => {
	const userData = auth.decode(req.headers.authorization);

	if(userData.isAdmin === false) {
		res.send({message: "Only Admins can access this feature"});
	} else {
		orderController.getAllDisapprovedOrders().then(resultFromController => res.send(resultFromController));
	}
});

module.exports = router;