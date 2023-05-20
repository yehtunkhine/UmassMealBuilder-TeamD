
import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, FavoriteFoodsBridge, MealFoodBridge, LocationFoodBridge, FavoriteLocationsBridge} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'
import moment from 'moment-timezone'
const app=express()
const port=3000

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
app.use(express.json())
express.urlencoded({ extended: true })
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});



/////////////////////////////////////////////////// USER ENDPOINTS /////////////////////////////////////////////////////////////////


//create user --works
async function createUser(userid,username, useremail, userphone){
  let doesExist = await fetchUserData(userid)
  if(doesExist == "[]"){
  const newUser=await User.create({userId: userid, name: username, email: useremail, phone: userphone});
  return JSON.stringify(newUser);
  }
  else{  
    return (userid+" already exists")

}
}

app.post('/createUser', (req, res)=>{
  (async function createAndSend(){
    let sendVal = await createUser(req.query.userId, req.query.name, req.query.email, req.body.phone)
    res.end(sendVal)
  })();
})



//delete user--works
async function deleteuser(userid){
  let doesExist=await fetchUserData(userid)
  if(doesExist=="[]"){
    return userid+" does not exist"
  }
  else{
  await User.destroy({
    where:{
      userId: userid,
    }
  });
  return userid + " is deleted"
  }
}


app.get('/deleteUser', (req,res)=>{
  (async function delUser(){
    let delVal=await deleteuser(req.query.userId)
    res.end(delVal)
  })();
})



//retrieve user data -- works
async function fetchUserData(userid){
    const users = await User.findAll({
      where: {
        userId: userid,
      }
    });
  return JSON.stringify(users);
}

app.get('/getUser', (req, res) =>{
  (async function getUser(){
    let users = await fetchUserData((req.query.userId))
    if(users=="[]"){
      res.end(JSON.stringify(req.query.userId+" does not exist"))
    }
    else{
    res.end(users)
    }
  })();
})




//create user restriction--works
async function createUserRestriction(userid, restrictons){
  let doesUserExist=await fetchUserData(userid)
 // let doesRestrictionExist=await
  if(doesUserExist=="[]"){
    return userid+" does not exist"
  }
  else{
  const new_restrict= await UserRestriction.create({userId:userid, restriction:restrictons});
  return JSON.stringify(new_restrict)
  }
}
app.post('/createUserRestriction', (req,res)=>{
  (async function createRestrict(){
    let sendVal=await createUserRestriction((req.query.userId), (req.query.restriction))
    res.end(sendVal)
  })();
})



//fetch user restrictions--works
async function fetchUserRestrictions(userid){
  const user_data= await UserRestriction.findAll({
    where:{
        userId: userid,
      }
    });
  return JSON.stringify(user_data);
}

app.get('/getUserRestrictions', (req, res)=>{
  (async function getUserRestrictions(){
    let restrict = await fetchUserRestrictions((req.query.userId))
    res.end(restrict)
  })();
})

//delete user restriction--works
async function deleteUserRestriction(userid, user_rest){
  let doesExist = await fetchUserRestrictions(userid)
  if(doesExist == "[]"){
    return userid+" has no restrictions"
  }
  else{
    await UserRestriction.destroy({
      where:{
        userId:userid,
        restriction:user_rest
      }
    })
    return userid+" had deleted restriction "+user_rest
  }
}


app.get('/deleteuserRestriction', (req,res)=>{
  (async function deleteRest(){
    let delVal=await deleteUserRestriction(req.query.userId, req.query.restriction)
    res.end(delVal)
  })();
})



//create fav foods--works
async function createFavoriteFood(userid, foodid){
  const new_fav_food = await FavoriteFoodsBridge.create({userId:userid, foodId:foodid});
  return JSON.stringify(new_fav_food)
}


app.post('/createFavFood',(req,res)=>{
  (async function createfav(){
    let food_id=await Food.findOne({
      where:{
        name:req.query.name
      }
    })
    let sendVal=await createFavoriteFood((req.query.userId), food_id.foodId)
    res.end(sendVal)
  })();
})


//fetch favorite foods--works
async function fetchFavoriteFoods(userid){
  const fav_food_list = await FavoriteFoodsBridge.findAll({
    where:{
      userId: userid,
    }
  });


  return (fav_food_list);

}


