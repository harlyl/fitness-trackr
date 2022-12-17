const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {

  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users (username, password) 
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password]);
    
    delete user.password
    return user
}catch (error) {
    console.log ("Error in createUser function")
    throw error;
}
}
  


async function getUser({ username, password }) {
  try {
    const { rows: [user] } = await client.query(`
    SELECT * FROM users
    WHERE username = '${username}' AND password = '${password}';
    `);
    
    if (!user.password){
      return null
    } 
    
   else {
      console.log ("LLLLLLL",user.password)
    delete user.password;
    return user}
  
    } catch (error) {
    console.log ("Error in getUser")
    throw error;
  }
}



async function getUserById(userId) {

  try {
    const {rows}  = await client.query(`
    SELECT * FROM users
    WHERE id = '${userId}';
    `);

    delete rows[0].password;
    //console.log( "GETUSERBYID#############", rows[0])

    return rows[0]
  
  } catch (error) {
    console.log ("Error in getUserById")
    throw error;
  }

}

async function getUserByUsername(username) {

  try {
    const { rows: user } = await client.query(`
    SELECT * FROM users
    WHERE username = '${username}';
    `);
    
   
    
    //console.log ("###################USER BY USERNAME", user)
    return user[0]
  
  } catch (error) {
    console.log ("Error in getUserByUsername")
    throw error;
  }

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
