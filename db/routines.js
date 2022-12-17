const { CommandCompleteMessage } = require('pg-protocol/dist/messages');
const client = require('./client');


async function getRoutineById(id){
  try {
    const { rows: [routine] } = await client.query(`
    SELECT * FROM routines
    WHERE id = '${id}';
    `);

    
  
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
    SELECT *
    FROM users
    INNER JOIN routines
    ON users.id = routines."creatorId";
    `)
    //console.log ("getAllRoutinesXXXXXXXXXX....Routines", routines)
    

    const {rows: activity} = await client.query(`
    SELECT * 
    FROM routine_activities
    INNER JOIN activities
    ON routine_activities."activityId" = activities.id;
    `);
    
    //console.log ("getAllRoutinesXXXXXXXXXX. activity", activity )
    let obj= {}
    let result = []
    for  (let i = 0; i<routines.length; i++){
      let currRoutine = routines[i]
      let currRoutineId = routines[i].id;
      for (let j = 0; j<activity.length; j++){
        let currActRoutineId = activity[j].routineId
        let currActRoutine = activity[j]
        if (currRoutineId === currActRoutineId){
          
          currActRoutine.id = currActRoutine.activityId
          currRoutine.creatorName = currRoutine.username
        //  console.log ("currRoutine>>>>>>>", currRoutine)
        
          delete currRoutine.username
          delete currRoutine.password
          delete currActRoutine.activityId
          obj = currRoutine
          obj.activities = [currActRoutine]
          result.push(obj)
        }
      }
    }

    // const result = routines.map((routine)=>{
    //   if (routine.id === activity.map((act)=>{
    //     return act.id})) {
    //     routine.activity = act
    //   }
    //   return routine
    // });
//console.log (">>>>>>>&&&&&&%%%%%&&&&&&&&&&>>>>>>>>>RESULT", result)
    // const {rows} = await client.query(`
    // SELECT * FROM users
    // WHERE id = ${routines[0].creatorId};
    // `)
    // console.log ("getAllRoutinesXXXXXXXXXX. USERNAME", rows)

  //  routines[0].id = routine.activityId
  //  routines[0].creatorName = rows[0].username
  //  const activity = routine
  //  activity.name = activities[0].name
  //  activity.description= activities[0].description

  //  routines[0].activity = activity
  //  console.log ('XXXXXXXXXXXXXXXXXXXXXXXX', activity)

   //console.log ("getAllRoutinesXXXXXXXXXX. Routines", routines)
  return result;
    } catch (error) {
    console.log ("Error in getAllRoutines")
    throw error;
  }
}

