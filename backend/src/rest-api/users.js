
import {sequelize, User, Food, FoodRestriction, UserRestriction,UserNonAllergenRestriction, Meal, Location, LocationTimes, FavoriteFoodsBridge, MealFoodBridge} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'

// const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb') // Example for postgres
const router=express.Router()
router.use(express.json())

//create user --works
async function createUser(userid,username, useremail, userphone){
  let doesExist = await fetchUserData(userid)
  if(doesExist == "null"){
  const newUser=await User.create({userId: userid, name: username, email: useremail, phone: userphone});
  return newUser;
  }
  else{return (userid+" already exists")}
}

router.post('/createUser', (req, res)=>{
  (async function createAndSend(){
    let sendVal = await createUser(req.query.userId, req.query.name, req.query.email, req.body.phone)
    res.end(JSON.stringify(sendVal))
  })();
})



//delete user--works
async function deleteuser(userid){
  let doesExist=await fetchUserData(userid)
  let userRestA=await fetchUserRestrictions(userid)
  let userRestNA=await fetchUserNonAllergenRestrictions(userid)
  let favs=await fetchFavoriteFoods(userid)
  //let meals=await fetchMeals(userid)
  if(doesExist=="null"){return userid+" does not exist"}
  else{
    if(userRestA!="[]"){await UserRestriction.destroy({where:{userId:userid}})}
    if(userRestNA!="[]"){await UserNonAllergenRestriction.destroy({where:{userId:userid}})}
    if(favs!="[]"){await FavoriteFoodsBridge.destroy({where:{userId:userid}})}
    await User.destroy({where:{userId: userid}})
    return userid + " is deleted"
}}

router.get('/deleteUser', (req,res)=>{
  (async function delUser(){
    let delVal=await deleteuser(req.query.userId)
    res.end(JSON.stringify(delVal))
  })();
})



//retrieve user data -- works
async function fetchUserData(userid){
  const users = await User.findOne({where: {userId: userid}})
  return JSON.stringify(users);
}

router.get('/getUser', (req, res) =>{
  (async function getUser(){
    let users = await fetchUserData((req.query.userId))
    if(users=="null"){res.end(JSON.stringify(req.query.userId+" does not exist"))}
    else{res.end(users)}
  })();
})




//create user restriction--works
async function createUserRestriction(userid, restrictons){
  let doesUserExist=await fetchUserData(userid)
  if(doesUserExist=="[]"){return JSON.stringify(userid+" does not exist")}
  else{
  const new_restrict= await UserRestriction.create({userId:userid, restriction:restrictons});
  return JSON.stringify(new_restrict)
  }
}
router.post('/createUserRestriction', (req,res)=>{
  (async function createRestrict(){
    let sendVal=await createUserRestriction((req.query.userId), (req.query.restriction))
    res.end(sendVal)
  })();
})



//fetch user restrictions--works
async function fetchUserRestrictions(userid){
  const user_data= await UserRestriction.findAll({where:{userId: userid}});
  return JSON.stringify(user_data);
}
router.get('/getUserRestrictions', (req, res)=>{
  (async function getUserRestrictions(){
    let restrict = await fetchUserRestrictions((req.query.userId))
    if(restrict=="[]"){res.end(JSON.stringify(req.query.userId+" has no allergenic restrictions"))}
    else{res.end(restrict)}
  })();
})



//delete user restriction--works
async function deleteUserRestriction(userid, user_rest){
  let doesExist = await fetchUserRestrictions(userid)
  if(doesExist == "[]"){return userid+" has no restrictions"}
  else{
    await UserRestriction.destroy({where:{userId:userid,restriction:user_rest}})
    return userid+" had deleted restriction "+user_rest
  }
}
router.get('/deleteUserRestriction', (req,res)=>{
  (async function deleteRest(){
    let delVal=await deleteUserRestriction(req.query.userId, req.query.restriction)
    res.end(JSON.stringify(delVal))
  })();
})


//create user non allergenic restriction
async function createUserNonAllergenRestriction(userid, restrictons){
  let doesUserExist=await fetchUserData(userid)
  console.log(doesUserExist)
  if(doesUserExist=="null"){return userid+" does not exist"}
  else{
  const new_restrict= await UserNonAllergenRestriction.create({userId:userid, restriction:restrictons});
  return new_restrict
  }
}
router.post('/createUserNonAllergenRestriction', (req,res)=>{
  (async function createRestrict(){
    let sendVal=await createUserNonAllergenRestriction(req.query.userId,req.query.restriction)
    res.end(JSON.stringify(sendVal))
  })();
})



//fetch user non allergen restrictions
async function fetchUserNonAllergenRestrictions(userid){
  const user_data= await UserNonAllergenRestriction.findAll({where:{userId: userid}});
  return JSON.stringify(user_data);
}

router.get('/getUserNonAllergenRestrictions', (req, res)=>{
  (async function getUserNonAllergenRestrictions(){
    let restrict = await fetchUserNonAllergenRestrictions((req.query.userId))
    if(restrict=="[]"){res.end(JSON.stringify(req.query.userId+" has no non allergenic restrictions"))}
    else{res.end(restrict)}
  })();
})

