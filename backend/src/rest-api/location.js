import {sequelize, User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, LocationFoodBridge, FavoriteLocationsBridge} from '../models.js'
import { Sequelize, Op } from 'sequelize';
import moment from 'moment-timezone'
import express from 'express'


// Basic Find, Deletes
async function createLocation(name){
    if(name.length > 128){
        throw new Error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
    }

    const location = await Location.create({locationName: name});

    return location;
}

async function deleteLocationById(lid){
    await Location.destroy({
        where: {
            locationId: lid
        }
    });

    await LocationFoodBridge.destroy({
        where: {
            locationId: lid
        }
    });
}

async function deleteLocationByName(name){
    const locations = (await Location.findAll({
        where: {
            locationName: name
        }
    })).map((l) => l.locationId);

    locations.forEach((id) => deleteLocationById(id));
}

async function findLocationByName(name){
    if(name.length > 128){
        throw new Error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
    }

    const locations = await Location.findAll({
        where: {locationName: name}
    });

    return locations;
}

async function findLocationById(id){
    const location = await Location.findOne({
        where: {locationId: id}
    });

    return location;
}

async function findLocationIdsByName(name){
    if(name.length > 128){
        throw new Error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
    }

    const locations = (await Location.findAll({
        where: {locationName: name}
    })).map((l) => l.locationId);

    return locations;
}

// Functions involving Food/FoodLocationBridge

// TODO: TEST
async function findAllLocationsServingFoodItemsById(foodItemIds){
    const locationIds = (await LocationFoodBridge.findAll({
            where: {
                foodId: {[Op.in]: foodItemIds},
                Date: {[Op.gte]: moment().tz("America/New_York").format('YYYY-MM-DD')}
            },
            attributes: ['locationId']
    })).map((l) => l.locationId);

    const locations = await Location.findAll({
        where: {locationId: {[Op.in]: locationIds}}
    });

    return locations;
}

async function findAllLocationsServingFoodItemsByNames(foodNameList){
    const foodIds = (await Food.findAll({
        where: {name: {[Op.in]: foodNameList}},
        attributes: ["foodId"]
    })).map((f) => f.foodId);
    
    return await findAllLocationsServingFoodItemsById(foodIds);
}


// TODO: TEST
async function findAllLocationsServingFoodItemOnDate(foodItem, date){
    let locations = (await LocationFoodBridge.findAll({
        where: {
            [Op.and]: [
                {foodId: foodItem},
                {Date: date}
            ]
        },
        attributes: ["locationId"]
    })).map((location) => location.locationId);

    let locationObjects = await Location.findAll({
        where: {
            locationId: {[Op.in]: locations}}
    });    

    return locationObjects;
}

//TODO: TEST
async function findAllLocationsServingFoodItemOnDateAtTime(foodItem, date, time){
    let locations = (await LocationFoodBridge.findAll({
        where: {
            [Op.and]: [
                {foodId: foodItem},
                {Date: date},
                {Time: time}
            ]
        },
        attributes: ["locationId"]
    })).map((location) => location.locationId);

    let locationObjects = await Location.findAll({
        where: {locationId: {[Op.in]: locations}}
    });
    
    return locationObjects;
}

// User Favorite Location Functions
async function findFavoriteLocationsForUser(uid){
    const user = await User.findOne({
        where: {userId: uid}
    });

    if(user == null){
        throw new Error("No such user exists");
    }

    return (await user.getLocations()).map((l) => {return {locationId: l.locationId, locationName: l.locationName, }});
}

async function addNewFavoriteLocationForUser(uid, lid){
    const user = await User.findOne({
        where: {userId: uid}
    });
    const location = await Location.findOne({
        where: {locationId: lid}
    });

    if(user == null){
        throw new Error("No such user exists");
    }

    if(location == null){
        throw new Error("No such location exists.");
    }

    let success = false;
    await user.addLocation(location).then(() => {success = true;});

    if(success == false){
        throw new Error("Could not add location '" + location.locationName + "' as favorite location for user with id '" + user.userId + "'");
    }
}

async function deleteFavoriteLocationFromUser(uid, lid){
    const user = await User.findOne({
        where: {userId: uid}
    });

    if(user == null){
        throw new Error('No such user exists');
    }

    const location = await Location.findOne({
        where: {locationId: lid}
    });

    let success = false;
    await user.removeLocation(location).then(() => {success = true;});

    if(success == false){
        throw new Error("Could not remove location '" + location.locationName + "' as favorite location for user with id '" + user.userId + "'");
    }
}


// Location Times Functions
async function findAllTimesForLocation(lid){
    const location = await Location.findOne({
        where: {locationId: lid}
    });

    if(location == null){
        throw new Error("No such location exists");
    }

    const locationTimes = await LocationTimes.findAll({
        where: {locationId: lid}
    });

    return locationTimes;
}

