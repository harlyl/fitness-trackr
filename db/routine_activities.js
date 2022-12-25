const client = require('./client')

async function getRoutineActivityById(id){

 // console.log ("KKKKKKKKKKK", id)
  try{
    const {rows: routineActivity } = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id = $1;
   `, [id])
  // console.log ("KKKKKKKKKKK", routineActivity)
    return routineActivity[0]
  }catch (error) {
    console.log ("Error in getRoutineActivityById function" + error)
    throw error;
  }
  
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
//console.log ("INPUTS to addActivityToROUTINE", routineId, activityId, count, duration)
  try {
    const { rows: routine_activity } = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [routineId, activityId, count, duration]);
    
 //   console.log ("OUTPut to addActivityToROUTINE", routine_activity)
    return routine_activity[0]
}catch (error) {
    console.log ("Error in addActivityToRoutine function" + error)
    throw error;
  }
}

async function getRoutineActivitiesByRoutine(routine) {
  console.log (routine.id)
  try {
    const {rows: routineActivity}  = await client.query(`
     SELECT * 
     FROM routine_activities
     WHERE "routineId" = $1;
    `, [routine.id])


   return routineActivity
  } catch (error) {
    console.log ("Error in getRoutineActivitiesByRoutine function")
    throw error;
  }
}

async function updateRoutineActivity ({...fields}) {
console.log(fields)
    const {count, duration, id}= fields
   // delete fields.routineActivityId
    delete fields.id
console.log(count, duration, id)
    
const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
    console.log (setString)
   try {
        const {rows: updatedRoutineActivity} = await client.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE id = ${ id }
        RETURNING *;
        `, [ count, duration ]);

       console.log (">>>>>>",updatedRoutineActivity[0])
    
   return updatedRoutineActivity[0]

    } catch (error) {
        console.log ("Error in updateRoutineActivity function")
        throw error;
    }
}




async function destroyRoutineActivity(id) {

  try{
  const { rows: deletedRoutineActivity } = await client.query(`
  DELETE FROM routine_activities
  WHERE routine_activities.id = $1
  RETURNING *;
  `, [id])

  console.log (deletedRoutineActivity)
return deletedRoutineActivity[0]

} catch (error) {
  console.log ("Error in deleteRoutine function")
  throw error;
}



}

async function canEditRoutineActivity(routineActivityId, userId) {
   
  //console.log("canEditRoutineActivity", routineActivityId, userId) 

try{
  const {rows :users} = await client.query(`
  SELECT * FROM users
  INNER JOIN routines
  ON ${userId} = routines."creatorId"
  INNER JOIN routine_activities
  ON routines.id = routine_activities."routineId"
`)
 // console.log("JJJJJJJJJJ", users[0])
if (users[0]){
  return true
}else {
  return false
}
}catch (error) {
  console.log ("Error in deleteRoutine function")
  throw error;
}
}
  
  
  
  


module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
