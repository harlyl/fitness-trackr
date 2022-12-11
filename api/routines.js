const express = require('express');
const router = express.Router();
const { destroyRoutine, getAllRoutines } = require('../db/routines')
const {addActivityToRoutine} = require('../db/routine_activities')
const {requireUser} = require('./utils');
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;


// GET /api/routines

router.get('/', async (req,res,next) => {
    
    try{
        const allRoutines = await getAllRoutines();
       
        res.send([allRoutines]); 
    
    }catch ({ name, message})  {
        next({ name, message });
    }   
});

// POST /api/routines

router.post('/', async (req, res, next) => {
    const { name, goal, isPublic } = req.body;
   
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
   
    if (!auth) { 
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length)
    
   
     
   try{
   
   const {id} = jwt.verify(token, JWT_SECRET);
   if (id) {
       const routine = await createRoutine(id, name, goal, isPublic);
   
      
       res.send(routine);
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


// PATCH /api/routines/:routineId

router.patch('/:routineId', async (req, res, next) => {
    const { routineId } = req.params;

    const { name, goal, isPublic } = req.body;

    const updateFields = {};
  

    if (name) {
      updateFields.name = name;
    }
  
    if (description) {
      updateFields.description = description;
    }

    if (isPublic) {
        updateFields.isPublic = isPublic;
    }
  
    try {
     
      const updatedRoutine = await updateRoutine(activityId, updateFields);
        res.send({ activity: updatedRoutine })
      
      } catch ({ name, message }) {
      next({ name, message });
    }
});

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {

 const prefix = 'Bearer ';
 const auth = req.header('Authorization');

 if (!auth) { 
   next();
 } else if (auth.startsWith(prefix)) {
   const token = auth.slice(prefix.length)
 
try {

    const {id} = jwt.verify(token, JWT_SECRET);
if (id) {
    const routine = await getRoutineById(req.params.routineId);

    
      const deletedRoutine = await destroyRoutine(routine.id);

      res.send({ post: deletedRoutine });
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



// POST /api/routines/:routineId/activities

router.post('/:routineId/activities', async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;
    try{
        const routine = await addActivityToRoutine(routineId, activityId, count, duration);
   
      
        res.send(routine);

    } catch ({ name, message }) {
        next({ name, message });
      }
});





module.exports = router;
