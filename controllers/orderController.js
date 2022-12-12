const User = require("../models/user.js");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const OrderProduct = require("../models/order-products.js");

const auth = require("../auth.js"); 
const bcrypt = require("bcrypt");

/*
module.exports.checkout = async(userId, reqBody) => {

	return User.findById(userId).then(user => {
		if(user === null){
			return {ERROR: "User is not registered."}
		} else {
			
			const orderProductsIds = Promise.all(reqBody.orderProducts.map(async(orderProduct) => {

				let newOrderProduct = new OrderProduct({
					quantity: orderProduct.quantity,
					product: orderProduct.product
				})

				newOrderProduct = await newOrderProduct.save();

				return newOrderProduct._id;
			}))

			const orderProductsIdsFulfilled = await orderProductsIds;
			console.log(orderProductsIdsFulfilled);
			const totalPrices = Promise.all(orderProductsIdsFulfilled.map(async (orderProductId) => {
				const orderProduct = await OrderProduct.findById(orderProductId).populate("product", "price");
				const totalPrice = orderProduct.product.price * orderProduct.quantity;
				return totalPrice;
			}))

			const totalPrice = totalPrices.reduce((a,b) => a + b , 0);

			let order = new Order({
			    orderProducts: orderProductsIdsFulfilled,
			    shippingAddress: reqBody.shippingAddress,
			    city: reqBody.city,
			    zip: reqBody.zip,
			    country: reqBody.country,
			    mobileNumber: reqBody.mobileNumber,
			    status: reqBody.status,
			    totalAmount: totalPrice,
			    user: user.email
			})

			order = await order.save();

			if(!order){
				return ({ERROR: "Order not created."})
			} else {
				return (order);
			}

		}
	})
};
*/