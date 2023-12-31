const express = require("express")
const router = express.Router()
const { attendance, getAttendanceByDate, getAllAttendanceById, getAttendanceOfPeriod } = require("../controllers/attendanceController")
const validateToken = require("../middleware/validateTokenHandler")
const {generateQr} = require('../controllers/qrController')

router.post("/",validateToken, attendance)
router.get("/:user_id/:date", validateToken, getAttendanceByDate)
router.get("/period-attendance", validateToken, getAttendanceOfPeriod)
router.get("/:user_id", validateToken, getAllAttendanceById)
router.post("/qr", validateToken, generateQr);  

module.exports = router