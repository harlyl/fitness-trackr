const express = require('express');
const router = express.Router();
const {requireUser} = require('./utils');
const { getAllActivities, createActivity, updateActivity, 
        getActivityById } = require ('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req,res,next) => {
    try{
    const { activityId } = req.params;
    
    //console.log (">>>>>>>><<<<<<<<<<", activityId)
    const activity = await getActivityById(activityId)
   // console.log (activity)
    if (!activity){
      
      res.send({
        error: "Error",
        name: 'ActivityDoesNotExistsError',
        message: `Activity ${activityId} not found`
    })
  }
    const routines = await getPublicRoutinesByActivity(activityId);
      
    //console.log (routines)

        if (routines.length === 0) {
            res.send({
                error: "Error",
                name: 'No Routines Errot',
                message: `No Routines with ${activityId} not found`
            }); 

          console.log (")))(((())))(((routines from getPublicRoutinesByActivity", routines)
            res.send(routines)
          }

  //  console.log ("################req.params activityId", activityId)
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
router.post('/', requireUser, async (req, res, next) => {
 const { name, description } = req.body;
//console.log ("%%%%%%%%%%%%%%%%%%%%%%%%%%%router.post req.body name, description", name, description)
 
try{
  const activity = await createActivity(name, description);
  //console.log ("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%activity", activity)
        
          if (!activity) {
            res.send({
                error: "Error",
                name: 'ErrorCreatingActivity',
                message: `An activity with name ${activity.name} already exists`
            }); 
          } 
 res.send({activity});

 }catch ({name, message}) 
 {next({name, message});}
 
 });


// PATCH /api/activities/:activityId

router.patch('/:activityId', requireUser,  async (req, res, next) => {
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
