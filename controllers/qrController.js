const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")

//desc not defined yet (may be remove in future)
//route POST punch
//access public

const generateQr = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    const accessToken = cookie['accessToken']
    let token;
        let authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];}
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { id } = decoded.user;
    const user = await User.findById(id);

    if (!user) {
        res.status(401);
        throw new Error("Email or password is not valid");
    }

    // Verify IP address
    const clientIp = req.ip; 
    if (user.ipAddress !== clientIp) {
        res.status(401);
        throw new Error("IP address does not match");
    }

    const currentTime = new Date();
    const startOfValidity = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 9, 0, 0);
    const endOfValidity = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 19, 0, 0);

    if (currentTime < startOfValidity || currentTime > endOfValidity) {
        res.status(423);
        throw new Error("Access token is not valid at the current time.");
    }

    const qrToken = jwt.sign(
        {
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
                ip: user.ipAddress
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h" }
    );

    res.cookie("qrToken", qrToken, {
        httpOnly: true,
        maxAge: 64800000
    });
    
    res.status(200).json("QR token has been generated successfully.");
});

module.exports = { generateQr };

