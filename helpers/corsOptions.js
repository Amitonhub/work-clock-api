const corsOptions ={
    origin:process.env.VERCEL_URL,          // uncomment for Live URL
    // origin:process.env.HOST_URL,            // uncomment for Local URL
    credentials:true,           
    optionSuccessStatus:200
}

module.exports = corsOptions