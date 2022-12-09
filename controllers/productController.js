const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");

// Add new product - ADD FEATURE TO DISALLOW ADDING WHEN PRODUCT NAME AND DESCRIPTION IS ALREADY EXISTING
module.exports.addNewProduct = (reqBody) => {
	let newProduct = new Product({
		productName : reqBody.productName,
		description : reqBody.description,
		price : reqBody.price,
		stocks: reqBody.stocks
	});

	// Product.find({productName: newProduct.productName});

		return newProduct.save().then((product, error) => {
			if (error) {
				return {message: "ERROR: Failed to add new product."};
			} else {
				return product;
			}
		})
};

// Get all products' information - OK
module.exports.getAllProducts = () => {
	return Product.find().then(result => {
		return result;
	});
};

// Get all active products' information - OK
module.exports.getAllActiveProducts = () => {
	return Product.find({isActive : true}).then(result => {
		return result;
	});
};

// Get a specific product's information - OK
module.exports.getProduct = (productId) => {
	return Product.findById(productId).then(result => {
		return result;
	});
};

// UPDATING A PRODUCT'S NAME AND DESCRIPTION
module.exports.updateProductNameAndDescription = (productId, reqBody) => {
	let updatedProduct = {
		productName : reqBody.productName,
		description : reqBody.description,
		price : reqBody.price
	};

	return Product.findByIdAndUpdate(productId, updatedProduct).then((product, error) => {
		if (error) {
			return {message: "ERROR: Could not update product's information."};
		} else {
			return product;
		}
	});
};

// // UPDATING A PRODUCT'S PRICE - OK
// module.exports.updateProductPrice = (productId, reqBody) => {
// 	let updatedProduct = {
// 		price : reqBody.price
// 	};

// 	return Product.findByIdAndUpdate(productId, updatedProduct).then((product, error) => {
// 		if (error) {
// 			return {message: "ERROR: Could not update product's price."};
// 		} else {
// 			return product;
// 		}
// 	});
// };

// ARCHIVING a product - OK
module.exports.archiveProduct = (productId) => {
	let updateActiveField = {
		isActive : false
	};

	return Product.findByIdAndUpdate(productId, updateActiveField).then((product, error) => {
		if (error) {
			return {message: "ERROR: Could not archive product."};
		} else {
			return product;
		}
	});
};

// ACTIVATING a product
module.exports.activateProduct = (productId) => {
	let updateActiveField = {
		isActive : true
	};

	return Product.findByIdAndUpdate(productId, updateActiveField).then((product, error) => {
		if (error) {
			return {message: "ERROR: Could not activate product."};
		} else {
			return product;
		}
	});
};

// UPDATE PRODUCT STOCKS (AUTOMATIC WITH REGARDS TO ORDERS)