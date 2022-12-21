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
 //console.log ("getAllRoutinesbyUser", user.id)
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
 // console.log ("ALLPUBLICRoutinesbyUsername", username)
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



async function getPublicRoutinesByActivity({id}) {

 // console.log ("ALLPUBLICRoutinesbyActivity...ID", id)
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
    `, [id]);
   
  //console.log(routines)
   // console.log (await attachActivitiesToRoutines(routines))
     return await attachActivitiesToRoutines(routines);
    } catch (error) {
    console.log ("Error in getPublicRoutinesByActivity")
    throw error;
  }
}

async function createRoutine({creatorId, name, goal, isPublic}) {

  try {
    const { rows: routine } = await client.query(`
    INSERT INTO routines ("creatorId", name, goal, "isPublic") 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [creatorId, name, goal, isPublic]);
    
  // console.log ("routine>>>>>>>>>>>>>",routine[0])
    return routine[0]
}catch (error) {
   // console.log ("Error in createRoutine function")
    
  }
}

async function updateRoutine({id, ...fields}) {

//console.log ("fields", fields)
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index +1 }`
).join(', ');

if (setString.length === 0) {
    return;
}
//console.log ("updateRoutine setString>>>>>>>", setString)
try {
    const { rows: [routine] } = await client.query(`
    UPDATE routines
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
    `, Object.values(fields));

   // console.log ("updateRoutine routine>>>>>>>", routine)
    return routine;
} catch (error) {
    console.log ("Error in updateRoutine function")
    throw error;
  }
}

async function destroyRoutine(id) {

  
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

  //console.log (">>>>>>>>>>B", rows[0])
  return (rows[0], routine_activities[0])

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