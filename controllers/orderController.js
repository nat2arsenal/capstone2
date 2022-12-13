const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const OrderProduct = require("../models/order-products.js");
const productController = require("../controllers/productController.js");

const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");

// ORDER Checkout
module.exports.checkout = async(userId, reqBody) => {
	const orderProductsIds = Promise.all(reqBody.orderProducts.map(async (orderProduct) =>{

		// ADD CODE TO VALIDATE ORDER-PRODUCT (IF PRODUCT IS EXISTING, IF ACTIVE, IF THERE'S ENOUGH STOCKS) - not achieved
		// ADD CODE TO CONNECT WHICH ORDER THE ORDER-PRODUCT BELONGS TO (BY USING ORDER ID) - not achieved
		const productPrice = await Product.findById(orderProduct.productId).populate('price');
		const subtotal = productPrice.price * orderProduct.quantity;
		// console.log(subtotal); 

	    let newOrderProduct = new OrderProduct({
	        productId: orderProduct.productId,
	        quantity: orderProduct.quantity,
	        price: productPrice.price,
	        subtotal: subtotal
	    })

	    newOrderProduct = await newOrderProduct.save();

	    return newOrderProduct._id;
	}))
	const orderProductsIdsResolved =  await orderProductsIds;

	const totalPrices = await Promise.all(orderProductsIdsResolved.map(async (orderProductId)=>{
	    const orderProduct = await OrderProduct.findById(orderProductId).populate('productId', 'price');
	    const totalPrice = orderProduct.productId.price * orderProduct.quantity;
	    return totalPrice
	}))

	const totalPrice = totalPrices.reduce((a,b) => a + b , 0);
	//console.log(totalPrice);

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

	//console.log(newOrder._id);

	return newOrder.save().then((order, error) => {
		if (error) {
			return {message: "ERROR: Failed to add new order."};
		} else {
			return order;
		}
	})
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

// GET all approved orders
module.exports.getAllApprovedOrders = () => {
	return Order.find({status : "Approved"}).then(result => {
			return result;
		});
};