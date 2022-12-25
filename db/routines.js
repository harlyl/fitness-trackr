//const { CommandCompleteMessage } = require('pg-protocol/dist/messages');
const client = require('./client');
const { attachActivitiesToRoutines } = require('./activities')



async function getRoutineById(id){
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * FROM routines
    WHERE id = $1;
    `, [id]);

    return routine
  
  } catch (error) {
    console.log ("Error in getRoutineById")
    throw error;
  }
}

async function getRoutinesWithoutActivities(){
  try{
    const { rows } = await client.query(`
    SELECT * 
    FROM routines;
    `);
    
    
    return rows;
   } catch (error){
    console.log ("Error in getRoutinesWithoutActivities function")
    throw error
   }
}

async function getAllRoutines() {

  try {
    const {rows:routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id;
    `)
    //console.log ("getAllRoutinesXXXXXXXXXX....Routines", routines)
   // console.log(await attachActivitiesToRoutines(routines));
return await attachActivitiesToRoutines(routines);
    } catch (error) {
    console.log ("Error in getAllRoutines")
    throw error;
  }
}

async function getAllRoutinesByUser(user) {
 //console.log ("getAllRoutinesbyUser", user)
  try {
    const {rows: routines} = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE users.id = $1;
    `, [user.id])
   // console.log ("getAllRoutinesbyUser ROWS", routines[0])

   
   return await attachActivitiesToRoutines(routines);
    } catch (error) {
    console.log ("Error in getAllPublicRoutines")
    throw error;
  }
}

async function getPublicRoutinesByUser({username}) {
 console.log (username)
  try {
   

    const { rows: routines } = await client.query(`

    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId"=users.id
    WHERE users.username=$1
    AND routines."isPublic" = true;
    `, [username]);
   
    
    return await attachActivitiesToRoutines(routines);
    } catch (error) {
    console.log ("Error in getPublicRoutinesByUser")
    throw error;
  }
}

async function getAllPublicRoutines() {

  
  try {
    const { rows: routines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    WHERE "isPublic" = true;
    `);



return attachActivitiesToRoutines(routines);

    } catch (error) {
    console.log ("Error in getAllPublicRoutines")
    throw error;
  }
}



async function getPublicRoutinesByActivity(activity) {

 // console.log (">>>>>>>>>>>>>>>>>>>>getPUb",activity.id)
  try {
    const { rows: routines } = await client.query(`

    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users
    ON routines."creatorId" = users.id
    JOIN routine_activities
    ON routines.id = routine_activities."routineId"
    WHERE routines."isPublic" = true
    AND routine_activities."activityId"=$1;
    `, [activity.id]);
   
  //console.log("routines>>>>>>>>>>>>",routines)
   //console.log ("routines with activities>>>>>>>>",await attachActivitiesToRoutines(routines))
     return await attachActivitiesToRoutines(routines);
    } catch (error) {
    console.log ("Error in getPublicRoutinesByActivity")
    throw error;
  }
}

async function createRoutine({creatorId, name, goal, isPublic}) {
//console.log(creatorId )
  try {
    const { rows: routine } = await client.query(`
    INSERT INTO routines ("creatorId", name, goal, "isPublic") 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [creatorId, name, goal, isPublic]);
    
//console.log (routine[0])
    return routine[0]
}catch (error) {
   // console.log ("Error in createRoutine function")
    
  }
}

async function updateRoutine(fields) {

  console.log ("fields>>>>>>>>", fields)
  
  const routineId = fields.id
  console.log(routineId)
  
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index +1 }`
).join(', ');

if (setString.length === 0) {
    return;
}
console.log (setString)
try {
    const { rows: [routine] } = await client.query(`
    UPDATE routines
    SET ${ setString }
    WHERE id=${ routineId }
    RETURNING *;
    `, Object.values(fields));

    console.log (routine)
    return routine;
} catch (error) {
    console.log ("Error in updateRoutine function")
    throw error;
  }
}

async function destroyRoutine(id) {
//console.log(id)

try{
  
  const { rows: routine_activities } = await client.query(`
  DELETE FROM routine_activities
  WHERE "routineId" = $1
  RETURNING *;
  `, [id])  
 // console.log (">>>>>>>>>>A", routine_activities)
  
  const { rows } = await client.query(`
  DELETE FROM routines
  WHERE id = $1
  RETURNING *;
`, [id])

  console.log (rows[0])
  const result = {
    deletedRoutineActivity: routine_activities[0],
    deletedRoutine: rows[0]
  }
  return (result)

  } catch (error) {
    console.log ("Error in deleteRoutine function")
    throw error;
  }
}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
  
}