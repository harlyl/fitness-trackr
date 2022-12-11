const client = require('./client')

async function getRoutineActivityById(id){
  try{
    const {rows: activity } = await client.query(`
    SELECT * 
    FROM activities
    WHERE id = ${id}
    RETURNING *;
   `)
    return activity
  }catch (error) {
    console.log ("Error in getRoutineActivityById function")
    throw error;
  }
  
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {

  try {
    const { rows } = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", count, duration) 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [routineId, activityId, count, duration]);
    
   
    return rows
}catch (error) {
    console.log ("Error in addActivityToRoutine function")
    throw error;
  }

}

async function getRoutineActivitiesByRoutine({id}) {

  try {
    const { rows: routact } = await client.query(`
     SELECT * 
     FROM routine_activities
     WHERE "activityId" = ${id}
     RETURNING *;
    `)
console.log (routact)
    const {rows: routine} = await client.query(`
    SELECT * 
    FROM routines
    WHERE id = ${routact.routineId}
    RETURNING *;
   `)
console.log (routine)
    const {rows: activity } = await client.query(`
    SELECT * 
    FROM activities
    WHERE id = ${routact.activityId}
    RETURNING *;
   `)
   activity.duraction = routact.duration;
   activity.count = routact.count;
   activity.routineActivityId = routact.activityId;
   activity.routineId = routact.routineId;
   routine.activity = activity;

   return [routine]
  } catch (error) {
    console.log ("Error in getRoutineActivitiesByRoutine function")
    throw error;
  }



}

async function updateRoutineActivity ({id, ...fields}) {

    const { count, duration } = fields

    const setString = Object.keys(fields).map(
      (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');
    
   try {
        const {rows} = await client.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE id= ${ id }
        RETURNING *;
        `, [ count, duration ]);
    
   return rows

    } catch (error) {
        console.log ("Error in updateRoutineActivity function")
        throw error;
    }
}




async function destroyRoutineActivity(id) {

  try{
  const { rows: routine_activity } = await client.query(`
  DELETE FROM routines_activities
  WHERE "activityId" = ${id};
  `)

return routine_activity

} catch (error) {
  console.log ("Error in deleteRoutine function")
  throw error;
}



}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
