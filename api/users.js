const express = require('express');
const router = express.Router();
const {getUserByUsername, createUser, getUserById, getAllRoutinesByUser} = require('../db');

const {getRoutineActivitiesByRoutine} = require ('../db/routine_activities')
const {getActivityById} = require ('../db/activities')
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

       // console.log ("555555555555 USER Login AFTER getUserByUsername", user, password)

        if (user && user.password == password) {
            const token = jwt.sign({
                id: user.id
            }, JWT_SECRET);
            delete user.password
            const response = { "user": user, "message": "you're logged in!",
            "token": token}
           // console.log ("token after successful login", token, user, response)
            res.send( response );
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
    if (password.length < 8){
    //console.log ("PASSWORD TOOOOOOOOOOOOOOOOOOOOOO SHORT", password)
    next ({name: "Error", message: "the Password must be at least 8 characters in length."})
    }

    try {
        const _user = await getUserByUsername(username);
       console.log 
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
       // console.log ("###########################", user)
        const token = jwt.sign({
            "id": user.id,
            "username": username
        }, process.env.JWT_SECRET, {
            expiresIn: '2w'
        });
          //  console.log ("REGISTER ###########################", user, user.id, token)
            const response = { "user": user, 
            "message": "you're signed up!", "token": token}
          //  console.log ("RESPONSE ###########################", response)
        res.send( response );
        }catch(error) {
        console.error; 
        console.log ("Error in router.post /registration");
        next();
    }
});


// GET /api/users/me

router.get('/me',async (req, res, next) => {
   // console.log ("######################/ME", req.header)
    const prefix = 'Bearer ';
      const auth = req.header('Authorization');
    
      if (!auth) { 
        next();
      } else if (auth.startsWith(prefix)) {
        const token = auth.slice(prefix.length);
    
        try {
          const { id } = jwt.verify(token, JWT_SECRET);

         // console.log ("######################/ME", id)
    
          if (id) {
            const user = await getUserById(id);
          //  console.log ("######################/ME", user)
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

router.get('/:username/routines',async (req, res, next) => {

const { username } = req.params;
const prefix = 'Bearer ';
const auth = req.header('Authorization');

//console.log ("###############GET ROUTINES BY :USERNAME $$$$$$$$$$$", username)

if (!auth) { 
  next();
} else if (auth.startsWith(prefix)) {
  const token = auth.slice(prefix.length);

  try {
    const id = jwt.verify(token, JWT_SECRET);
    const user = await getUserByUsername(username);
    
   // console.log ("###############GET ROUTINES BY :USERNAME $$$$$$$$$$$ ID", id, user)

    if (id) {
      const routines = await getAllRoutinesByUser(username);
    //  console.log ("############GET ROUTINES BY :USERNAME $$$$$$$$$$$ ROUTINES...", routines)
    //  console.log ("############GET ROUTINES BY :USERNAME $$$$$$$$$$$ ROUTINESID", routines.id)
      const routine_activities = await getRoutineActivitiesByRoutine (routines.id);
      const activity = await getActivityById(routine_activities.getActivityById);
      activity.duration = routine_activities.duration;
      activity.count = routine_activities.count
      activity.routineActivityId = routine_activities.activityId
      activity.routineId = routine_activities.routineId
      routines.creatorName = user.username;
      routines.activity = activity;

   // console.log ("############GET ROUTINES BY :USERNAME $$$$$$$$$$$ ROUTINES2", routines)

      res.send (routines)
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


module.exports = router;
