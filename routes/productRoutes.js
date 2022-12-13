const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const productController = require("../controllers/productController.js");
const Product = require("../models/product.js");

// Create product (Admin Only) - OK
router.post("/add", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to add new product, please seek admin assistance."});
	} else {
		const reqBody = req.body;
		Product.findOne({$and: [{productName: reqBody.productName}, {description: reqBody.description}]}).then((result) => {
			if (result !== null){ // Check if there's already a product that has the same name and description
				/* 
					// Automatic addition to stocks if productName and description is already existing, working but not used

					result.stocks = result.stocks + reqBody.stocks;
					result.save();
					res.send(result);
				*/
				res.send({message: "Product is already existing, please update the product's stock instead."});
			} else {
				productController.addNewProduct(reqBody).then(resultFromController => res.send(resultFromController))
			}
		})
	}
});

// Get all products - OK
router.get("/all", (req, res) => {
	productController.getAllProducts().then(resultFromController => res.send(resultFromController));
});

// Get all active products - OK
router.get("/active", (req, res) => {
	productController.getAllActiveProducts().then(resultFromController => res.send(resultFromController));
});

// Get a specific product - OK
router.get("/:productId", (req, res) => {
	console.log(req.params.productId);
	productController.getProduct(req.params.productId).then(resultFromController => res.send(resultFromController))
});

// Update a product's information (Admin Only) - OK
router.patch("/:productId/info", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to update the product's information, please seek admin assistance."});
	} else {
		productController.updateProduct(req.params.productId, req.body).then(resultFromController => res.send(resultFromController))
	}
});

// Add more stocks a product's stocks (Admin Only) - OK
router.patch("/:productId/info/stocks", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to update the product's information, please seek admin assistance."});
	} else {
		productController.addProductStocks(req.params.productId, req.body.stocks).then(resultFromController => res.send(resultFromController))
	}
});

// Subtracting stocks to a product's stocks (Admin Only) - OK
router.patch("/:productId/info/stocks/subtract", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send({message: "Failed to update the product's information, please seek admin assistance."});
	} else {
		productController.subtractProductStocks(req.params.productId, req.body.stocks).then(resultFromController => res.send(resultFromController))
	}
});

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
/*
	// UPDATE PRODUCT STOCKS (AUTOMATIC WITH REGARDS TO ORDERS)

	TO BE CONTINUED

*/
module.exports = router;