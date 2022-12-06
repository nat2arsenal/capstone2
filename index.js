const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

mongoose.connect("mongodb+srv://admin:admin@capstone2.pxghdjx.mongodb.net/capstone2?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
