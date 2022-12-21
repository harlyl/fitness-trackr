const express = require('express');
const router = express.Router();
const { 
  destroyRoutine,  
  getRoutineById, 
  updateRoutine, 
  createRoutine,
  getAllPublicRoutines } = require('../db/routines')
const {addActivityToRoutine, getRoutineActivityById} = require('../db/routine_activities')
const {requireUser} = require('./utils');


// GET /api/routines

router.get('/',  async (req,res,next) => {
    
    try{
        const allRoutines = await getAllPublicRoutines();
       //console.log ("^^^^^^^^^^^^^^^^^^^XXXXXXX%%%%%%%%XXXXXXXXXXX",allRoutines)
        res.send(allRoutines); 
    
    }catch ({ name, message})  {
        next({ name, message });
    }   
});

// POST /api/routines

router.post('/', requireUser, async (req, res, next) => {
    const { name, goal, isPublic = "" } = req.body;
  
   
    try{
   
    const routine = await createRoutine(id, name, goal, isPublic);
   
      
       res.send(routine);
   
   
    }catch ({name, message}) 
    {next({name, message});}
    
   });


// PATCH /api/routines/:routineId

router.patch('/:routineId', requireUser, async (req, res, next) => {
    
  const { routineId } = req.params;

    const { name, goal, isPublic } = req.body;

    const updateFields = {};
  

    if (name) {
      updateFields.name = name;
    }
  
    if (goal) {
      updateFields.goal = goal;
    }

    if (isPublic) {
        updateFields.isPublic = isPublic;
    }
  
    try {
     
      const updatedRoutine = await updateRoutine(routineId, updateFields);
      console.log (">>>>>>>>Updated Routine")
        res.send({ updatedRoutine })
      
      } catch ({ name, message }) {
      next({ name, message });
    }
});

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {

 
try {
    const routine = await getRoutineById(req.params.routineId);
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        name: "UnauthorizedUserError",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`
      })
    }else {
    
      const deletedRoutine = await destroyRoutine(routine.id);

      res.send({ deletedRoutine });
      next();
} 

  } catch ({ name, message }){
    next()
  }
  
 });



// POST /api/routines/:routineId/activities

router.post('/:routineId/activities', async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    const routineActId = await getRoutineActivityById(activityId);

    try{
      if (routineActId) {
        next({ 
          name: "ExistingIdError",
          message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`
        });
      } else {
        const addedActivity = await addActivityToRoutine(routineId, activityId, count, duration);
   
      res.send(addedActivity);
      }
    } catch ({ name, message }) {
        next({ name, message });
      }
});





module.exports = router;
