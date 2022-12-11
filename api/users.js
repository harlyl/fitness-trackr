const express = require('express');
const router = express.Router();
const {getUserByUsername, createUser, getUserById} = require('../db');
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;
const {requireUser} = require('./utils');


// POST /api/users/login

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply a valid username and password"
        });
    }
    try{
        const user = await getUserByUsername(username);

        console.log ("555555555555 USER Login AFTER getUserByUsername", user, password)

        if (user && user.password == password) {
            const token = jwt.sign({
                id: user.id
            }, JWT_SECRET);
            console.log ("token after successful login", token)
            
            res.send({ message: "you're logged in!", 
            token: token 
            });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
        }
        } catch(error) {
            console.log(error);
            next(error);
        }
    res.end();
  });

// POST /api/users/register

router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const _user = await getUserByUsername(username);

        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            });
        }
        const user = await createUser({
            username,
            password
        });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '2w'
        });

        res.send({ 
            message: "thank you for signing up",
            token 
          });
        }catch ({ name, message }) {
            next({ name, message})
        }
});


// GET /api/users/me

router.get('/me',async (req, res, next) => {
    const prefix = 'Bearer ';
      const auth = req.header('Authorization');
    
      if (!auth) { 
        next();
      } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
    
        try {
          const { id } = jwt.verify(token, JWT_SECRET);

          
    
          if (id) {
            const user = await getUserById(id);
            
            res.send (user)
            next();
          }
        } catch ({ name, message }) {
          next({ name, message });
        }
      } else {
        next({
          name: 'AuthorizationHeaderError',
          message: `Authorization token must start with ${ prefix }`
        });
      }
    });

// GET /api/users/:username/routines

module.exports = router;
