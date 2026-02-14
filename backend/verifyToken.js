const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    // BYPASS AUTHENTICATION
    req.user = { id: "bypass_user", role: "admin" }; 
    next();
};

module.exports = verifyToken;
