const express = require('express')
const router = express.Router()
const { createNotification, getAllNotifications, updateStarredStatus } = require("../controllers/NotificationController")
const validateToken = require("../middleware/validateTokenHandler")

router.post('/create', validateToken, createNotification)
router.get('/getall', validateToken, getAllNotifications)
router.put('/updateStarredStatus', validateToken, updateStarredStatus);

module.exports = router