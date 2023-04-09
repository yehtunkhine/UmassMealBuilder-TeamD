const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://DB_USERNAME:DB_PASSEORD@DB_IP_ADDRESS/DB_NAME')

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
 
testConnection()
  