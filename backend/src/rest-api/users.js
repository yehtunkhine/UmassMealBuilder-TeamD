
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
//create user --works--fix userId issue
async function createUser(username, useremail, userphone){
  const newUser=await User.create({userId: '3', name: username, email: useremail, phone: userphone});
  return JSON.stringify(newUser);
}

app.post('/createUser', (req, res)=>{
  (async function createAndSend(){
    let sendVal = await createUser(toString(req.body.name), toString(req.body.email), toString(req.body.phone))
    res.end(sendVal)
  })();
})



//delete user    not working
async function deleteuser(userId){
  //let user_del=fetchUserData(name);
  await User.destroy({
    where:{
      userId: userid,
    }
  });
  
}
app.get('/deleteUser', (req,res)=>{
  (async function delUser(){
    let delVal=await deleteuser(toString(req.body.userId))
    res.end(delval)
  })
})



//retrieve user data -- works
async function fetchUserData(username){
  let f_user =[];
  try{
    const users = await User.findAll({
      where: {
        name: username,
      }
    });
    console.log("users:")
    console.log(users)
    users.forEach(user =>{
      f_user.push({
        id: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
      })

    });
  } catch(err){
    console.log("Username does not exist");
  }
  return JSON.stringify(f_user);
}

app.get('/getUser', (req, res) =>{
  (async function getUser(){
    let users = await fetchUserData(toString(req.body.name))
    res.end(users)
  })();
})




//create user restriction--fix restrictions definition to include userid
async function createUserRestriction(userid, restrictons){
  const new_restrict= await UserRestriction.create({userId:userid, restriction:restrictions});
  return JSON.stringify(new_restrict)
}
app.post('/createUR', (req,res)=>{
  (async function createRestrict(){
    console.log(req.body.userId)
    let sendVal=await createUserRestriction(toString(req.body.userId), toString(req.body.restriction))
    res.end(sendVal)
  })
})



//fetch user restrictions
async function fetchUserRestrictions(userid){
  let user_rest= []
  try{
    const user_data= await UserRestriction.findAll({
      where:{
        userID: userid,
      }
    });
    user_data.forEach(restrict=>{
      user_rest.push({
        restriction: restrict.restriction,
      })
    });
  } catch(err){
    console.log("userId does not exist or has no restrictions")
  }
  return JSON.stringify(user_rest);
}

app.get('/getUserRestrictions', (req, res)=>{
  (async function getUserRestrictions(){
    let restrict = await fetchUserRestrictions(toString(req.body.userId))
    res.end(restrict)
  })();
})




//create fav foods
async function createFavoriteFood(userid, food){
  const new_fav_food = await FavoriteFoodsBridge.create({userId:userid, Foods:food});
  return JSON.stringify(new_fav_food)
}
app.post('createFavFood',(req,res)=>{
  (async function createfav(){
    let sendVal=await createFavoriteFood(toString(req.body.userId), toString(req.body.food))
    res.end(sendVal)
  })
})



//fetch favorite foods
async function fetchFavoriteFoods(userid){
  let fav_foods=[]
  try{
    const fav_food_list = await FavoriteFoodsBridge.findAll({
      where:{
        userID: userid,
      }
    });
    fav_food_list.forEach(f_food =>{
      fav_foods.push(f_food.foodID)
    });
  } catch{
    console.log("user has no favorites")
  }
  return JSON.stringify(fav_foods);
}
app.get('/getFavoriteFoods', (req,res)=>{
  (async function getFavoriteFoods(){
    let favs= await fetchFavoriteFoods(toString(req.body.userId))
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
    let sendVal=await createMeal(toString(req.body.userId), toString(req.body.foods))
    res.end(sendval)
  })
  
})


//fetch meals
async function fetchMeals(userid){
  async function fetchFoodInMeal(mealid){
    foods=[]
    const food_in_meal = await MealFoodBridge.findAll({
      where:{
        mealID: mealid,
      }
    });
    food_in_meal.forEach(food=>{
      foods.push(food.foodID)
    });
  }

  let meals=[]
  try{
    const usermeal=await meals.findAll({
      where:{
        userID:userid,
      }
    });

    usermeal.forEach(meal=>{
      let new_meal=[]
      new_meal.push(meal.mealID)
      meal_foods=fetchFoodInMeal(meal.mealID)
      meal_foods.forEach(food=>{
        new_meal.push({
          foodID: food.foodID,

        });
      });
      meals.push(new_meal)
    });
  }catch{
    console.log('user has no meals')
  }
  return JSON.stringify(meals);

}
app.get('/getmeals', (req, res)=>{
  (async function getmeals(){
    let meal_ret=await fetchMeals(toSting(req.body.userId))
    res.end(meal_ret)
  })();
})

//fetch favorite locations

async function fetchfavoritelocations(userid){
  let fav_loc=[]
  try{
    const favs= await favoriteLocationsBridge.findAll({
      where:{
        userID:userid,
      }
    });
    fav_loc.push(favs.locationid)
  } catch{
    console.log('user has no favorite locations')
  }
  return JSON.stringify(fav_loc);
}
app.get('/getfavoritelocations', (req,res)=>{
  (async function getfavoriteLocations(){
    let loc=await fetchfavoritelocations(toString(req.body.userId))
    res.end(loc)
  })();
})






app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});