async function findTimesForLocationOnDay(dayOfWeek, lid){
    const location = await Location.findOne({
        where: {locationId: lid}
    });

    if(location == null){
        throw new Error("No such location exists");
    }

    const time = LocationTimes.findOne({
        where: {
            locationId: lid,
            day: dayOfWeek
        }
    });

    return time;
}

async function createLocationTimesForDay(lid, dayOfWeek, open, close){
    const locationTime = await LocationTimes.findOne({
        where: {
            [Op.and]: {
                locationId: lid,
                day: dayOfWeek
            }
        }
    });

    if(locationTime != null){
        await locationTime.update({openTime: open, closeTime: close});
    }else{
        await LocationTimes.create({
            locationId: lid,
            day: dayOfWeek,
            openTime: open,
            closeTime: close
        });
    }
}

async function createTimesForEveryDayOfWeekForLocation(lid, open, close){
    const location = await Location.findOne({
        where: {
            locationId: lid
        }
    });

    if(location == null){
        throw new Error("No such location exists");
    }   
    
    for(let i = 0; i < 7; i++){
        await createLocationTimesForDay(lid, i, open, close);    
    }
}

async function setMealTimeForLocationOnDay(lid, timeLabel, time, dayOfWeek){
    const allowedLabels = ['openTime', 'closeTime', 'dinnerTime', 'brunchTime', 'lunchTime', 'breakfastTime'];
    if(!allowedLabels.includes(timeLabel)){
        throw new Error("No location may have a time labeled '" + timeLabel + "'");
    }

    const location = await Location.findOne({
        where: {locationId: lid}
    });

    if(location == null){
        throw new Error("No such location exists.");
    }

    let locationTimeRow = await LocationTimes.findOne({
        where: {
            [Op.and]: {
                locationId: lid,
                day: dayOfWeek
            }
        }
    });

    if(locationTimeRow == null){
        locationTimeRow = await LocationTimes.create({
            locationId: lid,
            day: dayOfWeek,
            openTime: "12:00 AM",
            closeTime: "11:59 PM"
        });
    }

    await locationTimeRow.update({[timeLabel]: time});
}

async function deleteLocationTimeRowForDay(lid, dayOfWeek){
    const location = await Location.findOne({
        where: {
            locationId: lid
        }
    });

    if(location == null){
        return;
    }

    await LocationTimes.destroy({
        where: {
            [Op.and]: {
                locationId: lid,
                day: dayOfWeek
            }
        }
    });
}

async function deleteAllLocationTimes(lid){
    await LocationTimes.destroy({
        where: {
            locationId: lid
        }
    });
}

// -------------------------
// Rest API
// -------------------------
const router = express.Router()
router.use(express.json())

router.post('/createLocation', (req, res) => {
    let name = req.query.locationName;
    if(name == undefined || name == null || name == ''){
        res.status(400).send("No Name Given");
        return;
    }

    (async function anon(){
        let sendVal = await createLocation(name);
        res.end(JSON.stringify(sendVal))
    })();
});

router.delete('/deleteLocationById', (req, res) => {
    let id = req.query.locationId;

    if(id == undefined || id == null || id == ''){
        res.status(400).send("No ID Given");
        return;
    }

    (async function anon() {
        try{
            deleteLocationById(id)
            res.end("Success");
        }catch(e){
            res.end(e.message);
        }
    })();
});

