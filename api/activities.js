const express = require("express");
const router = express.Router();

const {requireUser} = require('./utils');
const { getAllActivities, createActivity, updateActivity, 
        getActivityById, getActivityByName } = require ('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req,res,next) => {

    try{
    const { activityId } = req.params;
    
    const activity = await getActivityById(activityId)
   
    if (!activity){
      
      res.send({
        error: "Error",
        name: 'ActivityDoesNotExistsError',
        message: `Activity ${activityId} not found`
    })
  }
    
    const routines = await getPublicRoutinesByActivity(activity);
      
    console.log (routines)

        if (routines.length === 0) {
            res.send({
                error: "Error",
                name: 'No Routines Error',
                message: `No Routines with ${activityId} not found`
            }); 
        } else{
          console.log (routines)
            res.send(routines)
          }

 
    } catch ({ name, message})  {
     

        next({ name, message });
    }   
});



// GET /api/activities
router.get('/', async (req,res,next) => {

   

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

 
try{
  const existingActivity = await getActivityByName(name)
  if (existingActivity){
    res.status(403)
            res.send({
                error: "Error",
                name: 'ErrorCreatingActivity',
                message: `An activity with name ${name} already exists`
            }); 

  }

  const activity = await createActivity({name, description});
  
  
        
  res.send(activity);

 }catch ({name, message}) 
 {next({name, message});}
 
 });


// PATCH /api/activities/:activityId


router.patch('/:activityId', requireUser,  async (req, res, next) => {
    const { activityId } = req.params;

   

    const { name, description } = req.body;


    const existingActivity = await getActivityByName(name)

    if (existingActivity) {
      res.send({
          error: 'Error',
          name: "ActivityExistsError",
          message: `An activity with name ${name} already exists`
      }); 
    }

    const _activity = await getActivityById(activityId);
       

        if (!_activity) {
            res.send({
                error: "Error",
                name: 'ActivityDoesNotExistsError',
                message: `Activity ${activityId} not found`
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

    
      const updatedActivity = await updateActivity(updateFields);
      
   

        res.send(updatedActivity )

      
      } catch ({ name, message }) {
      next({ name, message });
    }
});






module.exports = router;
