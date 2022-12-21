const express = require('express');
const { getRoutineById } = require('../db');
const router = express.Router();
const { updateRoutineActivity, destroyRoutineActivity, getRoutineActivityById } = require ('../db/routine_activities')
const {requireUser} = require('./utils');


// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', requireUser, async (req, res, next) => {


    const { routineActivityId } = req.params;
    //console.log ("patch Req Params>>>>>>>>>>>>>>>>", req.params)
    const { count, duration } = req.body;

    const updateFields = {};
    
    if (count) {
      updateFields.count = count;
    }
  
    if (duration) {
      updateFields.duration = duration;
    }
    
  try {
     const routineActivity = await getRoutineActivityById(routineActivityId);
     const routine = await getRoutineById (routineActivity.routineId)

     if (req.user.id !== routine.creatorId){
      next({ name: "Must be a user"})
     }else {

      const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
      if (updatedRoutineActivity){
        res.send( updatedRoutineActivity )
      } else{
        next({ name:"Routine does not exist"})
      }
      }} catch ({ name, message }) {
      next({ name, message });
    }
  
});


// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
//console.log ("REQ PARAMS>>>>>>>>>", req.params.routineActivityId)
   
   try {
   
       const routineActivity = await getRoutineActivityById(req.params.routineActivityId);
      const routine = await getRoutineById(routineActivity.routineId)

      if (req.user.id === routine.creatorId){
       //console.log ("routineactivity>>>>>>>>>", routineActivity)
         const deletedActivity = await destroyRoutineActivity(routineActivity.id);
        // console.log ("deleted Activity>>>>>>>>>", deletedActivity)
         res.send(deletedActivity);
      } else {
        next({ message: "Error: Only the routine creator can delete a routine"})
      }
   
     } catch ([name, message]){
       next()
     }
     
  });




module.exports = router;