app.get('/getFavoriteFoods', (req,res)=>{
  (async function getFavoriteFoods(){
    let favs= await fetchFavoriteFoods((req.query.userId))
    console.log(favs)
    if(favs.toString()==[].toString()){
      res.end(JSON.stringify(req.query.userId+" does not have favorites"))
    }
    else{
    res.end(JSON.stringify(favs))
    }
  })();
})

//deletefavfood--works
async function deleteFavFood(userid, foodid, name){
  let doesExist=await fetchFavoriteFoods(userid,foodid)
  if(doesExist.toString()==[].toString()){
    return userid+" has no favorites"
  }
  else{
    await FavoriteFoodsBridge.destroy({
      where:{
        userId:userid,
        foodId:foodid
      }
    })
    return userid+" has unfavorited " + name
  }
}


app.get('/deleteFavoriteFood', (req,res)=>{
  (async function deleteFav(){
    let food = await Food.findOne({
      where:{
        name: req.query.name
      }
    })
    let delVal = await deleteFavFood(req.query.userId, food.foodId, req.query.name)
    res.end(delVal)
  })();
})



//create meal
let MEALIDCOUNTER=1010100
async function createMeal(userid, foods){
  const new_meal= await Meal.create({mealId:MEALIDCOUNTER, userId:userid})
  MEALIDCOUNTER++
  async function findID(nameof){
    let ret=await Food.findOne({
      where:{
        name:nameof
      }
    })
    return ret.foodId
  }
  let foodID=findID(foods)
  MealFoodBridge.create({mealId:(MEALIDCOUNTER-1), foodId: foodID})
  
  return JSON.stringify(new_meal)
}


app.post('/createMeal', (req,res)=>{
  (async function createM(){

    let sendVal=await createMeal((req.query.userId), (req.query.foods))
    res.end(sendVal)
  })();
  
})


//fetch meals
async function fetchMeals(userid){
  async function fetchFoodInMeal(mealid){
    const food_in_meal = await MealFoodBridge.findAll({
      where:{
        mealID: mealid,
      }
    });
    return food_in_meal
  }
  const meals=await Meals.findAll({
    where:{
      userId:userid
    }
  })

  let all_meals=[]
  meals.forEach(meal=>{
    all_meals.push({mealId:meal.mealId, foods:fetchFoodInMeal(meal.mealId)})
  })
  return JSON.stringify(all_meals);

}

app.get('/getmeals', (req, res)=>{
  (async function getmeals(){
    let meal_ret=await fetchMeals((req.query.userId))
    res.end(meal_ret)
  })();
})

//fetch favorite locations

async function fetchfavoritelocations(userid){
  const favs= await favoriteLocationsBridge.findAll({
    where:{
      userID:userid,
    }
  });
  return JSON.stringify(favs);
}


app.get('/getfavoritelocations', (req,res)=>{
  (async function getfavoriteLocations(){
    let loc=await fetchfavoritelocations((req.query.userId))
    res.end(loc)
  })();
})

//////////////////////////////////////////////////////////// LOCATION ENDPOINTS ////////////////////////////////////////////////////

// Basic Find, Deletes
async function createLocation(name){
  if(name.length > 128){
      throw new Error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
  }

  const location = await Location.create({locationName: name});

  return location;
}

async function deleteLocationById(lid){
  await Location.destroy({
      where: {
          locationId: lid
      }
  });

  await LocationFoodBridge.destroy({
      where: {
          locationId: lid
      }
  });
}

async function deleteLocationByName(name){
  const locations = (await Location.findAll({
      where: {
          locationName: name
      }
  })).map((l) => l.locationId);

  locations.forEach((id) => deleteLocationById(id));
}

async function findLocationByName(name){
  if(name.length > 128){
      throw new Error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
  }

  const locations = await Location.findAll({
      where: {locationName: name}
  });

  return locations;
}

async function findLocationById(id){
  const location = await Location.findOne({
      where: {locationId: id}
  });

  return location;
}

async function findLocationIdsByName(name){
  if(name.length > 128){
      throw new Error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
  }

  const locations = (await Location.findAll({
      where: {locationName: name}
  })).map((l) => l.locationId);

  return locations;
}

