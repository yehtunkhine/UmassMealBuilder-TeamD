import { Sequelize, DataTypes, STRING } from 'sequelize';

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
//FoodRestriction
const FoodRestriction = sequelize.define("FoodRestriction", {
    restriction: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    noPrimaryKey: true,
    timestamps: false
});

//UserRestriction
const UserRestriction = sequelize.define("UserRestriction",{
    restriction: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, 
{
    noPrimaryKey: true,
    timestamps: false
});

//Food
const Food = sequelize.define("Food",{
    foodId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(512),
        allowNull: false,
        defaultValue: "N/A"
    },
    calories: {
        type: DataTypes.DECIMAL(9,3).UNSIGNED,
        defaultValue: 0
    },
    fat:{
        type: DataTypes.DECIMAL(9,3).UNSIGNED,
        defaultValue: 0
    },
    saturated_fat: {
        type: DataTypes.DECIMAL(9,3).UNSIGNED,
        defaultValue: 0
    },
    protein: {
        type: DataTypes.DECIMAL(9,3).UNSIGNED,
        defaultValue: 0
    },
    carbs: {
        type: DataTypes.DECIMAL(9,3).UNSIGNED,
        defaultValue: 0
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: "N/A",
        allowNull: false
    },
    healthfulness: {
        type: DataTypes.SMALLINT,
        defaultValue: "0",
        allowNull: false
    },
    servingSize: {
        type: DataTypes.STRING(255),
        defaultValue: "N/A",
        allowNull: false
    },
    ingredients: {
        type: DataTypes.STRING(2048),
        defaultValue: "N/A",
        allowNull: false
    }
},
{
    timestamps: false
}
);

//FavoriteFoodsBridge
const FavoriteFoodsBridge = sequelize.define("FavoriteFoodsBridge", {},
{
    freezeTableName: true,
    noPrimaryKey: true,
    timestamps: false
});

