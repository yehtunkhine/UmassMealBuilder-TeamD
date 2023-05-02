
import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, FavoriteFoodsBridge, MealFoodBridge} from './models.js'
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
  if(doesExist == "null"){
  const newUser=await User.create({userId: userid, name: username, email: useremail, phone: userphone});
  return (newUser);
  }
  else{  
    return (userid+" already exists")

}
}

app.post('/createUser', (req, res)=>{
  (async function createAndSend(){
    let sendVal = await createUser(req.query.userId, req.query.name, req.query.email, req.body.phone)
    res.end(JSON.stringify(sendVal))
  })();
})



//delete user--works
async function deleteuser(userid){
  let doesExist=await fetchUserData(userid)
  let user_meal_Ids=await fetchMealIDS(userid)
  let doesRestExist=await fetchUserRestrictions(userid)
  let doesFavExist=await fetchFavoriteFoods(userid)
  
  if(doesFavExist.toString()!=[].toString()){await FavoriteFoodsBridge.destroy({where:{userId:userid}})}

  if(user_meal_Ids.toString()!=[].toString()){
    console.log(user_meal_Ids)
    await user_meal_Ids.forEach(id=> MealFoodBridge.destroy({where:{mealId:id.mealId}}))
    await Meal.destroy({where:{userId:userid}})
  }
  if(doesRestExist.toString()!=[].toString()){
    await UserRestriction.destroy({where:{userId:userid}})
  }
  if(doesExist=="null"||doesExist=="[]"){return userid+" does not exist"}
  else{await User.destroy({where:{userId: userid}});
  return userid + " is deleted"
}

}
app.get('/deleteUser', (req,res)=>{
  (async function delUser(){
    let delVal=await deleteuser(req.query.userId)
    res.end(JSON.stringify(delVal))
  })();
})



//retrieve user data -- works
async function fetchUserData(userid){
    const users = await User.findOne({
      where: {
        userId: userid,
      }
    });
  return JSON.stringify(users);
}

app.get('/getUser', (req, res) =>{
  (async function getUser(){
    let users = await fetchUserData((req.query.userId))
    if(users=="null"){
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
  if(doesUserExist=="null"){
    return JSON.stringify(userid+" does not exist")
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
  if(doesExist == "null"){
    return userid+" has no restrictions or does not have this restriction"
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
    res.end(JSON.stringify(delVal))
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
  if(doesExist.toString()=="null"){
    return userid+" has no favorites or has not favorited this item"
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
    res.end(JSON.stringify(delVal))
  })();
})





//create meal
async function createMeal(mealid, foodname){
  let food=await Food.findOne({where:{name:foodname}})
  let newBridge=await MealFoodBridge.create({mealId:mealid, foodId:food.foodId})
  return newBridge.mealId
}
app.post('/createMeal', (req,res)=>{
  (async function createM(){
    let foods=req.query.foods.split(',')
    let meal_id=await Meal.create({userId:req.query.userId})
    let sendVal=await foods.forEach((food)=>createMeal(meal_id.mealId, food))
    res.end(JSON.stringify("Meal Created with ID "+ meal_id.mealId))
  })();
  
})


//fetch meals


//fetch mealIDS
async function fetchMealIDS(userid){
  const mealIDS=await Meal.findAll({where:{userId:userid}})
  return mealIDS
}

//fet items in meal by if
async function getFoodInMeal(mealid){
  const foods=await(await (await MealFoodBridge.findAll({where:{mealId:mealid}})).map(f=> f.foodId))
  return foods;
}


app.get('/getMeals', (req, res)=>{
  (async function getmeals(){
    let retVal=[]
    let userMealIDS=await (await fetchMealIDS(req.query.userId)).map(f=>f.mealId)  //list of meal ids for user
    for(let i=0;i<userMealIDS.length;++i){
      let food=await getFoodInMeal(userMealIDS[i])
      retVal.push({mealId:userMealIDS[i], foods:food})
    }
    console.log(retVal)
    res.end(JSON.stringify(retVal))
  })();
})








app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
});