// Functions involving Food/FoodLocationBridge

// TODO: TEST
async function findAllLocationsServingFoodItemsById(foodItemIds){
  const locationIds = (await LocationFoodBridge.findAll({
          where: {
              foodId: {[Op.in]: foodItemIds},
              Date: {[Op.gte]: moment().tz("America/New_York").format('YYYY-MM-DD')}
          },
          attributes: ['locationId']
  })).map((l) => l.locationId);

  const locations = await Location.findAll({
      where: {locationId: {[Op.in]: locationIds}}
  });

  return locations;
}

async function findAllLocationsServingFoodItemsByNames(foodNameList){
  const foodIds = (await Food.findAll({
      where: {name: {[Op.in]: foodNameList}},
      attributes: ["foodId"]
  })).map((f) => f.foodId);
  
  return await findAllLocationsServingFoodItemsById(foodIds);
}


// TODO: TEST
async function findAllLocationsServingFoodItemOnDate(foodItem, date){
  let locations = (await LocationFoodBridge.findAll({
      where: {
          [Op.and]: [
              {foodId: foodItem},
              {Date: date}
          ]
      },
      attributes: ["locationId"]
  })).map((location) => location.locationId);

  let locationObjects = await Location.findAll({
      where: {
          locationId: {[Op.in]: locations}}
  });    

  return locationObjects;
}

//TODO: TEST
async function findAllLocationsServingFoodItemOnDateAtTime(foodItem, date, time){
  let locations = (await LocationFoodBridge.findAll({
      where: {
          [Op.and]: [
              {foodId: foodItem},
              {Date: date},
              {Time: time}
          ]
      },
      attributes: ["locationId"]
  })).map((location) => location.locationId);

  let locationObjects = await Location.findAll({
      where: {locationId: {[Op.in]: locations}}
  });
  
  return locationObjects;
}

// User Favorite Location Functions
async function findFavoriteLocationsForUser(uid){
  const user = await User.findOne({
      where: {userId: uid}
  });

  if(user == null){
      throw new Error("No such user exists");
  }

  return (await user.getLocations()).map((l) => {return {locationId: l.locationId, locationName: l.locationName, }});
}

async function addNewFavoriteLocationForUser(uid, lid){
  const user = await User.findOne({
      where: {userId: uid}
  });
  const location = await Location.findOne({
      where: {locationId: lid}
  });

  if(user == null){
      throw new Error("No such user exists");
  }

  if(location == null){
      throw new Error("No such location exists.");
  }

  let success = false;
  await user.addLocation(location).then(() => {success = true;});

  if(success == false){
      throw new Error("Could not add location '" + location.locationName + "' as favorite location for user with id '" + user.userId + "'");
  }
}

async function deleteFavoriteLocationFromUser(uid, lid){
  const user = await User.findOne({
      where: {userId: uid}
  });

  const location = await Location.findOne({
      where: {locationId: lid}
  });

  let success = false;
  await user.removeLocation(location).then(() => {success = true;});

  if(success == false){
      throw new Error("Could not add location '" + location.locationName + "' as favorite location for user with id '" + user.userId + "'");
  }
}


// Location Times Functions
async function findAllTimesForLocation(lid){
  const location = await Location.findOne({
      where: {locationId: lid}
  });

  if(location == null){
      throw new Error("No such location exists");
  }

  const locationTimes = await LocationTimes.findAll({
      where: {locationId: lid}
  });

  return locationTimes;
}

async function findTimesForLocationOnDay(dayOfWeek, lid){
  const location = await Location.findOne({
      where: {locationId: lid}
  });

  if(location == null){
      throw new Error("No such location exists");
  }

  const time = LocationTimes.findOne({
      where: {
          locationId: lid,
          day: dayOfWeek
      }
  });

  return time;
}

async function createLocationTimesForDay(lid, dayOfWeek, open, close){
  const locationTime = await LocationTimes.findOne({
      where: {
          [Op.and]: {
              locationId: lid,
              day: dayOfWeek
          }
      }
  });

  if(locationTime != null){
      await locationTime.update({openTime: open, closeTime: close});
  }else{
      await LocationTimes.create({
          locationId: lid,
          day: dayOfWeek,
          openTime: open,
          closeTime: close
      });
  }
}

