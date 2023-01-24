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
			// return {message: "ERROR: Failed to add new product."};
			return false;
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
		if (!result){
			// return {ERROR: "Product is not existing."};
			return false;
		} else {
			return result;
		}
	});
};

// Updating a product's information (name, description, price) - OK
module.exports.updateProduct = (productId, reqBody) => {
	let updatedProduct = {
		productName : reqBody.productName,
		description : reqBody.description,
		price : reqBody.price,
		stocks: reqBody.stocks
	};

	return Product.findByIdAndUpdate(productId, updatedProduct).then((product, error) => {
		if (error) {
			// return {message: "ERROR: Could not update product's information."};
			return false;
		} else {
			return product;
		}
	});
};

// Adding more stocks a product's stocks - OK
module.exports.addProductStocks = async(productId, newStocks) => {

	const currentProduct = await Product.findById(productId).then((product, error) => {
		if (error) {
			return {message: "ERROR: Could not find product."};
		} else {
			return product;
		}
	});

	currentProduct.stocks = currentProduct.stocks + newStocks;
	return currentProduct.save();
};

// Subtracting stocks to a product's stocks 
module.exports.subtractProductStocks = async(productId, removedStocks) => {

	const currentProduct = await Product.findById(productId).then((product, error) => {
		if (error) {
			return {message: "ERROR: Could not find product."};
		} else {
			return product;
		}
	});

	currentProduct.stocks = currentProduct.stocks - removedStocks;
	if (currentProduct.stocks === 0){
		autoArchiveProduct(productId);
	} 

	return currentProduct.save();
};

// ARCHIVING a product - OK
module.exports.archiveProduct = (productId) => {
	let updateActiveField = {
		isActive : false
	};

	return Product.findByIdAndUpdate(productId, updateActiveField).then((product, error) => {
		if (error) {
			return false;
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
			return false;
		} else {
			return product;
		}
	});
};

// VALIDATE IF A PRODUCT EXISTS - not used
module.exports.validateProduct = (productId) => {
	return Product.findById(productId).then(result => {
		if (!result) {
			return false;
		} else {
			return true;
		}
	})
};


const autoArchiveProduct = async (productId) => {
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

