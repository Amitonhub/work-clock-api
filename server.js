const express = require("express");
const dotenv = require("dotenv").config()
const connectDb = require("./config/dbConnection");
const app = express()
const cors = require("cors")
const cookieParser = require('cookie-parser');
const port = process.env.PORT || 5000;
const corsOptions = require("./helpers/corsOptions")

connectDb()

app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/attendance", require("./routes/attendanceRoutes"))

app.get('/', (req, res) => {
    res.send('API is Working properly!');
  });

app.listen(port, () => {
    console.log('Server is running on port: ', port);
});