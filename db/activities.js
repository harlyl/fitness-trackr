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
  
}

// return the new activity


async function createActivity({name, description}) {
//console.log ("input to %%%%%%%%%%%%%%%%%%creatActivityyyyyyyyyy", name, description)

  try {
    const { rows } = await client.query(`
    INSERT INTO activities (name, description) 
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, description]);

   
 // console.log ("createdActivity%%%%%%%%%%%%%%%%%%,,,,,,,,,,,,,", rows[0]);

   return rows[0];

}catch (error) {
    console.log ("^^^^^^^^^^^^^Error in createActivity function")
    throw error;
}


}

// don't try to update the id
// do update the name and description
// return the updated activity

async function updateActivity(fields) {

  const {id, name, description} = fields
 // console.log("###############################fields", id, name, description)

 // const setString = Object.keys(fields).map(
 //   (key, index) => `"${ key }"=$${ index +1 }`
//).join(', ');

//if (setString.length === 0) {
 //   return;
//}
//console.log("###############################setString, id", name, description, id)

try {
  if (name){
    const {rows: nameChange}  = await client.query(`
    UPDATE activities
    SET name=$1
    WHERE id= ${id}
    RETURNING *;
    `, [name]);

  //  console.log("###############################ACTIvityROWS name", namechange[0])
    return nameChange[0];

}   if (description){
  const {rows: descriptionChange}  = await client.query(`
  UPDATE activities
  SET description=$1
  WHERE id= ${id}
  RETURNING *;
  `, [description]);

  //console.log("###############################ACTIvityROWS description", descriptionchange[0])
  return descriptionChange[0];

}

} catch (error) {
   // console.log ("Error in updateActivity function")
   // throw error;
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
