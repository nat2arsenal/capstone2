const express = require("express");
const router = express.Router();
const auth = require("../auth.js");
const userController = require("../controllers/userController.js");

router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
})

router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send(resultFromController));
})

router.patch("/:userId/setAsAdmin", auth.verify, (req, res) => {
	if(auth.decode(req.headers.authorization).isAdmin === false) {
		res.send(false);
	} else {
		userController.setAsAdmin(req.params.userId).then(resultFromController => res.send(resultFromController));
	}
})

router.get("/details/:userId", (req, res) => {
	userController.getProfile(req.params.userId).then(resultFromController => res.send(resultFromController))
})

module.exports = router;