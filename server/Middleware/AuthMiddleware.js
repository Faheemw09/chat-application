const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token.split(" ")[1], "masai");
      console.log("Decoded token:", decoded);
      if (decoded) {
        req.userId = decoded.authorID;
        req.userRole = decoded.role;

        console.log(req.userId, "usrr");
        console.log(req.role, "userolrr");
        next();
      } else {
        res.send({ msg: "please login ist" });
      }
    } catch (error) {
      res.status(400).send({ msg: error.message });
    }
  } else {
    res.send({ msg: "please login ist" });
  }
};
module.exports = {
  auth,
};
