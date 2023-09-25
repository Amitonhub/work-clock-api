const asyncHandler = require("express-async-handler")
const Notification = require('../models/NotificationModel')
const jwt = require("jsonwebtoken")


const createNotification = asyncHandler(async (req, res) => {
  const { message, user_id,starred } = req.body
  try {
    const notification = new Notification({
      user_id,
      message,
      starred,
    })
    await notification.save()
    res.status(201).json({ success: true, notification })
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' })
  }
})

const getAllNotifications = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const notifications = await Notification.find({ id });
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ error: 'Notifications not found' });
    }
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(500).json({ error: 'Server Error' });
  }
});

const updateStarredStatus = asyncHandler(async (req, res) => {
  const { starred, notification_id, user_id } = req.body;

  try {
    const notification = await Notification.findOne({ user_id: user_id, _id: notification_id });
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    notification.starred = starred;
    await notification.save();
    
    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

module.exports = { createNotification, getAllNotifications, updateStarredStatus }