const client = require("./client")

// database functions

async function getAllActivities() {   
  try {
      const { rows } = await client.query(`
      SELECT * FROM activities;
      
      `);
     
    return rows;
      } catch (error) {
      console.log ("Error in getAllActivities")
      throw error;
    }
  }


async function getActivityById(id) {

  try {
    const { rows: [activity] } = await client.query(`
    SELECT * FROM activities
    WHERE id = ${id};
    `);
   
  return activity;
    } catch (error) {
    console.log ("Error in getActivityById")
    throw error;
  }
}

async function getActivityByName(name) {
console.log ("name", name)
  try {
    const {rows: [activity]} = await client.query(`
    SELECT * FROM activities
    WHERE name = '${name}';
    `);
    
  return activity;
    } catch (error) {
    console.log ("Error in getActivityByName")
    throw error;
  }


}

// select and return an array of all activities
async function attachActivitiesToRoutines(routines) {
  
}

// return the new activity


async function createActivity({name, description }) {
//console.log ("input to creatActivityyyyyyyyyy", name, description)

  try {
    const { rows } = await client.query(`
    INSERT INTO activities (name, description) 
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `, [name, description]);
    
  // console.log ("createdActivity,,,,,,,,,,,,,", rows)
    return rows
}catch (error) {
    console.log ("Error in createActivity function")
    throw error;
}


}

// don't try to update the id
// do update the name and description
// return the updated activity

async function updateActivity({ id, ...fields }) {

  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index +1 }`
).join(', ');

if (setString.length === 0) {
    return;
}
try {
    const { rows: [activity] } = await client.query(`
    UPDATE activities
    SET ${ setString }
    WHERE id=${ id }
    RETURNING *;
    `, Object.values(fields));

    return activity;
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
