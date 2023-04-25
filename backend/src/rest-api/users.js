
import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'
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
//create user --works
async function createUser(username, useremail, userphone){
  const newUser=await User.create({userId: '13', name: username, email: useremail, phone: userphone});
  return JSON.stringify(newUser);
}

app.post('/createUser', (req, res)=>{
  (async function createAndSend(){
    let sendVal = await createUser((req.query.name), (req.query.email), (req.body.phone))
    res.end(sendVal)
  })();
})



//delete user--works
async function deleteuser(userid){
  await User.destroy({
    where:{
      userId: userid,
    }
  });
  return userid + " is deleted"
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
  users.forEach(console.log)
  return JSON.stringify(users);
}

app.get('/getUser', (req, res) =>{
  (async function getUser(){
    let users = await fetchUserData((req.query.userId))
    res.end(users)
  })();
})




//create user restriction--works
async function createUserRestriction(userid, restrictons){
  const new_restrict= await UserRestriction.create({userId:userid, restriction:restrictons});
  return JSON.stringify(new_restrict)
}
app.post('/createUserRestriction', (req,res)=>{
  (async function createRestrict(){
    let sendVal=await createUserRestriction((req.body.userId), (req.body.restriction))
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
    let restrict = await fetchUserRestrictions((req.body.userId))
    res.end(restrict)
  })();
})




//create fav foods
async function createFavoriteFood(userid, foodid){
  const new_fav_food = await FavoriteFoodsBridge.create({userId:userid, foodId:foodid});
  return JSON.stringify(new_fav_food)
}
app.post('createFavFood',(req,res)=>{
  (async function createfav(){
    let sendVal=await createFavoriteFood((req.body.userId), (req.body.foodId))
    res.end(sendVal)
  })();
})



//fetch favorite foods
async function fetchFavoriteFoods(userid){
  const fav_food_list = await FavoriteFoodsBridge.findAll({
    where:{
      userID: userid,
    }
  });

  return JSON.stringify(fav_food_list);
}
app.get('/getFavoriteFoods', (req,res)=>{
  (async function getFavoriteFoods(){
    let favs= await fetchFavoriteFoods((req.body.userId))
    res.end(favs)
  })();
})




//create meal
async function createMeal(userid, foods){
  const new_meal= await Meal.create({mealId:'1', userId:userid})
  foods.forEach(food=>{
    MealFoodBridge.create({mealId:'1', food: food.foodId})
  })
  return JSON.stringify(new_meal)
}
app.post('createMeal', (req,res)=>{
  (async function createM(){
    let sendVal=await createMeal((req.body.userId), (req.body.foods))
    res.end(sendval)
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
    let meal_ret=await fetchMeals((req.body.userId))
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
    let loc=await fetchfavoritelocations((req.body.userId))
    res.end(loc)
  })();
})




app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});