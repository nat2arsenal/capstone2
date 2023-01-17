const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const OrderProduct = require("../models/order-products.js");
const productController = require("../controllers/productController.js");

const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");
const ObjectId = require('mongodb').ObjectId;


// Function to create new order-product - OK
const createOrderProduct = async(orderProduct) => {
	const productPrice = await Product.findById(orderProduct.productId);
	const subtotal = productPrice.price * orderProduct.quantity;
	// console.log(subtotal); 

    let newOrderProduct = new OrderProduct({
	    productId: orderProduct.productId,
	    quantity: orderProduct.quantity,
	    price: productPrice.price,
	    subtotal: subtotal
	});

    newOrderProduct = await newOrderProduct.save();

    return newOrderProduct;
};

// ORDER Checkout
module.exports.checkout = async(userId, reqBody) => {
	
	const orderProductsIds = Promise.all(reqBody.orderProducts.map(async (orderProduct) =>{
		// ADD CODE TO CONNECT WHICH ORDER THE ORDER-PRODUCT BELONGS TO (BY USING ORDER ID) - not achieved
		productController.subtractProductStocks(orderProduct.productId, orderProduct.quantity); // Automatic subtraction to product's stocks based on the quantity on the order
		let newOrderProduct = await createOrderProduct(orderProduct);
		return newOrderProduct._id;
	}));

	const orderProductsIdsResolved =  await orderProductsIds;

	const subtotals = await Promise.all(orderProductsIdsResolved.map(async (orderProductId)=>{
	    const orderProduct = await OrderProduct.findById(orderProductId);
	    const totalPrice = orderProduct.price * orderProduct.quantity;
	    return totalPrice;
	}));

	const totalPrice = subtotals.reduce((a,b) => a + b , 0);

	const user = await User.findById(userId);

	let newOrder = new Order({
		userId : userId,
		userFirstName: user.firstName,
		userLastName: user.lastName,
		orderProducts : reqBody.orderProducts, 
		shippingAddress: reqBody.shippingAddress,
		city: reqBody.city,
		zip: reqBody.zip,
		country: reqBody.country,
		mobileNumber: reqBody.mobileNumber,
		totalAmount: totalPrice
	});
	

	return newOrder.save().then((order, error) => {
		if (error) {
			return {message: "ERROR: Failed to add new order."};
		} else {
			return order;
		}
	});

};

// GET all orders
module.exports.getAllOrders = () => {
	return Order.find().then(result => {
			return result;
		});
};

// GET all pending orders
module.exports.getAllPendingOrders = () => {
	return Order.find({status : "Pending"}).then(result => {
			return result;
		});
};


// ORDER Approval by ADMIN
module.exports.approveOrders = (orderId) => {
	let updateStatusField = {
		status : "Approved"
	};


	return Order.findByIdAndUpdate(orderId, updateStatusField).then((order, error) => {
		if (error) {
			return {message: "Order not approved."};
		} else {
			return order;
		}
	});
};

module.exports.disapproveOrders = (orderId) => {
	let updateStatusField = {
		status : "Disapproved"
	};


	return Order.findByIdAndUpdate(orderId, updateStatusField).then((order, error) => {
		if (error) {
			return {message: "Order not approved."};
		} else {
			return order;
		}
	});
};


// GET all approved orders
module.exports.getAllApprovedOrders = () => {
	return Order.find({status : "Approved"}).then(result => {
			return result;
		});
};

// GET all disapproved orders
module.exports.getAllDisapprovedOrders = () => {
	return Order.find({status : "Disapproved"}).then(result => {
			return result;
		});
};

// DELETE all orders
module.exports.deleteOrders = () => {
	return Order.deleteMany().then(result => { return result; });
};

// DELETE all order-products
module.exports.deleteOrderProducts = () => {
	return OrderProduct.deleteMany().then(result => { return result; });
};