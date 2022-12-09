const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const productController = require("../controllers/productController.js");
const Product = require("../models/product.js");

// Create product (Admin Only)
router.post("/add", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to add new product, please seek admin assistance."});
	} else {
		// Product.findOne({productName: req.body.productName, description: req.body.description}).then((result, req) => {
		// 	if (result !== null){
		// 		res.send({message: "Product is already existing, please update the product's stock instead."});
		// 	} else {
		// 		productController.addNewProduct(req.body).then(resultFromController => res.send(resultFromController))
		// 	}
		// })
		productController.addNewProduct(req.body).then(resultFromController => res.send(resultFromController))
	}
});

// Get all products
router.get("/all", (req, res) => {
	productController.getAllProducts().then(resultFromController => res.send(resultFromController));
});

// Get all active products
router.get("/active", (req, res) => {
	productController.getAllActiveProducts().then(resultFromController => res.send(resultFromController));
});

// Get a specific product
router.get("/:productId", (req, res) => {
	productController.getProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
});

// Update a product's information (Admin Only)
router.patch("/:productId/info", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to update the product's information, please seek admin assistance."});
	} else {
		productController.updateProductNameAndDescription(req.params.productId, req.body).then(resultFromController => res.send(resultFromController))
	}
});

// // Update a product's price (Admin Only)
// router.patch("/:productId/price", auth.verify, (req, res) => {
// 	if(auth.decode(req.headers.authorization).isAdmin === false) {
// 		res.send({message: "Failed to update the product's price, please seek admin assistance."});
// 	} else {
// 		productController.updateProductPrice(req.params.productId, req.body).then(resultFromController => res.send(resultFromController))
// 	}
// });

// Archive a product (Admin Only)
router.patch("/:productId/archive", auth.verify, (req, res) => { 
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to archive product, please seek admin assistance."});
	} else {
		productController.archiveProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
	}
});

// Activating a product (Admin Only)
router.patch("/:productId/activate", auth.verify, (req, res) => { //need for middleware
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to update product's active status, please seek admin assistance."});
	} else {
		productController.activateProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
	}
});

// UPDATE PRODUCT STOCKS (AUTOMATIC WITH REGARDS TO ORDERS)

module.exports = router;