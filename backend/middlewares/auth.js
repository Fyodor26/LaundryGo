const { get } = require("../routes/users");
const { getuserId } = require("../service/auth");

async function authentication(req, res, next) {    
  const token = req.cookies.cookie;
  if (!token){
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const user = await getuserId(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Auth failed" });
  }
}

module.exports={authentication}