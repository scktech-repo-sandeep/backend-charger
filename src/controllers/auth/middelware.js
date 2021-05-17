const jwt = require("../auth/authentication");
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[2];
    if (token == null) {
      res.status(400).json({ message: "Missing Token" });
    } else {
      const decodedToken = jwt.verifyToken(token);
      if (decodedToken == "jwt expired") {
        res.status(400).json({ error: "Session Expired" });
      } else if (decodedToken == "" || decodedToken == undefined) {
        res.status(401).json({ error: "unauthorized" });
      } else {
        next();
      }
    }
  } catch {
    res.status(401).json({ error: "Invalid" });
  }
};
