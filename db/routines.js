const client = require('./client');

async function getRoutineById(id){
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * FROM routines
    WHERE id = '${id}';
    `);

    console.log ("****getRoutineById", routine)
  
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
    
    console.log ("RRRRRRgetRoutinesWithoutActivities", rows)
    return rows;
   } catch (error){
    console.log ("Error in getRoutinesWithoutActivities function")
    throw error
   }

}

async function getAllRoutines() {

  try {
    const { rows } = await client.query(`
    SELECT * FROM routines;
    `);
   
  return rows;
    } catch (error) {
    console.log ("Error in getAllRoutines")
    throw error;
  }

}

async function getAllRoutinesByUser({username}) {
  console.log ("ALLRoutinesbyUsername", username)
  try {
    const {rows} = await client.query(`
    
    SELECT * FROM users
    WHERE username = '${username}';
    `)

    const { rows : routines } = await client.query(`
    SELECT * FROM routines
    WHERE "creatorId" = '${rows.id}';
    `);
   console.log ("ALLRoutinesbyUsername", routines)
  return routines;
    } catch (error) {
    console.log ("Error in getAllPublicRoutines")
    throw error;
  }


}

async function getPublicRoutinesByUser({username}) {
  console.log ("ALLPUBLICRoutinesbyUsername", username)
  try {
    const {rows} = await client.query(`
    
    SELECT * FROM users
    WHERE username = '${username}';
    `)

    const { rows : routines } = await client.query(`
    SELECT * FROM routines
    WHERE "creatorId" = '${rows.id}' AND "isPublic" = true;
    `);
   console.log ("publicRoutinesbyUsername", routines)
  return routines;
    } catch (error) {
    console.log ("Error in getAllPublicRoutines")
    throw error;
  }
}

async function getAllPublicRoutines() {

  try {
    const { rows } = await client.query(`
    SELECT * FROM routines
    WHERE "isPublic" = true;
    `);
 
  return rows;
    } catch (error) {
    console.log ("Error in getAllPublicRoutines")
    throw error;
  }


}

async function getPublicRoutinesByActivity({id}) {

  console.log ("ALLPUBLICRoutinesbyActivity...ID", id)
  try {
    const {rows: [routine]} = await client.query(`
    SELECT * FROM routine_activities
    WHERE "activityId" = ${id};
    `)
    console.log ("ALLPUBLICRoutinesbyActivity...ROWS", routine)
    const { rows : routines } = await client.query(`
    SELECT * FROM routines
    WHERE id = '${routine.routineId}' AND "isPublic" = true;
    `);
   routines.id = routine.activityId
   console.log ("publicRoutinesbyActivity. Routines", routines)
  return routines;
    } catch (error) {
    console.log ("Error in getPublicRoutinesByActivity")
    throw error;
  }

}

async function createRoutine({creatorId, isPublic, name, goal}) {

  try {
    const { rows: [routine] } = await client.query(`
    INSERT INTO routines ("creatorId", "isPublic", name, goal) 
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [creatorId, isPublic, name, goal]);
    
   
    return routine
}catch (error) {
    console.log ("Error in createRoutine function")
    throw error;
}


}

async function updateRoutine({id, ...fields}) {
}

async function destroyRoutine(id) {
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