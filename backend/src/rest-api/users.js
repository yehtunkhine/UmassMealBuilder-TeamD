import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, FavoriteFoodsBridge, MealFoodBridge} from '../models.js'
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




app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});