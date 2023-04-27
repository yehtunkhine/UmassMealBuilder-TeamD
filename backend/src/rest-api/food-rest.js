import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, LocationFoodBridge} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb');

async function createFood(name, calories, fat, saturated_fat, carbs, category, ingredients, healthfulness, servingSize){ //create food with properties
    const food = await Food.create({name: name, calories: calories, fat: fat, saturated_fat: saturated_fat, carbs: carbs, category: category, ingredients: ingredients, halthfulness: healthfulness, servingSize: servingSize});
    console.log('-----------Created ' + name + ' Object-----------------')
    console.log(food instanceof Food);
    console.log(food.foodId);
    console.log(food.name);
    console.log(food.calories);
    console.log(food.fat);
    console.log(food.saturated_fat);
    console.log(food.carbs);
    console.log(food.category);
    console.log(food.ingredients);
    console.log(food.healthfulness);
    console.log(food.servingSize);
    console.log('Saved ' + name);
    return 'Created ' + JSON.stringify(food)
}

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
            carbs: food.carbs,
            category: food.category,
            ingredients: food.ingredients,
            halthfulness: food.halthfulness,
            servingSize: food.servingSize
        };
    }
}

/*async function findRestrictions(key, value) { //find restrictions with given key and value
    let list = [];
    const restrictions = await FoodRestriction.findAll({
        where: {
            [key]: value
        }
    });

    restrictions.forEach(restriction => {
        list.push({
            restriction: restriction.restriction,
            foodId: restriction.foodId,
        });
    });

    return list;
}*/

/*async function createFoodRestriction(name, restriction) { //add restriction to food
    let food = findFood('name', name);
    await FoodRestriction.create({restriction: restriction, foodId: food.foodId});

    return 'Created ' + restriction + ' restriction for food: ' + name;
}*/

/*async function findFoodsWithRestriction(restriction) { //find all foods with given restriction
    const list = [];
    const restrictionList = findRestrictions('restriction', restriction);
    restrictionList.forEach(restriction => {
        let food = findFood('foodId', restriction.foodId);
        list.push({
            foodId: food.foodId,
            name: food.name,
            calories: food.calories,
            fat: food.fat,
            saturated_fat: food.saturated_fat,
            carbs: food.carbs,
            ingredients: food.ingredients,
            halthfulness: food.halthfulness,
            servingSize: food.servingSize
        });
    });

    return list;
}*/

async function findLocationFoodBridges(key, value) { //find restrictions with given key and value
    const list = [];
    const bridges = await LocationFoodBridge.findAll({
        where: {
            [key]: value
        }
    });

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

async function findFoodsAtLocationOnDate(locationId, date) {
    let bridgeList = await findLocationFoodBridges('locationId', locationId);
    let retObj = {'Breakfast': [], 'Lunch': [], 'Dinner': [], 'Late Night': []};
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

async function addFoodsToDatabase(inputObjStr) {
    let inputObj = JSON.parse(inputObjStr);
    
}

async function deleteFood(name){

    /*await FoodRestriction.destroy({ //delete all associated FoodRestriction rows
        where: {
            foodId: food.foodId
        }
    });*/

    await Food.destroy({ //delete all rows with given name
        where: {
          name: name
        }
    });

    return 'Deleted ' + name + 's and associated restrictions';
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
        await createFood(
            data.name,
            data.calories,
            data.fat,
            0,
            data.carbs,
            'N/A',
            data.ingredients,
            data.healthfulness,
            data.servingSize);
        res.send(data.name + ' Successfully Created');
    })();
});

app.post('/deleteFood', (req, res) => {
    (async function createAndSend(){
        await deleteFood(req.body.name)
        res.send(data.name + ' Successfully Deleted')
    })();
});

/*app.get('/createRestriction', (req, res) => {
    (async function createAndSend(){
        let sendVal = await createFoodRestriction('Chicken Soup', 'test restriction');
        res.end(sendVal);
    })();
});*/

app.get('/analysis', (req, res) => {
    (async function getAndSend() {
        const location = await Location.findOne({
            where: {
                locationName: req.query.diningHall
            }
        });
        if (location === null) res.end(req.query.diningHall + ' is not a location!');
        else {
            let resultObj = await findFoodsAtLocationOnDate(location.locationId, req.query.date);
            let str = JSON.stringify(resultObj);
            res.end(str);
        }
    })();
});

app.get('/facts', (req, res) => {
    (async function getAndSend() {
        let food = await findFood('foodId', req.query.item);
        if (food === null) res.end('No such item exists!');
        else {
            delete food.name;
            let str = JSON.stringify(food);
            res.end(str);
        }
    })();
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});
