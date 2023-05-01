const { Sequelize, DataTypes, Model, json } = require('sequelize');

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb')

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
 
testConnection()

const User = sequelize.define('User', {
  // Model attributes are defined here
  Uid: {
    type: DataTypes.STRING,
    // allowNull defaults to true
    allowNull: false,
    primaryKey: true
  },
  Name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Phone : {
    type: DataTypes.STRING,
    allowNull: true,
  },

}, {
  tableName: 'Users',
});

function createTable (){
  User.sync({ alter: true }).then(() => {
    console.log("Table created");
  }).catch((error) => {
    console.log(`There was an error: ${error}`);
  });
}

// createTable();


function createUser(newUser){
  User.create({ 
    Uid : newUser.uid,
    Name: newUser.displayName,
    Email: newUser.email,
    Phone : newUser.phoneNumber,
    Allergens: "None",
    DietaryRestrictions: "None",
  }).then((newAddedUser) => {
    console.log(`added to database: ${newAddedUser}`);
  }).catch((error) => {
    console.log(`There was an error: ${error}`);
  });
}

function getUser(user){
  let found = User.findByPk(user.uid).then((foundUser) => {
    console.log(`Found user: ${foundUser.Name}`);
    console.log(`Found user uid: ${foundUser.uid}`);
  }
  ).catch((error) => {
    console.log(`There was an error: ${error}`);
  }
  );
  return found;
}


