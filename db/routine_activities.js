const client = require('./client')

async function getRoutineActivityById(id){
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {

  try {
    const {rows} =  await client.query(`
    INSERT INTO "routineActivities" ("routineId", "activityId", count, duration)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    ;`, [routineId, activityId, count, duration]);
    return rows
  } catch (error) {
    console.log("error in addActivityToRoutine");
    console.error(error);
    throw Error
  }


    
}

async function getRoutineActivitiesByRoutine({id}) {
}

async function updateRoutineActivity ({id, ...fields}) {
}

async function destroyRoutineActivity(id) {
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
