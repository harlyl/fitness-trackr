const client = require("./client");
const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({ username, password }) {

  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users (username, password) 
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username;
    `, [username, hashedPassword]);
    

    return user
}catch (error) {
    console.log ("Error in createUser function")
    throw error;
}
}
  


async function getUser({ username, password }) {
  if (!username || !password){
    return
  }
  try {
    const user = await getUserByUsername(username)

    const hashedPassword = user.password
    const passwordsMatch = await bcrypt.compare(password, hashedPassword);
 
    if (passwordsMatch) {
delete user.password;
return user

    } else {
      return null;
    }

   } catch (error) {
    console.log ("Error in getUser")
    throw error;
  }
}



async function getUserById(userId) {

//  console.log ("userId>>>>>>",userId)
  try {
    const {rows: user}  = await client.query(`
    SELECT * FROM users
    WHERE id = $1;
    `, [userId]);

    if (!user){
      return null
    } else{
    delete user[0].password;
    //console.log( "GETUSERBYID#############", rows[0])

    return user[0]
    }
  } catch (error) {
    console.log ("Error in getUserById")
    throw error;
  }

}

async function getUserByUsername(username) {

  try {
    const { rows: user } = await client.query(`
    SELECT * FROM users
    WHERE username = $1;
    `, [username]);
    
   
    
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