//delete user non allergen restriction--works
async function deleteUserNonAllergenRestriction(userid, user_rest){
  let doesExist = await fetchUserNonAllergenRestrictions(userid)
  if(doesExist == "[]"){return userid+" has no restrictions"}
  else{
    await UserNonAllergenRestriction.destroy({where:{userId:userid,restriction:user_rest}})
    return userid+" had deleted restriction "+user_rest
  }
}
router.get('/deleteuserNonAllergenRestriction', (req,res)=>{
  (async function deleteRest(){
    let delVal=await deleteUserNonAllergenRestriction(req.query.userId, req.query.restriction)
    res.end(JSON.stringify(delVal))
  })();
})



//create fav foods--works
async function createFavoriteFood(userid, foodid){
  let doesExist =await fetchUserData(userid)
  console.log(doesExist)
  if(doesExist!="null"){
  let new_fav_food = await FavoriteFoodsBridge.create({userId:userid, foodId:foodid});
  return new_fav_food
  }
  else{return userId+" does not exist"}
}
router.post('/createFavFood',(req,res)=>{
  (async function createfav(){
    let food_id=await Food.findOne({where:{name:req.query.name}})
    let sendVal=await createFavoriteFood(req.query.userId, food_id.foodId)
    res.end(JSON.stringify(sendVal))
  })();
})



//fetch favorite foods--works
async function fetchFavoriteFoods(userid){
  const fav_food_list = await FavoriteFoodsBridge.findAll({where:{userId: userid}});
  return (fav_food_list);
}
router.get('/getFavoriteFoods', (req,res)=>{
  (async function getFavoriteFoods(){
    let favs= await fetchFavoriteFoods((req.query.userId))
    console.log(favs)
    if(favs.toString()==[].toString()){
      res.end(JSON.stringify(req.query.userId+" does not have favorites"))
    }
    else{res.end(JSON.stringify(favs))}
  })();
})

//deletefavfood--works
async function deleteFavFood(userid, foodid, name){
  let doesExist=await fetchFavoriteFoods(userid,foodid)
  if(doesExist.toString()==[].toString()){
    return userid+" has no favorites"
  }
  else{
    await FavoriteFoodsBridge.destroy({where:{userId:userid,foodId:foodid}})
    return userid+" has unfavorited " + name
  }
}
router.get('/deleteFavoriteFood', (req,res)=>{
  (async function deleteFav(){
    let food = await Food.findOne({where:{name: req.query.name}})
    let delVal = await deleteFavFood(req.query.userId, food.foodId, req.query.name)
    res.end(delVal)
  })();
})

//get foods ids
async function getFoodIDs(foods){
  let foods_IDS=[]
  for(let i=0;i<foods.length;++i){
    let F_ID=await Food.findOne({where:{name:foods[i]}})
    let fid=F_ID.foodId
    foods_IDS.push(fid)
  }
  return foods_IDS;
}

//create meal
async function createMeal(userid, food_IDS){
  const new_meal= await Meal.create({userId:userid})
  let meal_ID=new_meal.mealId
  for(let i=0;i<food_IDS.length;++i){let newBridge=await MealFoodBridge.create({mealId:meal_ID, foodId:food_IDS[i]})}
  return JSON.stringify(new_meal)
}
router.post('/createMeal', (req,res)=>{
  (async function createM(){
    let foodlist=await req.query.foods.split(',') //spits list of foods by commas
    let foodAsIDS=await getFoodIDs(foodlist)//turns food names into ids
    let doesUserExist=await fetchUserData(req.query.userid)
    if(doesUserExist.toString()==[].toString()){res.end(JSON.stringify(req.query.userId+" does not exist"))}
    else if(foodAsIDS==[]){res.end(JSON.stringify('There are no foods in meal'))}
    else{
    let sendVal=await createMeal(req.query.userId, foodAsIDS)
    res.end(sendVal)
    }
  })();
})


//fetch meals
async function fetchMeals(userid){
  let userMeals=await Meals.findAll({where:{userId:userid}})
  userMeals.map(f=>f.mealId)
  let returnMeals=[]
  if(userMeals==[]){return(userid+ ' has no meals')}
  else{
    for(let i=0;i<userMeals.length;++i){
      let foodsInMeal=await MealFoodBridge.findAll({where:{}})
    }
  }




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
router.get('/getmeals', (req, res)=>{
  (async function getmeals(){
    let doesUserExit=await fetchUserData(req.query.userId)
    if(doesUserExit.toString()==[].toString()||doesUserExit.toString()=="null"){res.end(JSON.stringify(req.query.userId+" does not exist"))}
    else{
    let meal_ret=await fetchMeals(req.query.userId)
    res.end(meal_ret)
    }
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
router.get('/getfavoritelocations', (req,res)=>{
  (async function getfavoriteLocations(){
    let loc=await fetchfavoritelocations((req.query.userId))
    res.end(loc)
  })();
})

export default router