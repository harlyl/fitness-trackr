const client = require('./client')

async function getRoutineActivityById(id){

 // console.log ("KKKKKKKKKKK", id)
  try{
    const {rows: routineActivity } = await client.query(`
    SELECT * 
    FROM routine_activities
    WHERE id = ${id};
   `)
  // console.log ("KKKKKKKKKKK", routineActivity)
    return routineActivity[0]
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
    console.log ("Error in addActivityToRoutine function")
    throw error;
  }

}

async function getRoutineActivitiesByRoutine(routine) {
  console.log ("getRoutineActivitiesByRoutine ##############################@@@@@@@@@ID", routine)
  try {
    const {rows: routines}  = await client.query(`
     SELECT * 
     FROM routine_activities
     WHERE "routineId" = ${routine.id};
    `)
console.log ("getRoutineActivitiesByRoutine ############################@@@@@@@@@ROWS", routines)
//     const {rows: routine} = await client.query(`
//     SELECT * 
//     FROM routines
//     WHERE id = ${id};
//    `)
// console.log ("getRoutineActivitiesByRoutine ############################@@@@@@@@@ROutine", routine)
//     if (rows.activity.id){
//     const {rows: activity } = await client.query(`
//     SELECT * 
//     FROM activities
//     WHERE id = ${rows.activityId};
//    `)
//     }
// console.log ("getRoutineActivitiesByRoutine ############################@@@@@@@@@Activity", activity)
   
//    if (rows.duration){
//     activity.duration = rows.duration;
//    }
//    if (rows.count){
//    activity.count = rows.count;
//    }
//    if (rows.activityId){
//    activity.routineActivityId = rows.activityId;
//    }
//    if (rows.routineId){
//    activity.routineId = rows.routineId;
//    }
//    if (activity) {
//    routine.activity = activity;
//    }
//   // console.log ("getRoutineActivitiesByRoutine ############################@@@@@@@@@FINALROUTINE", routine)
   return routines
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
        const {rows: updatedRoutineActivity} = await client.query(`
        UPDATE routine_activities
        SET ${setString}
        WHERE id= ${ id }
        RETURNING *;
        `, [ count, duration ]);

    //    console.log ("LLLLLLLLLLLLLL", updatedRoutineActivity)
    
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
  WHERE "activityId" = ${id}
  RETURNING *;

  `)

  console.log ("LLLLLLLLLLLLLL", deletedRoutineActivity)
return deletedRoutineActivity[0]

} catch (error) {
  console.log ("Error in deleteRoutine function")
  throw error;
}



}

async function canEditRoutineActivity(routineActivityId, userId) {
   
  console.log(routineActivityId, userId) 
  

  const { rows: updatedroutine_activity } = await client.query(`
  UPDATE routine_activities
  SET id=${routineActivityId}
  WHERE id= ${userId};
  `);
  
  
  
  // ADD "userId" = ${userId}
  // WHERE id= ${routineActivityId}
  // RETURNING *;
  // `);
  console.log (">>>>>>>>>>>>",updatedroutine_activity)
  if (!updatedroutine_activity){
    return false
  }else {
    return true
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
