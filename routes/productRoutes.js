const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const productController = require("../controllers/productController.js");

// Create product (Admin Only)
router.post("/add", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send(false);
	} else {
		productController.addProduct(req.body).then(resultFromController => res.send(resultFromController))
	}
})

// Get all products
router.get("/all", (req, res) => {
	productController.getAllProducts().then(resultFromController => res.send(resultFromController));
})

// Get all active products
router.get("/active", (req, res) => {
	productController.getAllActiveProducts().then(resultFromController => res.send(resultFromController));
})

// Get a specific product
router.get("/:productId", (req, res) => {
	productController.getProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
})

// Update a product information (Admin Only)
router.put("/:productId", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send(false);
	} else {
		productController.updateProduct(req.params.productId, req.body).then(resultFromController => res.send(resultFromController))
	}
})

// Archive a product (Admin Only)
router.patch("/:productId/archive", auth.verify, (req, res) => { 
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send(false);
	} else {
		productController.archiveProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
	}
})



module.exports = router;