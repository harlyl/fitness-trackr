const express = require('express');
const router = express.Router();
const { updateRoutineActivity, destroyRoutineActivity, getRoutineActivityById } = require ('../db/routine_activities')
const {getActivityById} = require ('../db/activities')
const {requireUser} = require('./utils');
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;


// PATCH /api/routine_activities/:routineActivityId

router.patch('/:routineActivityId', async (req, res, next) => {


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
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
   
    if (!auth) { 
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length)
    }


    try {
      const {id} = jwt.verify(token, JWT_SECRET);
      if (id && token) {
      const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
        res.send( updatedRoutineActivity )
      }
      } catch ({ name, message }) {
      next({ name, message });
    }
});


// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', async (req, res, next) => {
//console.log ("REQ PARAMS>>>>>>>>>", req.params.routineActivityId)
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
   
    if (!auth) { 
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length)
    
   try {
   
       const {id} = jwt.verify(token, JWT_SECRET);
   if (id && token) {
       const routineActivity = await getRoutineActivityById(req.params.routineActivityId);
   
       //console.log ("routineactivity>>>>>>>>>", routineActivity)
         const deletedActivity = await destroyRoutineActivity(routineActivity.id);
        // console.log ("deleted Activity>>>>>>>>>", deletedActivity)
         res.send(deletedActivity);
   } 
   
     } catch ([name, message]){
       next()
     }
     }
     else {
      next({
        name: 'AuthorizationHeaderError',
        message: `Authorization token must start with ${ prefix }`
      });
   }
   });




module.exports = router;
