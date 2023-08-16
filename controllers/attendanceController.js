const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const Attendance = require('../models/attendanceModel')
const moment = require('moment')

//desc Attendance for the day
//route POST /attendance
//access private

const attendance = asyncHandler(async (req, res) => {
  const { punchType } = req.body;
  // if (!punchType) {
  //   res.status(400);
  //   throw new Error("All fields are mandatory!");
  // }
  const today = new Date();
  const cookie = req.cookies;
  const accessToken = cookie['accessToken']
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1]
  }
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const { id } = decoded.user;

  try {
    let attendance = await Attendance.findOne({ user_id: id, date: { $gte: today } });
    if (!attendance) {
      attendance = new Attendance({ user_id: id, date: moment().utc(today).format(), punches: [] });
    }

    attendance.punches.push({ type: punchType, timestamp: moment().utc(today).format() });
    await attendance.save();

    res.status(201).json({ attendance });
  } catch (error) {
    res.status(500).json(error);
  }
});

//desc get attendance by date of user
//route GET /attendance/:user_id/:date
//access private

const getAllAttendanceById = asyncHandler(async (req, res) => {
  const { user_id } = req.params;

  try {
    const attendance = await Attendance.find({ user_id });

    if (!attendance || attendance.length === 0) {
      return res.status(404).json({ error: 'Attendance data not found' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

//desc get attendance by date of user
//route GET /attendance/:user_id/:date
//access private

const getAttendanceByDate = asyncHandler(async (req, res) => {
  const { user_id, date } = req.params;

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      user_id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance data not found' });
    }

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = { attendance, getAttendanceByDate, getAllAttendanceById }