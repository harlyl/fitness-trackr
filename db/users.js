const client = require("./client");

const bcrypt = require('bcrypt');

// database functions

// user functions
async function createUser({...fields}) {

 // console.log (fields)
  const {username, password} = fields
  //console.log (username, password)
  const SALT_COUNT = 10;
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);

  try {
    const { rows: [user] } = await client.query(`
    INSERT INTO users (username, password) 
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING id, username;
    `, [username, hashedPassword]);
    
//console.log (user)
    return user
}catch (error) {
    console.log ("Error in createUser function")
    throw error;
}

}
  




async function getUser({ username, password }) {

 // console.log (username, password)
  if (!username || !password){
    return
  }
  try {
    const user = await getUserByUsername(username)
//console.log(user)
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
//console.log (username)
  try {
    const { rows: user } = await client.query(`
    SELECT * FROM users
    WHERE users.username = $1;
    `, [username]);
    
   
    
   // console.log (user[0])
    return user[0]
  
  } catch (error) {
    console.log ("Error in getUserByUsername")
    throw error;
  }
}



// async function getUserById(userId) {
//   try {
//     const { rows: [ user ] } = await client.query(`
//     SELECT id, username
//     FROM users
//     WHERE id=$1;
//     `, [userId]);
//     console.log(user);
//     return user;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// }




// async function getUserByUsername(username) {
//   try {
//     const {rows: [user]} = await client.query(`
//     SELECT *
//     FROM users
//     WHERE username=$1;
//     `, [username]);

//     console.log("getUserBYUSERNAME", user);

//     return user;
//   } catch (error) {
//     console.log('there was an error in getUserByUsername');
//     console.error(error);
//     throw error;
//   }
// }


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
