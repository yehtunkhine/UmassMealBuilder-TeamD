import {sequelize, User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, LocationFoodBridge, FoodNonAllergenRestriction} from '../models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'

async function findFood(key, value) { //find food with given key and value
    let food = await Food.findOne({ //find row in food table with given key and value
        where: {
            [key]: value
        }
    });
    if (food === null) return null; //if food does not exist return null
    else { //if food does exist...
        return { //return object with data of food
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

//find entries in the LocationFoodBridge table, filtered by given allergens and non-allergens
async function findLocationFoodBridges(key, value, allergenRestrictionStr, nonAllergenRestrictionStr) {
    const list = [];
    let bridges = [];

    if (allergenRestrictionStr === "" && nonAllergenRestrictionStr === "") { //if no allergens or non-allergens to be filtered by...
        bridges = await LocationFoodBridge.findAll({ //find all bridges with given key and value
            where: {[key]: value}
        });
    }
    else { //if there are either allergens or non-allergens to be filtered by...

        //get restrictions in the form of arrays
        const allergenRestrictionStrArr = allergenRestrictionStr.split(", ");
        const nonAllergenRestrictionStrArr = nonAllergenRestrictionStr.split(", ");

        //find entries in FoodRestrition table with any of the given restrictions
        const allergenRestrictionObjs = await FoodRestriction.findAll({
            where: {
                restriction: {
                    [Op.or]: allergenRestrictionStrArr
                }
            }
        });

        //find entries in FoodNonAllergenRestrition table with any of the given restrictions
        const nonAllergenRestrictionObjs = await FoodNonAllergenRestriction.findAll({
            where: {
                restriction: {
                    [Op.in]: nonAllergenRestrictionStrArr
                }
            }
        });

        //get food IDs from entries in the restriction tables
        function getFoodIdsFromObjArr(objArr) {
            const retArr = [];
            for (let i = 0; i<objArr.length; i++) {
                retArr.push(objArr[i].foodId);
            }
            return retArr;
        }
        const allergenFoodIds = getFoodIdsFromObjArr(allergenRestrictionObjs);
        let nonAllergenFoodIds = getFoodIdsFromObjArr(nonAllergenRestrictionObjs);
        
        //filter out any foods that dont meet ALL of the non allergen restrictions
        let counts = {};
        for(let i = 0; i < nonAllergenFoodIds.length; i++){
            counts[nonAllergenFoodIds[i]] = 0;
        }
        for(let i = 0; i < nonAllergenFoodIds.length; i++){
            counts[nonAllergenFoodIds[i]]++;
        }
        console.log(counts);
        nonAllergenFoodIds = nonAllergenFoodIds.filter((i) => counts[i] == nonAllergenRestrictionStrArr.length);

        //find LocationFoodBridges given value food IDs
        if (nonAllergenFoodIds.length === 0) { //if there are no non-allergens...
            if (nonAllergenRestrictionStr === "") { //if there were no non-allergens inputted, filter only by allergens
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
            else return []; //return empty array is there are no non-allergens with inputted name
        }
        else { //if there are either only non-allergens or both...
            //filter allergens from non-allergens
            const filteredFoodIds = nonAllergenFoodIds.filter(id => !allergenFoodIds.includes(id));
            //find LocationFoodBridges with filtered Ids
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
    //fill list array with filtered bridges
    bridges.forEach(bridge => {
        list.push({
            Date: bridge.Date,
            Time: bridge.Time,
            foodId: bridge.foodId,
            locationId: bridge.locationId
        });
    });
    //return final list
    return list;
}

//find all foods at a given location on a given date, filtered by allergens and non-allergens
async function findFoodsAtLocationOnDate(locationId, date, allergenRestrictionStr, nonAllergenRestrictionStr) {

    //filter foods by allergens and non-allergens using findLocationFoodBridges function
    let bridgeList = await findLocationFoodBridges('locationId', locationId, allergenRestrictionStr, nonAllergenRestrictionStr);

    //initialize empty return object. if no foods are found this will be returned
    let retObj = {'Breakfast': [], 'Lunch': [], 'Dinner': [], 'Late Night': []};

    //If there are no found foods, return the empty object
    if (bridgeList.length === 0) return retObj;

    for (let i = 0; i<bridgeList.length; i++) { //loop through all the bridges...
        let bridge = bridgeList[i]; //current bridge

        if (bridge.Date === date) { //if date matches in the current bridge object...
            let food = await findFood('foodId', bridge.foodId); //find food of bridge

            if(retObj.hasOwnProperty(bridge.Time)) { //if in current time...
                let categoryFound = false; //cateogry exists flag

                retObj[bridge.Time].forEach(categoryObj => { //loop through category objects
                    if (categoryObj.category === food.category) { //if category is a match with current food, add to list
                        categoryFound = true; //flag as found
                        (categoryObj.recipes).push( //push food to the recipes array in the category object
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
    return retObj; //return object
}

// -------------------------
// Rest API
// -------------------------
const router = express.Router()

//allow use of json or urlencoded when passing in parameters
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

async function testConnection() { //test the connection
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection()

//endpoint to create food
router.post('/createFood', (req, res) => {
    (async function createAndSend(){
        const data = req.body; //get request body data
        const duplicate = await Food.findOne({ //check for duplicate food
            where: {
                name: data.name
            }
        });
        if (duplicate !== null) res.send('ERROR: ' + data.name + ' already exists!'); //if duplicate is found alert user
        else { //if duplicate not found...
            const food = await Food.create({ //create food with body data
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
            //create restrcitions for food given body data
            if (data.allergenRestrictions != "") { //alergens
                const allergenRestrictionArr = data.allergenRestrictions.split(", "); //create array of restrictions
                for (let i = 0; i<allergenRestrictionArr.length; i++) { //create a restriction entry for every array element
                    await FoodRestriction.create({
                        restriction: allergenRestrictionArr[i],
                        foodId: food.foodId
                    });
                }
            }

            if (data.nonAllergenRestrictions != "") { //non-allergens
                const nonAllergenRestrictionArr = data.nonAllergenRestrictions.split(", "); //create array of restrictions
                for (let i = 0; i<nonAllergenRestrictionArr.length; i++) { //create a restriction entry for every array element
                    await FoodNonAllergenRestriction.create({
                        restriction: nonAllergenRestrictionArr[i],
                        foodId: food.foodId
                    });
                }
            }
            res.send(data.name + ' Successfully Created with Food ID: ' + food.foodId); //message that food was successfully created
        }
    })();
});

//endpoint to delete food
router.post('/deleteFood', (req, res) => {
    (async function createAndSend(){
        const data = req.body; //get request body data
        const food = await Food.findOne({ //find food
            where: {foodId: data.foodId}
        });
        if (food === null) res.send('ERROR: No such food exists!'); //alert user if no food to delete
        else { //if food exists...
            await Food.destroy({ //destroy food entry
                where: {foodId: data.foodId}
            });
            await LocationFoodBridge.destroy({ //destroy related LocationFoodBridges
                where: {foodId: data.foodId}
            });
            await FoodRestriction.destroy({ //destroy related allergens
                where: {foodId: data.foodId}
            });
            await FoodNonAllergenRestriction.destroy({ //destroy related non-allergens
                where: {foodId: data.foodId}
            });
            res.send('Food with ID ' + data.foodId + ' Successfully Deleted.') //success message
        }
    })();
});

//endpoints that ended up going unused

// router.post('/addFoodToLocation', (req, res) => {
//     (async function createAndSend(){
//         const data = req.body;
//         const food = await findFood('foodId', data.foodId);
//         if (food === null) res.send('ERROR: Food with ID ' + data.foodId + ' does not exist!');
//         else {
//             const location = await Location.findOne({
//                 where: {
//                     locationName: data.diningHall
//                 }
//             });
//             if (location === null) res.send('ERROR: ' + data.diningHall + ' is not a location!');
//             else {
//                 const duplicate = await LocationFoodBridge.findOne({
//                     where: {
//                         Date: data.date,
//                         Time: data.time,
//                         foodId: data.foodId,
//                         locationId: location.locationId
//                     }
//                 })
//                 if (duplicate !== null) res.send('ERROR: ' + food.name + ' is already linked to ' + data.diningHall + ' during ' + data.time + ' on ' + data.date + '!');
//                 else {
//                     const bridge = await LocationFoodBridge.create({
//                         Date: data.date,
//                         Time: data.time,
//                         foodId: data.foodId,
//                         locationId: location.locationId
//                     });
//                     res.send('Succesfully Added ' + food.name + ' (Food ID: ' + data.foodId + ') to ' + data.diningHall + ' during ' + data.time + ' on ' + data.date + '.');
//                 }
//             }
//         }
//     })();
// });

// router.post('/removeFoodFromLocation', (req, res) => {
//     (async function createAndSend() {
//         const data = req.body;
//         const location = await Location.findOne({
//             where: {
//                 locationName: data.diningHall
//             }
//         });
//         if (location === null) res.send('ERROR: ' + data.diningHall + ' is not a location!');
//         else {
//             const bridge = await LocationFoodBridge.findOne({
//                 where: {
//                     Date: data.date,
//                     Time: data.time,
//                     foodId: data.foodId,
//                     locationId: location.locationId
//                 }
//             })
//             if (bridge === null) res.send('ERROR: No such bridge exists!');
//             else {
//                 await LocationFoodBridge.destroy({
//                     where: {
//                         Date: data.date,
//                         Time: data.time,
//                         foodId: data.foodId,
//                         locationId: data.locationId
//                     }
//                 });
//                 res.send('Food successfully removed from location.');
//             }
//         }
//     })();
// });

//endpoint to get all foods at a dining hall on a given date, filtered by given restrictions
router.get('/analysis', (req, res) => {
    (async function getAndSend() {
        const location = await Location.findOne({ //find location
            where: {
                locationName: req.query.diningHall
            }
        });
        if (location === null) res.end(req.query.diningHall + ' is not a location!'); //error if location does not exist
        else { //if location exists...
            //call function to get all foods with entered parameters
            let resultObj = await findFoodsAtLocationOnDate(location.locationId, req.query.date,
                    req.query.allergenRestrictions, req.query.nonAllergenRestrictions);
            let str = JSON.stringify(resultObj); //turn returned object to string
            res.end(str); //send stringified object
        }
    })();
});

//endpoint to get nutrition facts from food given its ID
router.get('/facts', (req, res) => {
    (async function getAndSend() {
        let food = await findFood('foodId', req.query.foodId); //find food given ID
        if (food === null) res.end('No such item exists!'); //error if food ID does not exist
        else { //if food exists...
            delete food.foodId; //delete the id from the displayed object
            let str = JSON.stringify(food); //turn returned object to string
            res.end(str); //send stringified nutrition facts object
        }
    })();
});

//endpoint to get food ID from food name
router.get('/getFoodIdFromName', (req, res) => {
    (async function getAndSend() {
        let food = await Food.findOne({ //find food
            where: {
                name: req.query.name
            }
        });
        if (food === null) res.end('No such item exists!'); //error if food doesnt exist
        else { //if food exists...
            res.end(String(food.foodId)); //send food ID
        }
    })();
});

export default router