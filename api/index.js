const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const app = require('../app');





const { JWT_SECRET = 'neverTell'} = process.env;



// GET /api/health
router.get('/health', async (req, res, next) => {
    res.status(200);
    res.send({
        message: "Server id healthy."
    })
});

router.use(async (req, res, next) => {
    const prefix = "Bearer";
    const auth = req.header("Authorization");

    if(!auth) {
        next();
    } else if(auth.startsWith(prefix)) {
       const token = auth.slice(prefix.length);
       console.log("NEWTOKEN", token);
       try {
        const parsedToken = jwt.verify(token, JWT_SECRET);

        console.log('PARSED', parsedToken);
        
        // if (id) {
        //     req.user = await getUserById(id);
        //     next();
        // }

       } catch (error) {
        console.log("There was an error", token);
        next(error);
       }
    } else {
        next({
            name: "AuthorizationHeaderError", 
            message: `Authorization token must start with ${prefix}`
        })
    }
})



// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);

module.exports = router;
