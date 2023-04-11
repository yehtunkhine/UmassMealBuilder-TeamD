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
},
{
    freezeTableName: true
});
//Userrestriction
const UserRestriction = sequelize.define("UserRestriction",{
    name: DataTypes.STRING,
    userID: DataTypes.STRING,
},
{
    freezeTableName: true
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
},
{
    freezeTableName: true
});
//FavoriteFoodsBridge
const FavoriteFoodsBridge = sequelize.define("FavoriteFoodsBridge", {
    userID: DataTypes.STRING,
    foodID: DataTypes.INTEGER,
},
{
    freezeTableName: true
});
//User
const User = sequelize.define("User", {
    PK: DataTypes.STRING,
},
{
    freezeTableName: true
});
//FavoriteLocationsBridge
const FavoriteLocationsBridge = sequelize.define("FavoriteLocationsBridge", {
    userID: DataTypes.STRING,
    foodID: DataTypes.INTEGER,
},
{
    freezeTableName: true
});
//MealFoodBridge
const MealFoodBridge = sequelize.define("MealFoodBridge", {
    mealID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
},
{
    freezeTableName: true
});
//Meal
const Meal = sequelize.define("Meal", {
    PK: DataTypes.INTEGER,
    userID: DataTypes.STRING,
},
{
    freezeTableName: true
});
//LocationFoodBridge
const LocationFoodBridge = sequelize.define("LocationFoodBridge", {
    locationID: DataTypes.INTEGER,
    foodID: DataTypes.INTEGER,
    Date: DataTypes.STRING,
    Time: DataTypes.TIME,
},
{
    freezeTableName: true
});
//Location
const Location = sequelize.define("Location", {
    PK: DataTypes.INTEGER,
},
{
    freezeTableName: true
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
},
{
    freezeTableName: true
});


//relations -- sorted by outgoing direction
//FoodRestriction relations
FoodRestriction.hasOne(Food);
FoodRestriction.belongsTo(Food);
//UserRestriction relations
UserRestriction.hasOne(User);
UserRestriction.belongsTo(User);
//Food relation
Food.hasMany(FoodRestriction);
Food.hasMany(FavoriteFoodsBridge);
Food.hasMany(MealFoodBridge);
Food.hasMany(LocationFoodBridge);
//favoritefoodsbridge relation
FavoriteFoodsBridge.hasOne(Food);
FavoriteFoodsBridge.hasOne(User);
FavoriteFoodsBridge.belongsTo(Food);
FavoriteFoodsBridge.belongsTo(User);
//User relations
User.hasMany(UserRestriction);
User.hasMany(FavoriteFoodsBridge);
User.hasMany(Meal);
//favoriteLocationsbridge relations
FavoriteLocationsBridge.hasOne(Location);
FavoriteLocationsBridge.hasOne(User);
FavoriteLocationsBridge.belongsTo(Location);
FavoriteLocationsBridge.belongsTo(User);
//mealFoodBridge relations
MealFoodBridge.hasOne(Food);
MealFoodBridge.hasOne(Meal);
MealFoodBridge.belongsTo(Food);
MealFoodBridge.belongsTo(Meal);
//meal relations
Meal.hasOne(User);
Meal.hasMany(MealFoodBridge);
Meal.belongsTo(User);
//locationfoodbridge relations
LocationFoodBridge.hasOne(Food);
LocationFoodBridge.hasOne(Location);
LocationFoodBridge.belongsTo(Food);
LocationFoodBridge.belongsTo(Location);
//location relations
Location.hasMany(LocationFoodBridge);
Location.hasMany(FavoriteLocationsBridge);
Location.hasMany(LocationTimes);
//locationtimes relation
LocationTimes.hasOne(location);
LocationTimes.belongsTo(Location);