//User
const User = sequelize.define('User', {
    // Model attributes are defined here
    userId: {
        type: DataTypes.STRING(64),
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone : {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, 
{
    timestamps: false
});

//FavoriteLocationsBridge
const FavoriteLocationsBridge = sequelize.define("FavoriteLocationsBridge", {},
{
    freezeTableName: true,
    timestamps: false,
    noPrimaryKey: true
});

//MealFoodBridge
const MealFoodBridge = sequelize.define("MealFoodBridge", {},
{
    freezeTableName: true,
    timestamps: false,
    noPrimaryKey: true
});

//Meal
const Meal = sequelize.define("Meal", {
    mealId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
},
{
    timestamps: false
});

//LocationFoodBridge
const LocationFoodBridge = sequelize.define("LocationFoodBridge", {
    foodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    locationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    Date: {
        type: DataTypes.DATEONLY,
        primaryKey: true
    },
    Time: {
        type: DataTypes.STRING,
        primaryKey: true
    },
},
{
    freezeTableName: true,
    timestamps: false,
});

//Location
const Location = sequelize.define("Location", {
    locationId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    locationName: {
        type: DataTypes.STRING(128),
        allowNull: false
    }
},
{
    timestamps: false
});

//LocationTimes
const LocationTimes = sequelize.define("LocationTimes", {
    day: {
        type: DataTypes.SMALLINT.UNSIGNED,
        allowNull: false
    },
    breakfastTime: DataTypes.TIME,
    lunchTime: DataTypes.TIME,
    brunchTime: DataTypes.TIME,
    dinnerTime: DataTypes.TIME,
    openTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    closeTime: {
        type: DataTypes.TIME,
        allowNull: false
    }
},
{
    freezeTableName: true,
    timestamps: false
});

// 1 user can have many meals, but each meal belongs to only one user
User.hasMany(Meal, {foreignKey: "userId"})
Meal.belongsTo(User, {foreignKey: "userId"});

// 1 location can have sevaral time, but each listed time is for only one location
Location.hasMany(LocationTimes, {foreignKey: "locationId", onDelete: 'CASCADE'});
LocationTimes.belongsTo(Location, {foreignKey: "locationId"});

// one food item can have many restrictions, but each instance of there being
// a restriction is only for one food
Food.hasMany(FoodRestriction, {foreignKey: "foodId"});
FoodRestriction.belongsTo(Food, {foreignKey: "foodId"});

// one user can have many restrictions, but each instance of there being
// a restriction is only for one user
User.hasMany(UserRestriction, {foreignKey: "userId"});
UserRestriction.belongsTo(User, {foreignKey: "userId"});

// Many to Many Relationshipds
// A food can be favorited by many users, and many users can favorite the same item
Food.belongsToMany(User, {through: "FavoriteFoodsBridge", foreignKey: "foodId"});
User.belongsToMany(Food, {through: "FavoriteFoodsBridge", foreignKey: "userId"});

// A location can be favorited by many users, and many users can favorite the same location 
Location.belongsToMany(User, {through: "FavoriteLocationsBridge", foreignKey: "locationId"});
User.belongsToMany(Location, {through: "FavoriteLocationsBridge", foreignKey: "userId"});

// A food can be in many meals, and many meals can use the same food
Food.belongsToMany(Meal, {through: "MealFoodBridge", foreignKey: "foodId"});
Meal.belongsToMany(Food, {through: "MealFoodBridge", foreignKey: "mealId"});

// A food can be served in many locations and many locations can serve many foods
// ----------------------------------------------------------------------------------------------------------------
// Removed Association because sequelize uses (foodId, locationId) as a composite primary key
// This means that sequelize will not allow any two rows to have the same foodId and locationId 
// Which is undesired, this is fixed by manually defining the foodId and locationId columns in LocationFoodBridge
// ---------------------------------------------------------------------------------------------------------------- 
// Food.belongsToMany(Location, {through: {model:'LocationFoodBridge', unique: false}, foreignKey: 'foodId'});
// Location.belongsToMany(Food, {through: {model: 'LocationFoodBridge', unique: false}, foreignKey: 'locationId'});

// remove automatically generated PK's
FavoriteFoodsBridge.removeAttribute('id')
FavoriteLocationsBridge.removeAttribute('id')
MealFoodBridge.removeAttribute('id')
LocationFoodBridge.removeAttribute('id')
FoodRestriction.removeAttribute('id')
UserRestriction.removeAttribute('id')
LocationTimes.removeAttribute('id')

// Push to db
// Change models above and then uncomment and run this file to make db changes
// force option will wipe database before updating tables!!!
// await sequelize.sync({force: true})


// await User.create({userId: "123456789", email: "random@email.com", phone: "555-555-5555", name: "John Doe"});
// await Location.create({locationName: "Worcester"});
// let oreo_ingredient = "Unbleached Enriched Flour (Wheat Flour Niacin, Reduced Iron, Thiamine Mononitrate {Vitamin B1}," + 
//     "Riboflavin {Vitamin B2}, Folic Acid), Sugar, Palm and/or Canola Oil, Cocoa (Processed with Alkali), High Fructose" +
//     "Corn Syrup, Leavening (Baking Soda, and/or Calcium Phosphate), Salt, Soy Lecithin, Chocolate, Artificial Flavor.";
// await Food.create({name: "Oreos", category: "Candy", calories: 140, fat: 7, protein: 0, carbs: 21, saturated_fat: 2, 
//             ingredients: oreo_ingredient, servingSize: "2 Cookies"});
// await LocationFoodBridge.create({locationId: 1, foodId: 1, Time: "Breakfast", Date: "2022-06-23"});
// await FavoriteLocationsBridge.create({userId: "123456789", locationId: 1});

// Export Models For Other Files
export {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, LocationFoodBridge, FavoriteLocationsBridge};