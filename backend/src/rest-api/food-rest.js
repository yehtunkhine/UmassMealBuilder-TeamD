import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb');

async function createFood(name, calories, fat, saturated_fat, carbs, ingredients, healthfulness, servingSize){ //create food with properties
    const food = await Food.create({ foodId: '1', name: name, calories: calories, fat: fat, saturated_fat: saturated_fat, carbs: carbs, ingredients: ingredients, halthfulness: healthfulness, servingSize: servingSize});
    console.log('-----------Created ' + name + ' Object-----------------')
    console.log(food instanceof Food);
    console.log(food.foodId);
    console.log(food.name);
    console.log(food.calories);
    console.log(food.fat);
    console.log(food.saturated_fat);
    console.log(food.carbs);
    console.log(food.ingredients);
    console.log(food.halthfulness);
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
            ingredients: food.ingredients,
            halthfulness: food.halthfulness,
            servingSize: food.servingSize
        };
    }
}



async function findRestrictions(key, value) { //find restrictions with given key and value
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
}

async function createFoodRestriction(name, restriction) { //add restriction to food
    let food = findFood('name', name);
    await FoodRestriction.create({restriction: restriction, foodId: food.foodId});

    return 'Created ' + restriction + ' restriction for food: ' + name;
}

async function findFoodsWithRestriction(restriction) { //find all foods with given restriction
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
}

async function findLocationFoodBridges(key, value) { //find restrictions with given key and value
    let list = [];
    const bridges = await LocationFoodBridge.findAll({
        where: {
            [key]: value
        }
    });
    
    bridges.forEach(bridge => {
        list.push({
            Date: bridge.Date,
            Time: bridge.TIme,
            foodId: bridge.foodId,
            locationId: bridge.locationId
        });
    });
    
    return list;
}

async function findFoodsAtLocationOnDate(locatiionId, date) {
    const list = [];
    const bridgeList = findLocationFoodBridges('locationId', locationId);
    bridgeList.forEach(bridge => {
        if (bridge.date === date) {
            let food = findFood('foodId', bridge.foodId);
        }
        list.push({
            name: food.name,
            foodId: food.foodId
        });
    });
}

async function deleteFood(name){
    let food = findFood('name', name);

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

app.get('/createFood', (req, res) => {
    (async function createAndSend(){
        let sendVal = await createFood('Chicken Soup', 1, 1, 1, 1, 'test', 1, 'test')
        res.end(sendVal)
    })();
});

app.get('/deleteFood', (req, res) => {
    (async function createAndSend(){
        let delVal = await deleteFood('Chicken Soup')
        res.end(delVal)
    })();
});

app.get('/createRestriction', (req, res) => {
    (async function createAndSend(){
        let sendVal = await createFoodRestriction('Chicken Soup', 'test restriction');
        res.end(sendVal);
    })();
});

app.get('/analysis', (req, res) => {
    (async function getAndSend() {
        
    })();

    req.query.diningHall
    req.query.date
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