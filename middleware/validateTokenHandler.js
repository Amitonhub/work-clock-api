const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1]
        const cookie = req.cookies;
    const accessToken = req.cookies["accessToken"]
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401)
                throw new Error("User is not Authorized")
            }
            req.user = decoded.user
            next()
        })

        if (!token) {
            res.status(401)
            throw new Error("User is not Authorized")
        }
    }
})

module.exports = validateToken