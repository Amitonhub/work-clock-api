const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "please add user_id"],
  },
  message: {
    type: String,
    required: [true, "please add message"],
  },
  starred: {
    type: Boolean,
    required: [true, "please add starred value"],
  }
})

module.exports = mongoose.model('Notification', notificationSchema)
