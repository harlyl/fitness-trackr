const express = require('express');
const { getUserByUsername, getUserById } = require('../db');
const router = express.Router();
const { 
  destroyRoutine,  
  getRoutineById, 
  updateRoutine, 
  createRoutine,
  getAllPublicRoutines } = require('../db/routines')
const {addActivityToRoutine, getRoutineActivityById} = require('../db/routine_activities')
const {requireUser} = require('./utils');
const jwt = require('jsonwebtoken');
const  {JWT_SECRET}= process.env;



// GET /api/routines

router.get('/',  async (req,res,next) => {
    
    try{
        const allRoutines = await getAllPublicRoutines();
       //console.log (allRoutines)
        res.send(allRoutines); 
    
    }catch ({ name, message})  {
        next({ name, message });
    }   
});

// POST /api/routines

router.post('/', requireUser, async (req, res, next) => {
  
  const user= req.user

     const { name, goal, isPublic = "" } = req.body;
 
   const authUser = await getUserByUsername(user.username)
  
  if (authUser) { 

    try {
      const fields = {
       creatorId : user.id,
       name: name,
       goal: goal,
       isPublic
      }
     
      const routine = await createRoutine(fields);
      
       
        res.send(routine);
    
    
     }catch ({name, message}) 
     {next({name, message});}

    } else {
    res.status(401)
    res.send({
        error: "Error",
        name: "Must be logged in Error",
        message: "You must be logged in to perform this action"
    });
     
    
   }});


// PATCH /api/routines/:routineId

router.patch('/:routineId', requireUser, async (req, res, next) => {
  const user = req.user
 
  
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { 
    res.status(401)
    res.send ({
        error: "Error",
        name: "Must be logged in Error",
        message: "You must be logged in to perform this action"
    });
  }


  const token = auth.slice(prefix.length);

  const { id } = jwt.verify(token, JWT_SECRET);
 
try{
  
    const routine = await getRoutineById(req.params.routineId);
  

  if (user.id !== routine.creatorId || !user){

    res.status(403);
    res.send({
      error: "Error",
      name: "UnauthorizedUserError",
      message: `User ${req.user.username} is not allowed to update ${routine.name}`
    });
  } else {
      const { routineId } = req.params;
     
          const { isPublic, name, goal } = req.body;
      
          const fields = {
            id: routineId,
            name: name,
            goal: goal,
            isPublic: isPublic
            };

     console.log ("fields??????????",fields)
      const updatedRoutine = await updateRoutine(fields);
     
      delete updatedRoutine.id
      delete updatedRoutine.creatorId
      res.send(updatedRoutine)
          }      
     } catch ({ name, message }) {
      next({ name, message });
     }
    });

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');
  

  const user = req.user
  //console.log (user)
  

 
try {
  
    const token = auth.slice(prefix.length);
      const { id } = jwt.verify(token, JWT_SECRET);
     
  
  const routine = await getRoutineById(req.params.routineId);
   
   if (!id ||user.id !== routine.creatorId){
      res.status(403);
      res.send({
        error: "Error",
        name: "UnauthorizedUserError",
        message: `User ${user.username} is not allowed to delete ${routine.name}`
      })
    }else {
     
      const routineId = routine.id
      const deletedObj = await destroyRoutine(routineId);
      
      const {deletedRoutineActivity, deletedRoutine} = deletedObj
      

      res.send(deletedRoutine );
      next()
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
        res.send({ 
          error: "Error",
          name: "ExistingIdError",
          message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`
        });
      } else {
        const addedActivity = await addActivityToRoutine({routineId, activityId, count, duration});
       
      res.send(addedActivity);
      }
    } catch ({ name, message }) {
        next({ name, message });
      }
});





module.exports = router;