async function createTimesForEveryDayOfWeekForLocation(lid, open, close){
  const location = Location.findOne({
      where: {
          locationId: lid
      }
  });

  if(lid == null){
      throw new Error("No such location exists");
  }

  for(let i = 0; i < 7; i++){
      await createLocationTimesForDay(lid, i, open, close);    
  }
}

async function setMealTimeForLocationOnDay(lid, timeLabel, time, dayOfWeek){
  const allowedLabels = ['openTime', 'closeTime', 'dinnerTime', 'brunchTime', 'lunchTime', 'breakfastTime'];
  if(!allowedLabels.includes(timeLabel)){
      throw new Error("No location may have a time labeled '" + timeLabel + "'");
  }

  const location = await Location.findOne({
      where: {locationId: lid}
  });

  if(location == null){
      throw new Error("No such location exists.");
  }

  let locationTimeRow = await LocationTimes.findOne({
      where: {
          [Op.and]: {
              locationId: lid,
              day: dayOfWeek
          }
      }
  });

  if(locationTimeRow == null){
      locationTimeRow = await LocationTimes.create({
          locationId: lid,
          day: dayOfWeek,
          openTime: "12:00 AM",
          closeTime: "11:59 PM"
      });
  }

  await locationTimeRow.update({[timeLabel]: time});
}

async function deleteLocationTimeRowForDay(lid, dayOfWeek){
  const location = await Location.findOne({
      where: {
          locationId: lid
      }
  });

  if(location == null){
      return;
  }

  await LocationTimes.destroy({
      where: {
          [Op.and]: {
              locationId: lid,
              day: dayOfWeek
          }
      }
  });
}

async function deleteAllLocationTimes(lid){
  await LocationTimes.destroy({
      where: {
          locationId: lid
      }
  });
}

// -------------------------
// Rest API
// -------------------------

app.post('/createLocation', (req, res) => {
  let name = req.query.locationName;

  (async function anon(){
      let sendVal = await createLocation(name);
      res.end(JSON.stringify(sendVal))
  })();
});

app.delete('/deleteLocationById', (req, res) => {
  let id = req.query.locationId;

  (async function anon() {
      try{
          deleteLocationById(id)
          res.end("Success");
      }catch(e){
          res.end(e.message);
      }
  })();
});

