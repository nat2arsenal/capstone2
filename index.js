const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const userRoutes = require("./routes/userRoutes.js");
const productRoutes = require("./routes/productRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

// Connecting to our MongoDB Database
mongoose.connect("mongodb+srv://admin:admin@capstone2.pxghdjx.mongodb.net/capstone2?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
//Prompting a message once connected
mongoose.connection.once('open', () => console.log('Now connected to Arsenal-Mongo DB Atlas.'));

// Creating an express server/application
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Initializing routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.listen(process.env.PORT || 5000, () => {console.log(`API is now online on port ${process.env.PORT || 5000}`)
});

