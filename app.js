require("dotenv").config()
const express = require("express")
const app = express()

// Setup your Middleware and API Router here

//const {client} = require('./db/client');
const morgan = require('morgan');
const cors = require('cors')

//client.connect();

app.use(morgan('dev'));

app.use(cors());

app.use(express.json());



app.use((req, res, next) => {
    console.log("<____Body Logger START___>");
    console.log(req.body);
    console.log("<____Body Logger END___>");
    next();
})


const apiRouter = require('./api');
app.use('/api', apiRouter);

apiRouter.use((error, req, res, next) => {
    console.error(error);
    res.status(404);
    res.send("That page was not found.");
    next()
  });

apiRouter.use((error, req, res, next) => {
    console.error(error);
    res.status(500);
    res.send({
      name: error.name,
      message: error.message
    });
    next()
  });


module.exports = app;
