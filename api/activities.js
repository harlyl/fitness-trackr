const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;
const {requireUser} = require('./utils');
const { getAllActivities, createActivity, updateActivity, 
        getActivityById } = require ('../db/activities')

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req,res,next) => {
    
    const { activityId } = req.params;
    try{
        const activity = await getActivityById(activityId);
       
    if (activity) {
        res.send({ activity }); 
    }
    }catch ({ name, message})  {
        next({ name, message });
    }   
});


// GET /api/activities
router.get('/', async (req,res,next) => {
    
    try{
        const allActivities = await getAllActivities();
       
        res.send([allActivities]); 
    
    }catch ({ name, message})  {
        next({ name, message });
    }   
});

// POST /api/activities
router.post('/', async (req, res, next) => {
 const { name, description } = req.body;

 const prefix = 'Bearer ';
 const auth = req.header('Authorization');

 if (!auth) { 
   next();
 } else if (auth.startsWith(prefix)) {
   const token = auth.slice(prefix.length)
 

  
try{

const {id} = jwt.verify(token, JWT_SECRET);
if (id) {
    const activity = await createActivity(name, description);

   
    res.send(activity);
}

 }catch ({name, message}) 
 {next({name, message});}
 }
 else {
  next({
    name: 'AuthorizationHeaderError',
    message: `Authorization token must start with ${ prefix }`
  });
}
});


// PATCH /api/activities/:activityId

router.patch('/:activityId', async (req, res, next) => {
    const { activityId } = req.params;

    const { name, description } = req.body;

    const updateFields = {};
  

    if (name) {
      updateFields.name = name;
    }
  
    if (description) {
      updateFields.description = description;
    }
  
    try {
     
      const updatedActivity = await updateActivity(activityId, updateFields);
        res.send({ activity: updatedActivity })
      
      } catch ({ name, message }) {
      next({ name, message });
    }
});



module.exports = router;
