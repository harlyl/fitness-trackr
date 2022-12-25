const client = require("./client")

// database functions

async function getAllActivities() {   
  try {
      const { rows } = await client.query(`
      SELECT * FROM activities;
      `);
   // console.log ("???????////////////////ROWS GETALLACTIVITIES", rows)
    return rows;
      } catch (error) {
      console.log ("Error in getAllActivities")
      throw error;
    }
  }


async function getActivityById(id) {

  //console.log ("###########################getActivityById activity", id)
  try {
    const {rows: activity} = await client.query(`
    SELECT * FROM activities
    WHERE id = ${id};
    `);
   
    //console.log ("###########################getActivityById activityROWS", activity[0])
  return activity[0];
    } catch (error) {
    console.log ("Error in getActivityById")
    throw error;
  }
}

async function getActivityByName(name) {
//console.log ("getActivityByName name>>>>>>>>>", name)
  try {
    const {rows: activity} = await client.query(`
    SELECT * FROM activities
    WHERE name = '${name}';
    `);
   // console.log ("MMMMMMMMMMM>>>>", activity[0])
  return activity[0];
    } catch (error) {
    console.log ("Error in getActivityByName")
    throw error;
  }


}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  
  const routineArray = [...routines];
 // console.log(routineArray)
  const routineIds = routines.map((routine) => {return routine.id});
  //console.log (routineIds)
  if (routines.length === 0){
    return;
  }
  
  try{
    const {rows: activities} = await client.query(`
    SELECT activities.*, routine_activities.duration, routine_activities.count, 
    routine_activities.id AS "routineActivityId", routine_activities."routineId"
    FROM activities
    JOIN routine_activities ON routine_activities."activityId" = activities.id
    WHERE routine_activities."routineId" IN (${routineIds.map((routineId, index) => 
      ('$' + (index +1))).join(',')});
    `, routineIds);

    for (let routine of routineArray){
      const addActivities = activities.filter((activity) => routine.id === activity.routineId);
      routine.activities = addActivities;
      } 

   // console.log (routineArray)
    return await routineArray;
  } catch (error) {
    console.log("Error attaching activities to routines")
    throw error;
  }
}

// return the new activity


async function createActivity({name, description}) {
//console.log (name, description)

  try {
    const { rows } = await client.query(`
    INSERT INTO activities (name, description) 
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, description]);

   
 //console.log (rows[0])

   return rows[0];

}catch (error) {
    console.log ("^^^^^^^^^^^^^Error in createActivity function")
    throw error;
}


}



async function updateActivity(fields) {
console.log (fields)
  const {id, name, description} = fields
 console.log(id, name, description)

 

try {
  if (name){
    const {rows: nameChange}  = await client.query(`
    UPDATE activities
    SET name=$1
    WHERE id= ${id}
    RETURNING *;
    `, [name]);

  console.log(nameChange[0])
    return nameChange[0];

}   if (description){
  const {rows: descriptionChange}  = await client.query(`
  UPDATE activities
  SET description=$1
  WHERE id= ${id}
  RETURNING *;
  `, [description]);

  
  return descriptionChange[0];

}

} catch (error) {
   console.log ("Error in updateActivity function")
   throw error;
}
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
}
