const client = require("./client");

// database functions

async function testDB() {
  try {

    client.connect();

    const {rows} = await client.query(`SELECT * FROM users;`)

    console.log(rows);
  } catch (error) {
    console.error(error);
  } 
}

testDB();


// user functions
async function createUser({ username, password }) {
  try {
    await client.query(`
    INSERT INTO users(username, password)
    VALUES($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;
    `, [username, password]);
  } catch (error) {
    console.error(error);
    throw error;
  }
  
}

async function getUser({ username, password }) {
  try {
    await client.query(`
    SELECT username
    FROM users
    WHERE username =$1
    AND password =$2;
  `, [username, password]);

  } catch (error) {
    console.error(error);
    throw error;
  }
}



console.log(getUser('albert', 'bertie99'));


async function getUserById(userId) {
  try {
    await client.query(`
    SELECT username
    FROM users
    WHERE id=$1;
    `, [userId]);
  } catch (error) {
    console.error(error);
    throw error;
  }
}



async function getUserByUsername(username) {
  
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