async function getAllRoutinesByUser(user) {
 // console.log ("getAllRoutinesbyUser", user.username)
  try {
    const {rows} = await client.query(`
    SELECT * FROM users
    WHERE username = '${user.username}';
    `)
   // console.log ("getAllRoutinesbyUser ROWS", rows[0])

    const { rows: routines } = await client.query(`

    SELECT * FROM routines
    INNER JOIN routine_activities
    ON routines.id = routine_activities."routineId"
    INNER JOIN activities
    ON routine_activities."activityId" = activities.id
    INNER JOIN users
    ON routines."creatorId" = ${rows[0].id};
    `);
   
  //   const posts = await Promise.all(postIds.map(
  //     post => getPostById( post.id )
  // ));
    const routines2 = await Promise.all(routines.map((routine)=>{
      
      routine.activities = { 
      "id" : routine.activityId,
      "name" : routine.name,
      "description" : routine.description,
      "duration" : routine.duration,
      "count" : routine.count,
      "routineActivityId" : routine.id,
      "routineId" : routine.routineId
      }
      routine.creatorName = routine.username
      routine.id = routine.routineId
      delete routine.password
      delete routine.activityId
      delete routine.name
      delete routine.description
      delete routine.duration
      delete routine.count
      delete routine.routineId
      delete routine.username
      return routine
    }))

    const activityArr = routines2.map((routine)=>{
      return (routine.activities)
    })

    const noActivityArr = routines2.map((routine)=>{
      delete routine.activities
      return (routine)
    })
    
    const combinedRoutines = noActivityArr.map((routine)=>({...routine, 
      activities: activityArr.filter((f=>f.routineId === routine.id))}))

     // console.log("NNNNNNNNNNNNNNNN", combinedRoutines[0])
   
  return combinedRoutines;
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
    WHERE username ='${username}';
    `)
  //  console.log ("getPUBLICRoutinesbyUser ROWS", rows[0])

    const { rows: routines } = await client.query(`

    SELECT * FROM routines
    INNER JOIN routine_activities
    ON routines.id = routine_activities."routineId"
    INNER JOIN activities
    ON routine_activities."activityId" = activities.id
    INNER JOIN users
    ON routines."creatorId" = ${rows[0].id}
    WHERE routines."isPublic" = true;
    `);
   
    
    const routines2 = await Promise.all(routines.map((routine)=>{
      
      routine.activities = { 
      "id" : routine.activityId,
      "name" : routine.name,
      "description" : routine.description,
      "duration" : routine.duration,
      "count" : routine.count,
      "routineActivityId" : routine.id,
      "routineId" : routine.routineId
      }
      routine.creatorName = routine.username
      routine.id = routine.routineId
      delete routine.password
      delete routine.activityId
      delete routine.name
      delete routine.description
      delete routine.duration
      delete routine.count
      delete routine.routineId
      delete routine.username
      return routine
    }))

    const activityArr = routines2.map((routine)=>{
      return (routine.activities)
    })

    const noActivityArr = routines2.map((routine)=>{
      delete routine.activities
      return (routine)
    })
    
    const combinedRoutines = noActivityArr.map((routine)=>({...routine, 
      activities: activityArr.filter((f=>f.routineId === routine.id))}))

    //  console.log("NNNNNNNNNNNNNNNN", combinedRoutines[0])
   
  return combinedRoutines;
    } catch (error) {
    console.log ("Error in getPublicRoutinesByUser")
    throw error;
  }
}

async function getAllPublicRoutines() {

  // INNER JOIN activities
  // ON routine_activities."activityId" = activities.id
  // INNER JOIN users
  // ON routines."creatorId" = users.id

  try {
    const { rows: routines } = await client.query(`
    SELECT * FROM routines
   
    INNER JOIN routine_activities
    ON routines.id = routine_activities."routineId"
    INNER JOIN activities
    ON routine_activities."activityId" = activities.id
    INNER JOIN users
    ON routines."creatorId" = users.id
    WHERE "isPublic" = true;
    `);
 //console.log ("getAllPublicRoutines>>>>>>>>>>>", routines)
//  const posts = await Promise.all(postIds.map(
//   post => getPostById( post.id )
// ));
 const routines2 = await Promise.all(routines.map((routine)=>{
      
  routine.activities = { 
  "id" : routine.activityId,
  "name" : routine.name,
  "description" : routine.description,
  "duration" : routine.duration,
  "count" : routine.count,
  "routineActivityId" : routine.id,
  "routineId" : routine.routineId
  }
  routine.creatorName = routine.username
  routine.id = routine.routineId
  delete routine.password
  delete routine.activityId
  delete routine.name
  delete routine.description
  delete routine.duration
  delete routine.count
  delete routine.routineId
  delete routine.username
  return routine
}))

const activityArr = routines2.map((routine)=>{
  return (routine.activities)
})

const noActivityArr = routines2.map((routine)=>{
  delete routine.activities
  return (routine)
})

const combinedRoutines = noActivityArr.map((routine)=>({...routine, 
  activities: activityArr.filter((f=>f.routineId === routine.id))}))

 // console.log("NNNNNNNNNNNNNNNN", combinedRoutines[0])

return combinedRoutines;

    } catch (error) {
    console.log ("Error in getAllPublicRoutines")
    throw error;
  }
}



async function getPublicRoutinesByActivity({id}) {

  console.log ("ALLPUBLICRoutinesbyActivity...ID", id)
  try {
    const { rows: routines } = await client.query(`

    SELECT * FROM routines
    INNER JOIN routine_activities
    ON routines.id = routine_activities."routineId"
    INNER JOIN activities
    ON routine_activities."activityId" = ${id}
    INNER JOIN users
    ON routines."creatorId" = users.id
    WHERE routines."isPublic" = true;
    `);
   
  //   const posts = await Promise.all(postIds.map(
  //     post => getPostById( post.id )
  // ));
    
    const routines2 = await Promise.all(routines.map((routine)=>{
      
      routine.activities = { 
      "id" : routine.activityId,
      "name" : routine.name,
      "description" : routine.description,
      "duration" : routine.duration,
      "count" : routine.count,
      "routineActivityId" : routine.id,
      "routineId" : routine.routineId
      }
      routine.creatorName = routine.username
      routine.id = routine.routineId
      delete routine.password
      delete routine.activityId
      delete routine.name
      delete routine.description
      delete routine.duration
      delete routine.count
      delete routine.routineId
      delete routine.username
      return routine
    }))

    const activityArr = routines2.map((routine)=>{
      return (routine.activities)
    })

    const noActivityArr = routines2.map((routine)=>{
      delete routine.activities
      return (routine)
    })
    
    const combinedRoutines = noActivityArr.map((routine)=>({...routine, 
      activities: activityArr.filter((f=>f.routineId === routine.id))}))

    console.log("NNNNNNNNNNPUBLICROUTINESBYACTIVITY", combinedRoutines)
   
  return combinedRoutines;
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
    
   console.log ("routine>>>>>>>>>>>>>",routine[0])
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
  WHERE "routineId" = ${id}
  RETURNING *;
  `)  
 // console.log (">>>>>>>>>>A", routine_activities)
  
  const { rows } = await client.query(`
  DELETE FROM routines
  WHERE id = ${id}
  RETURNING *;
`)

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