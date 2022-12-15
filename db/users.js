const client = require("./client");
const bcrypt = require('bcrypt')

// database functions

// user functions
async function createUser({ username, password }) {

const SALT_COUNT = 10;
const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {rows: [ user ]} = await client.query(`
    INSERT INTO users(username, password)
    VALUES($1, $2)
    RETURNING *
    `, [username, hashedPassword]);
    delete user.password;
    console.log(user.username);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



async function getUser({ username, password }) {
  try {
    const {rows: [user]} = await client.query(`
    SELECT username
    FROM users
    WHERE username =$1
    AND password =$2;
  `, [username, password]);
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}




async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
    SELECT id, username
    FROM users
    WHERE id=$1;
    `, [userId]);
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}




async function getUserByUsername(username) {
  try {
    const {rows: [user]} = await client.query(`
    SELECT username
    FROM users
    WHERE username=$1;
    `, [username]);

    return user;
  } catch (error) {
    console.log('there was an error in getUserByUsername');
    console.error(error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
