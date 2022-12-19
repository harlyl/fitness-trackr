const express = require('express');
const router = express.Router(); 
const jwt = require('jsonwebtoken')
const { JWT_SECRET = 'neverTell'} = process.env;

const { 
    createUser,
    getUserByUsername,
    getUser, 
    getUserById,
    getAllRoutinesByUser,
    getPublicRoutinesByUser
  } = require('../db');

// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }


  
    try {
      const user = await getUser({username, password});
  
      if (!user) {
        next({
          name: "IncorrectCredentialsError",
          message: "Username or password is incorrect"
        })
      } else {
        const token = jwt.sign({
          id: user.id,
          username: user.username, 
        }, JWT_SECRET, {
          expiresIn: '1w'
        });

        
        console.log('TOKEN', token)
        res.send({
          user,
          message: "you're logged in!", 
          token 
        })
      }

     
     
    } catch(error) {
      next(error);
    }
  });

// POST /api/users/register
router.post('/register', async ( req, res, next) => {
    const { username, password } = req.body;
    try {
      const _user = await getUserByUsername(username);
    
      if (_user) {
        res.status(401)
        next({
          name: 'UserExistsError',
          message: `User ${username} is already taken.`
        });

      } else if (password.length < 8) {
        next({
          name: "PasswordLengthError",
          message: "Password Too Short!"
        })
      } else {
        const user = await createUser({
          username,
          password,
        });

        console.log('CREATEUSER', user);

        if (!user) {
          next({
            name: "UserCreationError",
            message: "There was a problem registering you. Please try again."
          })
        } else {
          const token = jwt.sign({ 
            id: user.id, 
            username: user.username
          }, JWT_SECRET, {
            expiresIn: '1w'
          });
      

          res.send({ 
            user,
            message: "you're signed up!",
            token 
          });
        }
    
      }
  
    } catch ( error ) {
      next(error);
    } 
  });


  


// GET /api/users/me
router.get('/me',async (req, res, next) => {
  
});

// GET /api/users/:username/routines
router.get('./:username/routines', async (req, res, next) => {
  
});


module.exports = router;
