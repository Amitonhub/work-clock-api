const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const app = express();
const cors = require("cors");
const cookieParser = require('cookie-parser');
const corsOptions = require("./helpers/corsOptions");
const listEndpoints = require('express-list-endpoints')


// for swagger UI
// const YAML = require('yamljs');
// const path = require('path');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDefinition = YAML.load(path.join(__dirname, './swagger.yaml'));
// app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDefinition));


// for Json View endpoints
const Intro = (req, res) => {
    const endpoints = listEndpoints(app);
    res.json({
        'version': 'v1',
        'patch': '1.0.0',
        'authors': 'Amit & Karun',
        'title': 'Work Clock API',
        'info': 'Attendance Application Using QR Code.',
        'authorization': 'required',
        'endpoints': endpoints
    });
}
app.get('/', Intro);

const port = process.env.PORT || 5000;

connectDb();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"))
app.use("/api/notifications", require("./routes/notificationRoutes"))

app.listen(port, () => {
    console.log('Server is running on port: ', port);
});