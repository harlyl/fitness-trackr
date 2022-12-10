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
    return user.username
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
    console.log ("****getUser", user)
  
    delete user.password;

    return user
  
  
    } catch (error) {
    console.log ("Error in getUser")
    throw error;
  }
}



async function getUserById(userId) {
console.log ("userId", userId)
  try {
    const { user } = await client.query(`
    SELECT * FROM users
    WHERE id = '${userId}';
    `);

    console.log ("****getUserById", user)
  
    
    delete user.password;

    return user
  
  } catch (error) {
    console.log ("Error in getUserById")
    throw error;
  }

}

async function getUserByUsername(userName) {

  try {
    const { user } = await client.query(`
    SELECT * FROM users
    WHERE username = '${username}';
    `);

    console.log ("****getUserByUsername", user)
  
    
    delete user.password;

    return user
  
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
