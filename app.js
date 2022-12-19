require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here
app.use(express.json());

const router = require('./api');
app.use('/api', router);


module.exports = app;
