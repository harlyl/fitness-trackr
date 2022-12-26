
const express = require('express');
const { getRoutineById } = require('../db');
const router = express.Router();
const { updateRoutineActivity, destroyRoutineActivity, getRoutineActivityById } = require ('../db/routine_activities')
const {requireUser} = require('./utils');


router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
  try {
    const { count, duration } = req.body;
    const routineActivityId = req.params.routineActivityId;
    const routine_activity = await getRoutineActivityById(routineActivityId);
    const routine = await getRoutineById(routine_activity.routineId);
    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        error: "error message",
        name: "User Not Found",
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
      });
    } else {
      const updatedRoutineActivity = await updateRoutineActivity({
        id: routineActivityId,
        count,
        duration,
      });
      res.send(updatedRoutineActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
  
   const user= req.user
    const { routineActivityId } = req.params;
   
    const { count, duration } = req.body;

    const updateFields = {};
    
    if (count) {
      updateFields.count = count;
    }
  
    if (duration) {
      updateFields.duration = duration;

    if (routineActivityId) {
      updateFields.id = routineActivityId
    }
    }
    
  try {
     const routineActivity = await getRoutineActivityById(routineActivityId);
   
     const routine = await getRoutineById (routineActivity.routineId)
    
     if (!user || user.id !== routine.creatorId){
      res.status(403)
        res.send({ 
          error: "Error",
          name: "Unathorized user error",
          message: `User ${user.username} is not allowed to update In the evening`})
     }else {
      
      const updatedRoutineActivity = await updateRoutineActivity(updateFields);
      
        res.send( updatedRoutineActivity )
    
      
      }} catch ({ name, message }) {
      next({ name, message });
    }
  
});


// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
const user = req.user
 
   try {
       
       const routineActivity = await getRoutineActivityById(req.params.routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId)

      if (!user || user.id === routine.creatorId){
      
         const deletedActivity = await destroyRoutineActivity(routineActivity.id);
       
         res.send(deletedActivity);
      } else {
        res.status(403)
        res.send({ 
          error: "Error",
          name: "Unathorized user error",
          message: `User ${user.username} is not allowed to delete In the afternoon`})
      }
   
     } catch ({name, message}){
       next({name, message})
     }
     
  });




router.delete("/:routineActivityId", requireUser, async (req, res, next) => {
  try {
    const routineActivityId = req.params.routineActivityId;
    const routineActivity = await getRoutineActivityById(routineActivityId);

    const routine = await getRoutineById(routineActivity.routineId);

    if (routine.creatorId != req.user.id) {
      res.status(403);
      next({
        error: "error message",
        name: "Unauthorized User",
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
      });
    }
    await destroyRoutineActivity(routineActivityId);
    res.send(routineActivity);
  } catch ({ error, name, message }) {
    next({ error, name, message });
  }
});

module.exports = router;
