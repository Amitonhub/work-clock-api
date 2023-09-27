const corsOptions = {
    origin: process.env.HOST_URL,
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOptions