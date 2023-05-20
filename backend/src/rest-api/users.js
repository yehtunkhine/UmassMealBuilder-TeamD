
import {sequelize, User, Food, UserRestriction, UserNonAllergenRestriction, Meal, FavoriteFoodsBridge, MealFoodBridge} from '../models.js'
import { Sequelize, Op, UnknownConstraintError } from 'sequelize';
import express from 'express'

// const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb') // Example for postgres
const router=express.Router()
router.use(express.json())

//create user --works
async function createUser(userid,username, useremail, userphone){
  let doesUserExist = await fetchUserData(userid)  //checks if the userId is already used by another user
  if(doesUserExist == "null"){ //if not already in the system, add a new user with userID and parameters
    const newUser=await User.create({userId: userid, name: username, email: useremail, phone: userphone});
    return newUser; //returns creater user object
  }
  else{return (userid+" already exists")} //return if the userId is already in the system
}

router.post('/createUser', (req, res)=>{
  (async function createAndSend(){
    //checking to make sure all parameters are defined 
    if(req.query.userId==(undefined||"")||req.query.name==(undefined||"")||req.query.email==(undefined||"")||req.query.phone==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}

    else{
      let sendVal = await createUser(req.query.userId, req.query.name, req.query.email, req.query.phone)//creates the user
      res.end(JSON.stringify(sendVal))//turns user object into JSON and attachees to message response
    }
  })();
})



//delete user--works
async function deleteuser(userid){
  let doesUserExist=await fetchUserData(userid)//gets userdata if it exists
  if(doesUserExist=="null"){return userid+" does not exist"}//if the user does not exist return
  else{
    let userRestrictionAllergen=await fetchUserRestrictions(userid)//gets user allergens if they exist
    let userRestricctionNonAllergen=await fetchUserNonAllergenRestrictions(userid)//gets user no allergens if they exist
    let favs=await fetchFavoriteFoods(userid)//gets user favorites if they exist
    let meals=await Meal.findAll({where:{userId:userid}})//gets a list of usermeals if it exists
    if(userRestrictionAllergen!="[]"){await UserRestriction.destroy({where:{userId:userid}})}//if user has allergen restrictions delete them
    if(userRestricctionNonAllergen!="[]"){await UserNonAllergenRestriction.destroy({where:{userId:userid}})}//if user has non allergen restrictions delete
    if(favs!="[]"){await FavoriteFoodsBridge.destroy({where:{userId:userid}})}//delete favorite foods
    if(meals!="[]"){
      let mealIDS=await meals.map(f=>f.mealId)//turns list of meal objects(userId, mealId) into a lsit of mealIds
      for(let i=0;i<mealIDS.length;++i){
        await MealFoodBridge.destroy({where:{mealId:mealIDS[i]}})//destroys listings in to MealFoodBridge with correcponding mealId
        await Meal.destroy({where:{mealId:mealIDS[i]}})//deletes meal with mealId from Meal database, must be done after deleting MealFoodBridge
        //otherwise it leads to MealFoodBridge containing a null value where the mealId was previously
      }
    }
    await User.destroy({where:{userId: userid}})//must be done after all other deletes otherwise a null pointer will replace all instances of this userId
    return userid + " is deleted"
}}

router.get('/deleteUser', (req,res)=>{
  (async function delUser(){
    if(req.query.userId==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks that parameters are present
    else{
      let delVal=await deleteuser(req.query.userId)//calls delete function and stores return
      res.end(JSON.stringify(delVal))//attaches result to response in JSON string format
    }
  })();
})



//retrieve user data -- works
async function fetchUserData(userid){
  const users = await User.findOne({where:{userId: userid}})//gets user with given userId
  return JSON.stringify(users);//returns result as string, if it does not exist returns null as string
}

router.get('/getUser', (req, res) =>{
  (async function getUser(){
    if(req.query.userId==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks that a userId is sent
    else{
      let users = await fetchUserData((req.query.userId))//gets data to return
      if(users=="null"){res.end(JSON.stringify(req.query.userId+" does not exist"))}//if user does not exist return this
      else{res.end(users)}//returns user data as JSON object as string
    }
  })();
})



//create user restriction--works
async function createUserRestriction(userid, restrictons){
  let doesUserExist=await fetchUserData(userid)//value to check if user exists
  if(doesUserExist=="null"){return JSON.stringify(userid+" does not exist")}//returns this if the userId is incorrect
  else{
      let restriction = await UserRestriction.findOne({where: {userId: userid, restriction: restrictons}})//checks if user already has a restriction})
      if (restriction == null) {
        restriction = await UserRestriction.create({userId:userid, restriction:restrictons});//create a new restriction in the database
      }
    return JSON.stringify(restriction)//returns created object int JSON string format
  }
}

router.post('/createUserRestriction', (req,res)=>{
  (async function createRestrict(){
    if(req.query.userId==(undefined||"")||req.query.restriction==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks that parameters are given
    else{
      let sendVal=await createUserRestriction(req.query.userId,req.query.restriction)//calls function to create restriction and stores fuction return
      res.end(sendVal)//attaches message to response
    }
  })();
})



//fetch user restrictions--works
async function fetchUserRestrictions(userid){
  const user_data= await UserRestriction.findAll({where:{userId: userid}});//finds all restrictions with matching userId
  user_data.map(f=>f.restriction)//gets only restrictions
  return JSON.stringify(user_data);//returns array of objects {userId, restriction} if at leat one exists, else it returns []
}
router.get('/getUserRestrictions', (req, res)=>{
  (async function getUserRestrictions(){
    if(req.query.userId==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks that parameters are given
    else{
      let doesUserExist=await fetchUserData(req.query.userId)//check if user exists
      if(doesUserExist=="null"){res.end(JSON.stringify(req.query.userId+' does not exist'))}//return if user does not exist
      else{
        let restrict = await fetchUserRestrictions(req.query.userId)//gets and stores user restriction array
          res.end(restrict)
      }
    }
  })();
})



//delete user restriction--works
async function deleteUserRestriction(userid, user_rest){
  let doesExist = await fetchUserRestrictions(userid)//value to check if user exists
  if(doesExist == "[]"){return userid+" has no restrictions"}//returns if the userId is invalid
  else{
    let doesRestExist=await UserRestriction.findAll({where:{userId:userid,restriction:user_rest}})//checks if user has specified restriction

    if(doesRestExist=="[]"){return JSON.stringify(doesRestExist)}//return if user has restrictions but not specified one
    else{
    await UserRestriction.destroy({where:{userId:userid,restriction:user_rest}})//destorys all instances of matcing restriction and user
    return userid+" had deleted restriction "+user_rest//return message on success
    }
  }
}
router.get('/deleteUserRestriction', (req,res)=>{
  (async function deleteRest(){
    if(req.query.userId==(undefined||"")||req.query.restriction==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks for valid parameters
    else{
      let doesUserExist=await fetchUserData(req.query.userId)//value to check if user exist
      if(doesUserExist=="null"){res.end(JSON.stringify(req.query.userId+' does not exist'))}//return if user does not exist
      else{
        let delVal=await deleteUserRestriction(req.query.userId, req.query.restriction)//gets and stores result of delete call
        res.end(JSON.stringify(delVal))//attaches return to response
      }
    }
  })();
})


//create user non allergenic restriction
async function createUserNonAllergenRestriction(userid, restrictons){
  let doesUserExist=await fetchUserData(userid)//value to check if user exists
  if(doesUserExist=="null"){return userid+" does not exist"}//return if user does not exist
  else{
    const new_restrict= await UserNonAllergenRestriction.create({userId:userid, restriction:restrictons});//creates and stores restriction
    return new_restrict//returns created object
  }
}
router.post('/createUserNonAllergenRestriction', (req,res)=>{
  (async function createRestrict(){
    if(req.query.userId==(undefined||"")||req.query.restriction==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks that parameters exist
    else{
      let sendVal=await createUserNonAllergenRestriction(req.query.userId,req.query.restriction)//sends data to creation function and stores return
      res.end(JSON.stringify(sendVal))//attaches return to response
    }
  })();
})



//fetch user non allergen restrictions
async function fetchUserNonAllergenRestrictions(userid){
  const user_data= await UserNonAllergenRestriction.findAll({where:{userId: userid}});
  return JSON.stringify(user_data);
}

router.get('/getUserNonAllergenRestrictions', (req, res)=>{
  (async function getUserNonAllergenRestrictions(){
    if(req.query.userId==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks that parameters are given
    else{
      let doesUserExist=await fetchUserData(req.query.userId)//value to check if user is valid
      if(doesUserExist=="null"){res.end(JSON.stringify(req.query.userId+" does not exist"))}//return if user does not exist
      else{
        let restrict = await fetchUserNonAllergenRestrictions((req.query.userId))//gets and stores user non allergen restrictions
        if(restrict=="[]"){res.end(JSON.stringify(req.query.userId+" has no non allergenic restrictions"))}//return if user has no no allergen restrictions
        else{res.end(restrict)}//attaches response to message
      }
    }
  })();
})

//delete user non allergen restriction--works
async function deleteUserNonAllergenRestriction(userid, user_rest){
  let doesUserExist=await fetchUserData(userid)//check value for validity of user
  if(doesUserExist=="null"){return userid+' does not exist'}//return if user does not exist
  else{
    let doesRestrictionExist = await UserNonAllergenRestriction.findOne({where:{userId:userid, restriction:user_rest}})//value to check if user has specified restriction
    if(doesRestrictionExist == null){return userid+" does not have this restriction"}//return if user does not have specified restriction
    else{
      await UserNonAllergenRestriction.destroy({where:{userId:userid,restriction:user_rest}})//destroy all restrictions that match specification
      return userid+" had deleted restriction "+user_rest//return value of success
    }
  }
}
router.get('/deleteuserNonAllergenRestriction', (req,res)=>{
  (async function deleteRest(){
    if(req.query.userId==(undefined||"")||req.query.restricton==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks if parameters are defined
    else{
      let delVal=await deleteUserNonAllergenRestriction(req.query.userId, req.query.restriction)//calls and stores return of delete call
      res.end(JSON.stringify(delVal))//attaches return to response
    }
  })();
})



//create fav foods--works
async function createFavoriteFood(userid, foodid){
  let doesExist =await fetchUserData(userid)//checks if user is valid
  if(doesExist!="null"){
    let alreadyFav=await FavoriteFoodsBridge.findOne({where:{userId:userid, foodId:foodid}})//value to check if already a favorite
    if(alreadyFav!="null"){return userid+' has already favorited '+foodid}
    else{
      let new_fav_food = await FavoriteFoodsBridge.create({userId:userid, foodId:foodid});//creates a new favorite
      return new_fav_food//returns created object
    }
  }
  else{return userid+" does not exist"}//return if user does not exist
}
router.post('/createFavFood',(req,res)=>{
  (async function createfav(){
    if(req.query.userId==(undefined||"")||req.query.name==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//check if parameters are given
    else{
      let food_id=await Food.findOne({where:{name:req.query.name}})//gets food object that is to be favorited
      if(food_id==null){res.end(JSON.stringify(req.query.name+' does not exist'))}//return if food noes not exist
      else{
        let sendVal=await createFavoriteFood(req.query.userId, food_id.foodId)//creates and stores result of favotorite call
        res.end(JSON.stringify(sendVal))//attaches return to response
      }
    }
  })();
})



//fetch favorite foods--works
async function fetchFavoriteFoods(userid){
  const fav_food_list = await FavoriteFoodsBridge.findAll({where:{userId: userid}});//gets all foods favorited by user
  return fav_food_list.map(f=>f.foodId);//returns lsit of favorite foods
}
router.get('/getFavoriteFoods', (req,res)=>{
  (async function getFavoriteFoods(){
    if(req.query.userId==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//check if parameters are given
    else{
      let doesUserExist = await fetchUserData(req.query.userId)//value to check if user exists
      if(doesUserExist=="null"){res.end(JSON.stringify(req.query.userId+' does not exist'))}//return if userId is invalid
      else{
        let favs= await fetchFavoriteFoods((req.query.userId))//fetches favorite foods
        if(favs.toString()==[].toString()){res.end(JSON.stringify(req.query.userId+" does not have favorites"))}//return if suer has not favorites
        else{res.end(JSON.stringify(favs))}//attaches result to response
      }
    }
  })();
})

//deletefavfood--works
async function deleteFavFood(userid, foodid, name){
  let doesFavoriteExist=await FavoriteFoodsBridge.findOne({where:{userId:userid, foodId:foodid}})//checks if user has favorited item
  if(doesFavoriteExist==null){return userid+" has not favorited this item"}//return if user has not favorited item
  else{
    await FavoriteFoodsBridge.destroy({where:{userId:userid,foodId:foodid}})//destorys favorited iem
    return userid+" has unfavorited " + name//return of successful unfavorite
  }
}
router.get('/deleteFavoriteFood', (req,res)=>{
  (async function deleteFav(){
    if(req.query.userId==(undefined||"")||req.query.name==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks parameters exist
    else{
      let doesUserExit=await fetchUserData(req.query.userId)//value to check if user exists
      if(doesUserExit=="null"){res.end(JSON.stringify(req.query.userId+' does not exist'))}//return if user does not exist
      else{
        let food = await Food.findOne({where:{name: req.query.name}})//finds food that is to be deleted from name
        if(food==null){res.end(JSON.stringify(req.query.name+' does not exist'))}//return if food to be deleted does exist in DB
        else{
          let delVal = await deleteFavFood(req.query.userId, food.foodId, req.query.name)//calls and stores return of delete call
          res.end(JSON.stringify(delVal))//attaches return to response
        }
      }
    }
  })();
})





//get foods ids
async function getFoodIDs(foods){//takes in lsit of food
  let foods_IDS=[]//default return
  for(let i=0;i<foods.length;++i){//loops over food list
    let F_ID=await Food.findOne({where:{name:foods[i]}})//value of food itemby name
    if(F_ID!=null){foods_IDS.push(F_ID.foodId)}//return if the food have an entry in DB
    else{foods_IDS.push("invalid food name")}//return if food does not exist
  }
  return foods_IDS;//return list of ids and invalid entries
}

//create meal
async function createMeal(userid, food_IDS){
  const new_meal= await Meal.create({userId:userid})//creates a new meal
  let meal_ID=new_meal.mealId//stores mealId of new meal
  let counter=0
  for(let i=0;i<food_IDS.length;++i){//loops over foodIDs
    if(typeof food_IDS[i]=='number'){let newBridge=await MealFoodBridge.create({mealId:meal_ID, foodId:food_IDS[i]})}//creates an entry in DB
    if(typeof food_IDS[i]=='string'){counter=counter+1}//increments counter of invalid foods 
  }
  return JSON.stringify(userid+' has created a meal with ID '+ meal_ID+' with '+counter+' invalid foods')
}
router.post('/createMeal', (req,res)=>{
  (async function createM(){
    if(req.query.userId==(undefined||"")||req.query.foods==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks parameters exist
    else{
      let foodlist=await req.query.foods.split(',') //spits list of foods by commas
      let foodAsIDS=await getFoodIDs(foodlist)//turns food names into ids
      let doesUserExist=await fetchUserData(req.query.userId)//value ot check if user exists
      if(doesUserExist=="null"){res.end(JSON.stringify(req.query.userId+" does not exist"))}//return if user id invalid
      else if(foodAsIDS==[]){res.end(JSON.stringify('There are no foods in meal'))}//return if empty array is returned
      else{
      let sendVal=await createMeal(req.query.userId, foodAsIDS)//creates and stores meal return
      res.end(sendVal)//attaches return to response
      }
    }
  })();
})


//fetch meals
async function fetchMeals(userid){
  let userMeals=await Meal.findAll({where:{userId:userid}})//gets meals for user
  let returnMeals=[]//initailozed return value
  console.log(userMeals)
  if(userMeals.toString()==[].toString()){return(userid+ ' has no meals')}//return if user has no meals created
  else{
    for(let i=0;i<userMeals.length;++i){//loops over all mealIds
      let foodsInMeal=await MealFoodBridge.findAll({where:{mealId:userMeals[i].mealId}})//finds foods in meal
      let ids=await foodsInMeal.map(f=>f.foodId)//turns food objs to food ids
      returnMeals.push({mealId:userMeals[i].mealId, foods:ids})//adds an entry to return consisting of mealId and list of foods
    }
    return returnMeals;//return value
  }
}
router.get('/getmeals', (req, res)=>{
  (async function getmeals(){
    if(req.query.userId==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks if parameters are given
    else{
      let doesUserExist=await fetchUserData(req.query.userId)//value to check if user exists
      if(doesUserExist=="null"){res.end(JSON.stringify(req.query.userId+" does not exist"))}//return is user does not exist
      else{
        let meal_ret=await fetchMeals(req.query.userId)//fetches user meals
        res.end(JSON.stringify(meal_ret))//attaches return to response
      }
    }
  })();
})


//delete meals
async function deleteMeal(userid, mealid){
  let doesUserExist = (await fetchUserData(userid)).toString()//value to check if user exists
  let doesMealExist = (await Meal.findOne({where:{userId:userid, mealId:mealid}}))//value to check if meal exists
  if(doesUserExist=="null"){return userid+' does not exist'}//return if user does not exist
  else if(doesMealExist==null){return userid+" does not have a meal with id "+ mealid}//return if user does not have a meal with given id
  else{
    await MealFoodBridge.destroy({where:{mealId:mealid}})//destroys meal listing in MealFoodBridge
    await Meal.destroy({where:{mealId:mealid}})//destorys meal in Meal, must be done last otherwise all listings of mealId will become null values
    return userid+' has deleted meal wiht id '+mealid//return on success
  }
}


router.get('/deleteMeal', (req,res)=>{
  (async function delMeal(){
    if(req.query.userId==(undefined||"")||req.query.mealId==(undefined||"")){res.end(JSON.stringify('invalid parameters'))}//checks is parameters are given
    else{
      let delVal=await deleteMeal(req.query.userId, req.query.mealId)//deletes and stores return of call
      res.end(JSON.stringify(delVal))//attaches return to response
    }
  })();
})




export default router
