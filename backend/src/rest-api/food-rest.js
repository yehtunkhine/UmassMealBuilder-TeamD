import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, LocationFoodBridge, FoodNonAllergenRestriction} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb');

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
            saturated_fat: food.saturated_fat,
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
// Rest API
// -------------------------
const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
                saturated_fat: data.saturated_fat,
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

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});