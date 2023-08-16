const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const distanceLimit = require("../helpers/distanceLimit")     // don't delete strictly

//desc Register a user
//route POST users/register
//access public

const registerUser = asyncHandler(async (req, res) => {
    console.log("The Request body is:", req.body)
    const { username, firstname, lastname, physicaladdress, city, state, zip, roleId, mobilenumber, email, designation, password } = req.body
    if (!username || !email || !password || !firstname || !lastname || !physicaladdress || !city || !state || !zip || !mobilenumber || !roleId || !designation) {
        res.status(400)
        throw new Error("All Fields are mandatory")
    }
    const userAvailable = await User.findOne({ email })
    if (userAvailable) {
        res.status(400)
        throw new Error("User Already Registered.")
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword)

    const user = await User.create({
        username,
        firstname,
        lastname,
        physicaladdress,
        city,
        state,
        zip,
        roleId,
        mobilenumber,
        email,
        designation,
        password: hashedPassword
    })
    console.log("User Created Successfully", user)
    if (user) {
        res.status(200).json({ _id: user.id, email: user.email })
    } else {
        res.status(400)
        throw new Error("User Data is not valid")
    }
    res.json(user)
})

//desc Login user
//route POST users/login
//access publicss

const loginUser = asyncHandler(async (req, res) => {
    const { email, password, latitude, longitude } = req.body;
    if (!email || !password || !latitude || !longitude) {
        res.status(400);
        throw new Error("All fields are mandatory!");
    }

    const targetLatitude = 21.183556;
    const targetLongitude = 72.782972;
    const distanceThreshold = 30;

    // uncomment if part for the coordinates Validation
    // const distance = distanceLimit(latitude, longitude, targetLatitude, targetLongitude);
    // if (distance <= distanceThreshold) {
    const findUser = await User.findOne({ email });

    // Compare password with hashed password
    if (findUser && (await bcrypt.compare(password, findUser.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: findUser.username,
                    email: findUser.email,
                    id: findUser.id,
                    ip: req.ip,
                },
            },
            process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '400d'
        });

        await User.findOneAndUpdate(
            { _id: findUser._id },
            { ipAddress: req.ip },
            { new: true }
        );
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            expires: new Date('9999-12-31'),
            sameSite: 'none',
            secure: true
        });
        res.status(200).json("Access token has been generated successfully.");
    } else {
        res.status(401);
        throw new Error("Email or password is not valid");
    }
    // } else {
    //     res.status(401);
    //     throw new Error("You are not within the allowed distance to login.");
    // }
});

//desc Current User Info
//route GET users/current
//access private

const currentUser = asyncHandler(async (req, res) => {

    const cookie = req.cookies;
    const accessToken = cookie['accessToken']
    let token;
        let authHeader = req.headers.authorization || req.headers.Authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];}
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const { id } = decoded.user;
    const user = await User.findById(id);

    if (user) {
        res.status(200).json({
            id: user._id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            physicaladdress: user.physicaladdress,
            state: user.state,
            city: user.city,
            zip: user.zip,
            RoleId: user.roleId,
            mobilenumber: user.mobilenumber,
            designation: user.designation,
            ipAddress: user.ipAddress,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

//desc To check accessToken in cookies 
//route GET users/auth
//access public

const authUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    const accessToken = cookie['accessToken']
    if (accessToken) {
        res.status(200).send(accessToken)
    } else {
        res.status(200).json(null)
    }
});

module.exports = { registerUser, loginUser, currentUser, authUser }