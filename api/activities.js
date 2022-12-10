const express = require('express');
const router = express.Router();
const { getAllActivities, createActivity, updateActivity, 
        getActivityById } = require ('../db/activities')

// GET /api/activities/:activityId/routines
router.get('/:activityId/routines', async (req,res,next) => {
    
    const { activityId } = req.params;
    try{
        const activity = await getActivityById(activityId);
       
      console.log("getActivityById", activity)  
    if (activity) {
        res.send({ activity }); 
    }
    }catch ({ name, message})  {
        next({ name, message });
    }   
});


// GET /api/activities
router.get('/', async (req,res,next) => {
    console.log ("req.body", req.body)
    try{
        const allActivities = await getAllActivities();
       
      console.log("getAllActivities", allActivities)  
    if (allActivities) {
        res.send({ allActivities }); 
    }
    }catch ({ name, message})  {
        next({ name, message });
    }   
});

// POST /api/activities
router.post('/', async (req, res, next) => {

    const { name, description } = req.body;
    
try{

    const activity = await createActivity(name, description);
 if (activity) {
    console.log ("POST new activity", activity)
    res.send({ activity });
 }
 }catch ({name, message}) 
 {next({name, message});}

});


// PATCH /api/activities/:activityId

router.patch('/:activityId', async (req, res, next) => {
    const { activityId } = req.params;

    const { name, description } = req.body;
  console.log ("PATCHHHHH00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000", activityId, name, description)
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
