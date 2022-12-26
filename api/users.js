const express = require('express');

const router = express.Router();
const {getUserByUsername, createUser, getUserById, getUser } = require('../db/users');
const {  getPublicRoutinesByUser } = require('../db')
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;

const { requireUser } = require('./utils');




// POST /api/users/login
// router.post('/login', async (req, res, next) => {
//     const { username, password } = req.body;
  
    
//     if (!username || !password) {
//       res.send({
//         name: "MissingCredentialsError",
//         message: "Please supply both a username and password"
//       });
//     }


  
//     try {
//       const user = await getUser({username, password});
  
//       if (!user) {
//         res.send({
//           name: "IncorrectCredentialsError",
//           message: "Username or password is incorrect"
//         })
//       } else {
//         const token = jwt.sign({
//           id: user.id,
//           username: user.username, 
//         }, JWT_SECRET, {
//           expiresIn: '1w'
//         });

        
//         console.log('TOKEN', token)
//         res.send({
//           user,
//           message: "you're logged in!", 
//           token 
//         })
//       }

     
     
//     } catch(error) {
//       next(error);
//     }
//   });

router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    
  
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply a valid username and password"
        });
    }
    try{
        
        const user = await getUser({username, password});
        console.log (user)
      
       
        if (user) {
            const token = jwt.sign({
              id: user.id,
              username: username
          }, JWT_SECRET);
          
          delete user.password
          user.token = token
          req.user = user
          const response = { 
            user: user, 
            message: "you're logged in!",
            token: token
          }
         
          res.send( response );
          } else {
            res.status(401)
            res.send({
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
// router.post('/register', async ( req, res, next) => {
//     const { username, password } = req.body;
//     try {
//       const _user = await getUserByUsername(username);
    
//       if (_user) {
//         res.status(401)
//         next({
//           name: 'UserExistsError',
//           message: `User ${username} is already taken.`
//         });

//       } else if (password.length < 8) {
//         next({
//           name: "PasswordLengthError",
//           message: "Password Too Short!"
//         })
//       } else {
//         const user = await createUser({
//           username,
//           password,
//         });

//         console.log('CREATEUSER', user);

//         if (!user) {
//           next({
//             name: "UserCreationError",
//             message: "There was a problem registering you. Please try again."
//           })
//         } else {
//           const token = jwt.sign({ 
//             id: user.id, 
//             username: user.username
//           }, JWT_SECRET, {
//             expiresIn: '1w'
//           });
      

//           res.send({ 
//             user,
//             message: "you're signed up!",
//             token 
//           });
//         }
    
//       }
  
//     } catch ( error ) {
//       next(error);
//     } 
//   });


  


router.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    
    if (password.length < 8){
    
    res.status(401)
        res.send({ 
          error: "Error",
          name: "Password length error",
          message: "Password Too Short!"})
    }
   
   try {

    const _user = await getUserByUsername(username);
    console.log(_user)

    if (_user && _user.username === username) {
      res.status(403)
      res.send({ 
        error: "Error",
        name: "Username error",
        message: `User ${username} is already taken.`})
    }
       
       const fields= {username: username, password: password}
  
        const user = await createUser(
          fields
        );
       console.log (user)
        const token = jwt.sign({
            "id": user.id,
            "username": username
        }, process.env.JWT_SECRET, {
            expiresIn: '2w'
        });
          
            const response = { "user": user, 
            "message": "you're signed up!", "token": token}
         
        res.send( response );
        }catch(error) {
        console.error; 
        console.log ("Error in router.post /registration");
        next();
    }
});


// GET /api/users/me
// router.get('/me',async (req, res, next) => {
  
// });

router.get('/me',async (req, res, next) => {
   
    const prefix = 'Bearer ';
      const auth = req.header('Authorization');
    
      if (!auth) { 
        res.status(401)
        res.send ({
            error: "Error",
            name: "Must be logged in Error",
            message: "You must be logged in to perform this action"
        });
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
router.get('./:username/routines', async (req, res, next) => {
  
});


router.get('/:username/routines', requireUser, async (req, res, next) => {

const { username } = req.params;

if (username) {
  try {
    const routines = await getPublicRoutinesByUser({username});
   
    res.send(routines)
  }catch ({ name, message }) {
    next({ name, message });
  }
}
});


module.exports = router;
