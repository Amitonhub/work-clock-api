const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, "please add the username"]
        },
        firstname: {
            type: String,
            required: [true, "please add the firstname"]
        },
        lastname: {
            type: String,
            required: [true, "please add the lastname"]
        },
        physicaladdress: {
            type: String,
            required: [true, "please add the physicaladdress"]
        },
        city: {
            type: String,
            required: [true, "please add the city"]
        },
        state: {
            type: String,
            required: [true, "please add the state"]
        },
        zip: {
            type: String,
            required: [true, "please add the zip"]
        },
        roleId: {
            type: Number,
            required: [true, "please add the roleId"]
        },
        mobilenumber: {
            type: String,
            required: [true, "please add the mobile number"]
        },
        email: {
            type: String,
            required: [true, "please add the Contact email"],
            unique: [true, "This email is already registered."]
        },
        password: {
            type: String,
            required: [true, "please add the user password"]
        },
        ipAddress: {
            type: String,
            required: [false]
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)