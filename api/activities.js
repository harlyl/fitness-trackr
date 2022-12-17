const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;
const {requireUser} = require('./utils');
const { getAllActivities, createActivity, updateActivity, 
        getActivityById, getActivityByName } = require ('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req,res,next) => {
    
    const { activityId } = req.params;

    const _activity = await getActivityById(activityId);
      // console.log ("VV******************* getActivityById", _activity, activityId)

        if (!_activity) {
            res.send({
                error: "Error",
                name: 'ActivityDoesNotExistsError',
                message: `Activity ${activityId} not found`
            }); 
          }

  //  console.log ("################req.params activityId", activityId)
  
    try{
        const publicroutines= await getPublicRoutinesByActivity(activityId);

      console.log ("###########################ACTIVITY", publicroutines)
   
      if (_activity && publicroutines) {
        res.send(publicroutines); 
      }
    } catch ({ name, message})  {
        next({ name, message });
    }   
});



// GET /api/activities
router.get('/', async (req,res,next) => {
   // console.log ("GETALLACTIVITIES REQ.BODY",req.body)
    try{
        const allActivities = await getAllActivities();
       
        res.send(allActivities); 
    
    }catch ({ name, message})  {
        next({ name, message });
    }   
});

// POST /api/activities
router.post('/', async (req, res, next) => {
 const { name, description } = req.body;
console.log ("%%%%%%%%%%%%%%%%%%%%%%%%%%%router.post req.body name, description", name, description)
 const prefix = 'Bearer ';
 const auth = req.header('Authorization');

 if (!auth) { 
   next();
 } else if (auth.startsWith(prefix)) {
   const token = auth.slice(prefix.length)
 
try{

  const _activity = await getActivityByName(name);
console.log ("******************* getActivityByName", _activity)
        
          if (_activity) {
            res.send({
                error: "Error",
                name: 'ActivityExistsError',
                message: `An activity with name ${_activity.name} already exists`
            }); 
          } 

const {id} = jwt.verify(token, JWT_SECRET);
if (id) {
    const activity = await createActivity(name, description);
    console.log ("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%activity", activity)
   
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

    //    console.log ("activityId ################################", activityId)

    const { name, description } = req.body;

//console.log ("name, description ################################", name, description, req.body)

    const _activity = await getActivityById(activityId);
       // console.log ("******************* getActivityById", _activity, name)

        if (!_activity) {
            res.send({
                error: "Error",
                name: 'ActivityDoesNotExistsError',
                message: `Activity ${activityId} not found`
            }); 
          } else if (_activity) {
            res.send({
                error: 'Error',
                name: "ActivityExistsError",
                message: `An activity with name ${name} already exists`
            }); 
          }

    const updateFields = {};
  

   if (name) {
      updateFields.name = name;
    }
  
    if (description) {
      updateFields.description = description;
    }
  updateFields.id = activityId
    try {
     // console.log ("updateFields ################################", updateFields, activityId)
      const updatedActivity = await updateActivity(updateFields);
    //  console.log ("updatedActivity ################################", updatedActivity)


        res.send({ activity: updatedActivity })
      
      } catch ({ name, message }) {
      next({ name, message });
    }
});



module.exports = router;

