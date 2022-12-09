const jwt = require("jsonwebtoken");
const secret = "E-CommerceAPI";

// JSON Web Tokens

// Token Creation
module.exports.createAccessToken = (user) => {

	// payload - data we want to include in our token
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	}
									//callback function
	// return jwt.sign(data, secret, {expiresIn : "60s"});

	//Generate a token
	// Generate a JSON web token using the jwt's sign method
	// Generates the token using the form data and the secret code with no additional options provided
	return jwt.sign(data, secret, {});
}

// To verify a token from the request (from postman)
module.exports.verify = (request, response, next) => {

	// Get JWT (JSON Web Token) from postman
	let token = request.headers.authorization

	if(typeof token !== "undefined"){
		// console.log(token);

		// remove unnecessary characters ( "Bearer ") from the token
		token = token.slice(7, token.length);

		return jwt.verify(token, secret, (error, data) => {
			if(error){
				return response.send({
					auth: "Failed."
				})
			} else {
				next()
			}
		})

	// Token does not exist
	} else {
		return null
	}
}

// To decode the user details from the token
module.exports.decode = (token) => {

	if(typeof token !== "undefined"){

		// remove unnecessary characters ( "Bearer ") from the token
		token = token.slice(7, token.length);
	}

	return jwt.verify(token, secret, (error, data) => {
		if(error){
			return null
		} 
		else {
			return jwt.decode(token, {complete: true}).payload
		}
	})
}

// jwt parts
// header(alg,type)   payload     signature   
// abcdxqwertyuiasdlo.qwerujkasdl.poaaweamnan
