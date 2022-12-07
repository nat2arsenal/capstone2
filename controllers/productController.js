const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");

module.exports.addProduct = (reqBody) => {
	let newProduct = new Product({
		productName : reqBody.productName,
		description : reqBody.description,
		price : reqBody.price
	});

	return newProduct.save().then((product, error) => {
		if (error) {
			return false;
		} else {
			return true;
		}
	})
}

module.exports.getAllProducts = () => {
	return Product.find().then(result => {
		return result;
	})
}

module.exports.getAllActiveProducts = () => {
	return Product.find({isActive : true}).then(result => {
		return result;
	})
}

module.exports.getProduct = (productId) => {
	return Product.findById(productId).then(result => {
		return result;
	})
}

module.exports.updateProduct = (productId, reqBody) => {
	let updatedProduct = {
		productName : reqBody.productName,
		description	: reqBody.description,
		price : reqBody.price
	}

	return Product.findByIdAndUpdate(productId, updatedProduct).then((product, error) => {
		if (error) {
			return false;
		} else {
			return updatedProduct;
		}
	})
}

module.exports.archiveProduct = (productId) => {
	let updateActiveField = {
		isActive : false
	}

	return Product.findByIdAndUpdate(productId, updateActiveField).then((product, error) => {
		if (error) {
			return false;
		} else {
			return product;
		}
	})
}

