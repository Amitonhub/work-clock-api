const express = require("express")
const router = express.Router()
const { registerUser, loginUser, currentUser, authUser, logoutUser } = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/current",validateToken, currentUser)
router.get("/auth", authUser)
router.get("/logout",validateToken, logoutUser)

module.exports = router