app.delete('/deleteLocationByName', (req, res) => {
  let name = req.query.locationName;

  (async function anon(){
      try{
          await deleteLocationByName(name);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findLocationByName', (req, res) => {
  let name = req.query.locationName;

  (async function anon(){
      try{
          let locations = await findLocationByName(name);
          res.end(JSON.stringify(locations));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findLocationById', (req, res) => {
  let id = req.query.locationId;

  (async function anon(){
      try{
          let location = await findLocationById(id);
          res.end(JSON.stringify(location));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findLocationIdsByName', (req, res) => {
  let name = req.query.locationName;

  (async function anon(){
      try{
          let locationIds = await findLocationIdsByName(name);
          res.end(JSON.stringify(locationIds));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findAllLocationsServingFoodItemsById', (req, res) => {
  let foodItems = req.query.foodIds;

  (async function anon(){
      try{
          let locations = await findAllLocationsServingFoodItemsById(foodItems);
          res.end(JSON.stringify(locations));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findAllLocationsServingFoodItemsByNames', (req, res) => {
  let foodNames = req.query.foodNames;

  (async function anon(){
      try{
          let locations = await findAllLocationsServingFoodItemsByNames(foodNames);
          res.end(JSON.stringify(locations));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findAllLocationsServingFoodItemOnDate', (req, res) => {
  let foodId = req.query.foodId;
  let date = moment(req.query.date).format('YYYY-MM-DD');

  console.log(foodId);
  console.log(date);
  
  (async function anon(){
      try{
          let locations = await findAllLocationsServingFoodItemOnDate(foodId, date);
          res.end(JSON.stringify(locations));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findAllLocationsServingFoodItemOnDateAtTime', (req, res) => {    
  let foodItem = req.query.foodId;
  let date = req.query.date;
  let time = req.query.time;

  (async function anon(){
      try{
          let locations = await findAllLocationsServingFoodItemOnDateAtTime(foodItem, date, time);
          res.end(JSON.stringify(locations));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findFavoriteLocationsForUser', (req, res) => {
  let uid = req.query.userId;
  (async function anon(){
      try{
          let locations = await findFavoriteLocationsForUser(uid);
          res.end(JSON.stringify(locations));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.post('/addNewFavoriteLocationForUser', (req, res) => {
  let uid = req.query.userId;
  let lid = req.query.locationId;

  (async function anon(){
      try{
          await addNewFavoriteLocationForUser(uid, lid);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.delete('/deleteFavoriteLocationFromUser', (req, res) => {
  let uid = req.query.userId;
  let lid = req.query.locationId;

  (async function anon(){
      try{
          await deleteFavoriteLocationFromUser(uid, lid);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findAllTimesForLocation', (req, res) => {
  let lid = req.query.locationId;

  (async function anon(){
      try{
          let times = await findAllTimesForLocation(lid);
          res.end(JSON.stringify(times));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.get('/findTimesForLocationOnDay', (req, res) => {
  let lid = req.query.locationId;
  let day = req.query.day;

  (async function anon(){
      try{
          let time = await findTimesForLocationOnDay(day, lid);
          res.end(JSON.stringify(time));
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.post('/createLocationTimesForDay', (req, res) => {
  let lid = req.query.locationId;
  let day = req.query.day;
  let open = req.query.openTime;
  let close = req.query.closeTime;

  (async function anon(){
      try{
          await createLocationTimesForDay(lid, day, open, close);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.post('/createTimesForEveryDayOfWeekForLocation', (req, res) => {
  let lid = req.query.locationId;
  let open = req.query.openTime;
  let close = req.query.closeTime;

  (async function anon(){
      try{
          await createTimesForEveryDayOfWeekForLocation(lid, open, close);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.put('/setMealTimeForLocationOnDay', (req, res) => {
  let lid = req.query.locationId;
  let timeLabel = req.query.timeLabel;
  let time = req.query.time;
  let day = req.query.day;

  (async function anon(){
      try{
          await setMealTimeForLocationOnDay(lid, timeLabel, time, day);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.delete('/deleteLocationTimeRowForDay', (req, res) => {
  let lid = req.query.locationId;
  let day = req.query.day;

  (async function anon(){
      try{
          await deleteLocationTimeRowForDay(lid, day);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});

app.delete('/deleteAllLocationTimes', (req, res) => {
  let lid = req.query.locationId;

  (async function anon(){
      try{
          await deleteAllLocationTimes(lid);
          res.end("Success");
      }
      catch(e){
          res.end(e.message);
      }
  })();
});


//////////////////////////////////////////////////////// FOOD ITEM ENDPOINTS ///////////////////////////////////////////////////////////


async function findFood(key, value) { //find food with given key and value
  let food = await Food.findOne({
      where: {
          [key]: value
      }
  });
  if (food === null) return null;
  else {
      return {
          foodId: food.foodId,
          name: food.name,
          calories: food.calories,
          fat: food.fat,
          saturatedFat: food.saturatedFat,
          protein: food.protein,
          carbs: food.carbs,
          category: food.category,
          ingredients: food.ingredients,
          healthfulness: food.healthfulness,
          servingSize: food.servingSize
      };
  }
}

async function findLocationFoodBridges(key, value, allergenRestrictionStr, nonAllergenRestrictionStr) { //find restrictions with given key, value, and restrictions
  const list = [];
  let bridges = [];

  if (allergenRestrictionStr === "" && nonAllergenRestrictionStr === "") {
      bridges = await LocationFoodBridge.findAll({
          where: {[key]: value}
      });
  }
  else {
      const allergenRestrictionStrArr = allergenRestrictionStr.split(", ");
      const nonAllergenRestrictionStrArr = nonAllergenRestrictionStr.split(", ");
      const allergenRestrictionObjs = await FoodRestriction.findAll({
          where: {
              restriction: {
                  [Op.or]: allergenRestrictionStrArr
              }
          }
      });

      const nonAllergenRestrictionObjs = await FoodNonAllergenRestriction.findAll({
          where: {
              restriction: {
                  [Op.or]: nonAllergenRestrictionStrArr
              }
          }
      });
      //get food ids from objs
      function getFoodIdsFromObjArr(objArr) {
          const retArr = [];
          for (let i = 0; i<objArr.length; i++) {
              retArr.push(objArr[i].foodId);
          }
          return retArr;
      }
      const allergenFoodIds = getFoodIdsFromObjArr(allergenRestrictionObjs);
      const nonAllergenFoodIds = getFoodIdsFromObjArr(nonAllergenRestrictionObjs);

      if (nonAllergenFoodIds.length === 0) { //if not non allergens
          if (nonAllergenRestrictionStr === "") { //if none inputted
              bridges = await LocationFoodBridge.findAll({
                  where: {
                      [key]: value,
                      [Op.not]: [{
                          foodId: {
                              [Op.or]: allergenFoodIds
                          }
                      }]
                  }
              });
          }
          else return []; //no non allergen with inputted name
      }
      else { //if either only non-allergens or both
          //filter allergens from non-allergens
          const filteredFoodIds = nonAllergenFoodIds.filter(id => !allergenFoodIds.includes(id));
          bridges = await LocationFoodBridge.findAll({
              where: {
                  [key]: value,
                  foodId: {
                      [Op.or]: filteredFoodIds
                  }
              }
          });
      }
  }

  bridges.forEach(bridge => {
      list.push({
          Date: bridge.Date,
          Time: bridge.Time,
          foodId: bridge.foodId,
          locationId: bridge.locationId
      });
  });

  return list;
}

async function findFoodsAtLocationOnDate(locationId, date, allergenRestrictionStr, nonAllergenRestrictionStr) {
  let bridgeList = await findLocationFoodBridges('locationId', locationId, allergenRestrictionStr, nonAllergenRestrictionStr);
  let retObj = {'Breakfast': [], 'Lunch': [], 'Dinner': [], 'Late Night': []};
  if (bridgeList.length === 0) return retObj; //If no relevant foods
  for (let i = 0; i<bridgeList.length; i++) { //loop through all bridges
      let bridge = bridgeList[i]; //current bridge
      if (bridge.Date === date) { //if date matches
          let food = await findFood('foodId', bridge.foodId); //find food of bridge
          if(retObj.hasOwnProperty(bridge.Time)) { //if in current time
              let categoryFound = false; //cateogry exists flag
              retObj[bridge.Time].forEach(categoryObj => { //loop through category objects
                  if (categoryObj.category === food.category) { //if category is a match with current food, add to list
                      categoryFound = true;
                      (categoryObj.recipes).push(
                          {name: food.name, foodId: food.foodId}
                      )
                  }
              });
              if (!categoryFound) { //if no category objects matched, create new category object
                  retObj[bridge.Time].push({
                      'category': food.category,
                      'recipes': [{name: food.name, foodId: food.foodId}]
                  });
              }
          }
      }
  }
  return retObj;
}

// -------------------------
// FOOD Rest API
// -------------------------

app.post('/createFood', (req, res) => {
  (async function createAndSend(){
      const data = req.body;
      const duplicate = await Food.findOne({
          where: {
              name: data.name
          }
      });
      if (duplicate !== null) res.send('ERROR: ' + data.name + ' already exists!');
      else {
          const food = await Food.create({
              name: data.name,
              calories: data.calories,
              fat: data.fat,
              saturatedFat: data.saturatedFat,
              protein: data.protein,
              carbs: data.carbs,
              category: data.category,
              ingredients: data.ingredients,
              healthfulness: data.healthfulness
          });
          if (data.allergenRestrictions != "") {
              const allergenRestrictionArr = data.allergenRestrictions.split(", ");
              for (let i = 0; i<allergenRestrictionArr.length; i++) {
                  await FoodRestriction.create({
                      restriction: allergenRestrictionArr[i],
                      foodId: food.foodId
                  });
              }
          }
          if (data.nonAllergenRestrictions != "") {
              const nonAllergenRestrictionArr = data.nonAllergenRestrictions.split(", ");
              for (let i = 0; i<nonAllergenRestrictionArr.length; i++) {
                  await FoodNonAllergenRestriction.create({
                      restriction: nonAllergenRestrictionArr[i],
                      foodId: food.foodId
                  });
              }
          }
          res.send(data.name + ' Successfully Created with Food ID: ' + food.foodId);
      }
  })();
});

app.post('/deleteFood', (req, res) => {
  (async function createAndSend(){
      const data = req.body;
      const food = await Food.findOne({
          where: {foodId: data.foodId}
      });
      if (food === null) res.send('ERROR: No such food exists!');
      else {
          await Food.destroy({
              where: {foodId: data.foodId}
          });
          await LocationFoodBridge.destroy({
              where: {foodId: data.foodId}
          });
          await FoodRestriction.destroy({
              where: {foodId: data.foodId}
          });
          await FoodNonAllergenRestriction.destroy({
              where: {foodId: data.foodId}
          });
          res.send('Food with ID ' + data.foodId + ' Successfully Deleted.')
      }
  })();
});

app.post('/addFoodToLocation', (req, res) => {
  (async function createAndSend(){
      const data = req.body;
      const food = await findFood('foodId', data.foodId);
      if (food === null) res.send('ERROR: Food with ID ' + data.foodId + ' does not exist!');
      else {
          const location = await Location.findOne({
              where: {
                  locationName: data.diningHall
              }
          });
          if (location === null) res.send('ERROR: ' + data.diningHall + ' is not a location!');
          else {
              const duplicate = await LocationFoodBridge.findOne({
                  where: {
                      Date: data.date,
                      Time: data.time,
                      foodId: data.foodId,
                      locationId: location.locationId
                  }
              })
              if (duplicate !== null) res.send('ERROR: ' + food.name + ' is already linked to ' + data.diningHall + ' during ' + data.time + ' on ' + data.date + '!');
              else {
                  const bridge = await LocationFoodBridge.create({
                      Date: data.date,
                      Time: data.time,
                      foodId: data.foodId,
                      locationId: location.locationId
                  });
                  res.send('Succesfully Added ' + food.name + ' (Food ID: ' + data.foodId + ') to ' + data.diningHall + ' during ' + data.time + ' on ' + data.date + '.');
              }
          }
      }
  })();
});

app.post('/removeFoodFromLocation', (req, res) => {
  (async function createAndSend() {
      const data = req.body;
      const location = await Location.findOne({
          where: {
              locationName: data.diningHall
          }
      });
      if (location === null) res.send('ERROR: ' + data.diningHall + ' is not a location!');
      else {
          const bridge = await LocationFoodBridge.findOne({
              where: {
                  Date: data.date,
                  Time: data.time,
                  foodId: data.foodId,
                  locationId: location.locationId
              }
          })
          if (bridge === null) res.send('ERROR: No such bridge exists!');
          else {
              await LocationFoodBridge.destroy({
                  where: {
                      Date: data.date,
                      Time: data.time,
                      foodId: data.foodId,
                      locationId: data.locationId
                  }
              });
              res.send('Food successfully removed from location.');
          }
      }
  })();
});

app.get('/analysis', (req, res) => {
  (async function getAndSend() {
      const location = await Location.findOne({
          where: {
              locationName: req.query.diningHall
          }
      });
      if (location === null) res.end(req.query.diningHall + ' is not a location!');
      else {
          let resultObj = await findFoodsAtLocationOnDate(location.locationId, req.query.date, req.query.allergenRestrictions, req.query.nonAllergenRestrictions);
          let str = JSON.stringify(resultObj);
          res.end(str);
      }
  })();
});

app.get('/facts', (req, res) => {
  (async function getAndSend() {
      let food = await findFood('foodId', req.query.foodId);
      if (food === null) res.end('No such item exists!');
      else {
          delete food.foodId;
          let str = JSON.stringify(food);
          res.end(str);
      }
  })();
});

app.get('/getFoodIdFromName', (req, res) => {
  (async function getAndSend() {
      let food = await Food.findOne({
          where: {
              name: req.query.name
          }
      });
      if (food === null) res.end('No such item exists!');
      else {
          res.end(String(food.foodId));
      }
  })();
});

