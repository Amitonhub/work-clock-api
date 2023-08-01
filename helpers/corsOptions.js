const corsOptions ={
    origin:process.env.VERCEL_URL, 
    credentials:true,           
    optionSuccessStatus:200
}

module.exports = corsOptions