router.delete('/deleteLocationByName', (req, res) => {
    let name = req.query.locationName;

    if(name == undefined || name == null || name == ''){
        res.status(400).send("No Name Given");
        return;
    }

    (async function anon(){
        try{
            await deleteLocationByName(name);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findLocationByName', (req, res) => {
    let name = req.query.locationName;

    if(name == undefined || name == null || name == ''){
        res.status(400).send("No Name Given");
        return;
    }

    (async function anon(){
        try{
            let locations = await findLocationByName(name);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findLocationById', (req, res) => {
    let id = req.query.locationId;

    if(id == undefined || id == null || id == ''){
        res.status(400).send("No ID Given");
        return;
    }

    (async function anon(){
        try{
            let location = await findLocationById(id);
            res.end(JSON.stringify(location));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findLocationIdsByName', (req, res) => {
    let name = req.query.locationName;

    if(name == undefined || name == null || name == ''){
        res.status(400).send("No Name Given");
        return;
    }

    (async function anon(){
        try{
            let locationIds = await findLocationIdsByName(name);
            res.end(JSON.stringify(locationIds));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findAllLocationsServingFoodItemsById', (req, res) => {
    let foodItems = req.query.foodIds;

    if(foodItems == undefined || foodItems == null || foodItems == ''){
        res.status(400).send("No Item Id's Given");
        return;
    }

    (async function anon(){
        try{
            let locations = await findAllLocationsServingFoodItemsById(foodItems);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findAllLocationsServingFoodItemsByNames', (req, res) => {
    let foodNames = req.query.foodNames;

    if(foodNames == undefined || foodNames == null || foodNames == ''){
        res.status(400).send("No Item Names Given");
        return;
    }

    (async function anon(){
        try{
            let locations = await findAllLocationsServingFoodItemsByNames(foodNames);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findAllLocationsServingFoodItemOnDate', (req, res) => {
    let foodId = req.query.foodId;
    let date = req.query.date;

    let err_msg = '';
    if(foodId == undefined || foodId == null || foodId == ''){
        err_message += "No Food ID Given";
    }
    if(foodId == undefined || foodId == null || foodId == ''){
        err_msg += "\nNo Date Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }
    
    date = moment().format('YYYY-MM-DD');
    
    (async function anon(){
        try{
            let locations = await findAllLocationsServingFoodItemOnDate(foodId, date);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findAllLocationsServingFoodItemOnDateAtTime', (req, res) => {    
    let foodItem = req.query.foodId;
    let date = req.query.date;
    let time = req.query.time;

    let err_msg = '';
    if(foodItem == undefined || foodItem == null || foodItem == ''){
        err_msg += "No Food ID Given";
    }
    if(date == undefined || date == null || date == ''){
        err_msg += "\nNo Date Given";
    }
    if(time == undefined || time == null || time == ''){
        err_msg += "\nNo Time Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    date = moment(date).format('YYYY-MM-DD');
    (async function anon(){
        try{
            let locations = await findAllLocationsServingFoodItemOnDateAtTime(foodItem, date, time);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findFavoriteLocationsForUser', (req, res) => {
    let uid = req.query.userId;

    let err_msg = '';
    if(uid == undefined || uid == null || uid == ''){
        err_msg += "No User ID Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            let locations = await findFavoriteLocationsForUser(uid);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.post('/addNewFavoriteLocationForUser', (req, res) => {
    let uid = req.query.userId;
    let lid = req.query.locationId;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(uid == undefined || uid == null || uid == ''){
        err_msg += "\nNo User ID Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            await addNewFavoriteLocationForUser(uid, lid);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.delete('/deleteFavoriteLocationFromUser', (req, res) => {
    let uid = req.query.userId;
    let lid = req.query.locationId;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(uid == undefined || uid == null || uid == ''){
        err_msg += "\nNo User ID Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            await deleteFavoriteLocationFromUser(uid, lid);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findAllTimesForLocation', (req, res) => {
    let lid = req.query.locationId;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            let times = await findAllTimesForLocation(lid);
            res.end(JSON.stringify(times));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.get('/findTimesForLocationOnDay', (req, res) => {
    let lid = req.query.locationId;
    let day = req.query.day;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(day == undefined || day == null || day == ''){
        err_msg += "\nNo Day Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            let time = await findTimesForLocationOnDay(day, lid);
            res.end(JSON.stringify(time));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.post('/createLocationTimesForDay', (req, res) => {
    let lid = req.query.locationId;
    let day = req.query.day;
    let open = req.query.openTime;
    let close = req.query.closeTime;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(day == undefined || day == null || day == ''){
        err_msg += "\nNo Day Given";
    }
    if(open == undefined || open == null || open == ''){
        err_msg += "\nNo Open Time Given";
    }
    if(close == undefined || close == null || close == ''){
        err_msg += "\nNo Close Time Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            await createLocationTimesForDay(lid, day, open, close);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.post('/createTimesForEveryDayOfWeekForLocation', (req, res) => {
    let lid = req.query.locationId;
    let open = req.query.openTime;
    let close = req.query.closeTime;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(open == undefined || open == null || open == ''){
        err_msg += "\nNo Open Time Given";
    }
    if(close == undefined || close == null || close == ''){
        err_msg += "\nNo Close Time Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            await createTimesForEveryDayOfWeekForLocation(lid, open, close);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.put('/setMealTimeForLocationOnDay', (req, res) => {
    let lid = req.query.locationId;
    let timeLabel = req.query.timeLabel;
    let time = req.query.time;
    let day = req.query.day;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(day == undefined || day == null || day == ''){
        err_msg += "\nNo Day Given";
    }
    if(timeLabel == undefined || timeLabel == null || timeLabel == ''){
        err_msg += "\nNo Time Label Given";
    }
    if(time == undefined || time == null || time == ''){
        err_msg += "\nNo Time Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            await setMealTimeForLocationOnDay(lid, timeLabel, time, day);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.delete('/deleteLocationTimeRowForDay', (req, res) => {
    let lid = req.query.locationId;
    let day = req.query.day;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(day == undefined || day == null || day == ''){
        err_msg += "\nNo Day Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            await deleteLocationTimeRowForDay(lid, day);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

router.delete('/deleteAllLocationTimes', (req, res) => {
    let lid = req.query.locationId;

    let err_msg = '';
    if(lid == undefined || lid == null || lid == ''){
        err_msg += "No Location ID Given";
    }
    if(err_msg != ''){
        res.status(400).send(err_msg);
    }

    (async function anon(){
        try{
            await deleteAllLocationTimes(lid);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

export default router