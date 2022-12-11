const express = require('express');
const router = express.Router();
const { updateRoutineActivity, destroyRoutineActivity } = require ('../db/routine_activities')
const {requireUser} = require('./utils');
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;


// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', async (req, res, next) => {
    const { activityId } = req.params;

    const { count, duration } = req.body;

    const updateFields = {};
  

    if (count) {
      updateFields.count = count;
    }
  
    if (duration) {
      updateFields.duration = duration;
    }
  
    try {
     
      const updatedRoutineActivity = await updateRoutineActivity(activityId, updateFields);
        res.send({ updatedroutineactivity: updatedRoutineActivity })
      
      } catch ({ name, message }) {
      next({ name, message });
    }
});


// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {

    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
   
    if (!auth) { 
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length)
    
   try {
   
       const {id} = jwt.verify(token, JWT_SECRET);
   if (id) {
       const activity = await getActivityById(req.params.activityId);
   
       
         const deletedActivity = await destroyRoutineActivity(activity.id);
   
         res.send({ post: deletedActivity });
   } 
   
     } catch ({ name, message }) 
       next({ name, message })
     }
     else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
   }
   });




module.exports = router;
