const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb') // Example for postgres

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
 
testConnection()

//models
//FoodRestricion
const FoodRestriction = sequelize.define("FoodRestriction", {
    name: DataTypes.STRING,
    foodId: DataTypes.INTEGER,
});
//Userrestriction
const UserRestriction = sequelize.define("UserRestriction",{
    name: DataTypes.STRING,
    userID: DataTypes.STRING,
});
//Food
const Food = sequelize.define("Food",{
    PK: DataTypes.INTEGER,
    name: DataTypes.STRING,
    calories: DataTypes.DOUBLE,
    fat:DataTypes.DOUBLE,
    saturated_fat: DataTypes.DOUBLE,
    protein: DataTypes.DOUBLE,
    carbs: DataTypes.DOUBLE,
    ingerdients: DataTypes.STRING,
    halthfulness: DataTypes.STRING,
    servingSize: DataTypes.STRING,
});
//FavoriteFoodsBridge
const FavoriteFoodsBridge = sequelize.define("FavoriteFoodsBridge", {
    userID: DataTypes.STRING,
    foodID: DataTypes.INTEGER,
});
//User
const User = sequelize.define("User", {
    PK: DataTypes.STRING,
});
//FavoriteLocationsBridge
const FavoriteLocationsBridge = sequelize.define("FavoriteLocationsBridge", {
    userID: DataTypes.STRING,
    foodID: DataTypes.INTEGER,
});
//MealFoodBridge
const MealFoodBridge = sequelize.define("MealFoodBridge", {
    mealID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
});
//Meal
const Meal = sequelize.define("Meal", {
    PK: DataTypes.INTEGER,
    userID: DataTypes.STRING,
});
//LocationFoodBridge
const LocationFoodBridge = sequelize.define("LocationFoodBridge", {
    locationID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
    Date: DataTypes.STRING,
    Time: DataTypes.TIME,
});
//Location
const Location = sequelize.define("Location", {
    PK: DataTypes.INTEGER,
});
//LocationTimes
const LocationTimes = sequelize.define("LocationTimes", {
    locationID: DataTypes.INTEGER,
    day: DataTypes.INTEGER,
    breakfastTime: DataTypes.TIME,
    lunchTime: DataTypes.TIME,
    brunchTime: DataTypes.TIME,
    dinnerTime: DataTypes.TIME,
    openTime: DataTypes.TIME,
    closeTime: DataTypes.TIME,
});