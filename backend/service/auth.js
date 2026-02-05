const jwt = require("jsonwebtoken");

const secret = "Bitch";
function setuserId(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    secret,
    { expiresIn: "7d" }
  );
}

function getuserId(token) {
  if (!token) return null;
  const x=jwt.verify(token, secret);
  return x
}

module.exports = { setuserId, getuserId };
