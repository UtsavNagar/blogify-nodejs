const JWT = require("jsonwebtoken");
const { secreteKeyForJWT } = require("../credentials");

function createTokenForUser(user) {
    const payload = {
        fullName : user.fullName,
        _id: user._id,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    }

    const token = JWT.sign(payload,secreteKeyForJWT);

    return token; 
}

function validateToken (token){
    const payload = JWT.verify(token,secreteKeyForJWT);

    return payload; 
}

module.exports = {
    createTokenForUser,
    validateToken
}