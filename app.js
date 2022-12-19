require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require('morgan');


// Setup your Middleware and API Router here
app.use(express.json());
app.use(morgan("dev"));
const router = require('./api');
app.use('/api', router);



app.use((error, req, res, next) => {
    console.error(error.stack)
    res.status(500).send({
        error: error.message,
        message: error.message,
        name: error.name
    })
  })

 

module.exports = app;
