const jwt = require("jsonwebtoken");

const secret = "charger@s123";
function generateToken() {
  try {
    let token = jwt.sign({ id: "chargerUser" }, secret, {
      expiresIn: 86400, // expires in 24 hours
    });
    return token;
  } catch (error) {
    console.log(error);
  }
}

function verifyToken(token) {
  try {
    let isToken = jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return err.message;
      } else {
        return decoded;
      }
    });
    return isToken;
  } catch (error) {
    console.log(error);
  }
}

exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
