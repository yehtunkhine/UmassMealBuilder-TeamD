import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes, LocationFoodBridge} from './models.js'
import { Sequelize, Op } from 'sequelize';
import moment from 'moment-timezone'
import express from 'express'

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb');

// Basic Find, Deletes
async function createLocation(name){
    if(name.length > 128){
        throw console.error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
    }

    const location = await Location.create({locationName: name});

    return location;
}

async function deleteLocation(lid){
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

    locations.forEach((id) => deleteLocation(id));
}

async function findLocationByName(name){
    if(name.length > 128){
        throw console.error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
    }

    const locations = await Location.findAll({
        where: {locationName: name}
    });

    return locations;
}

async function getLocationIdsFromName(name){
    if(name.length > 128){
        throw console.error("Location name '" + name + "' is longer than maximum allowed length of 128 characters.");
    }

    const locations = await Location.findAll({
        where: {locationName: name}
    });

    return locations.map((location) => {location.locationId});
}

// Functions involving Food/FoodLocationBridge

// TODO: TEST
async function findAllLocationsServingFoodItems(foodItemIds){
    const locationIds = await LocationFoodBridge.findAll({
            where: {
                foodId: {[Op.in]: foodItemIds},
                Date: {[Op.gte]: 1}
            },
            attributes: ['locationId']
    });

    const locations = await Location.findAll({
        where: {[Op.in]: locationIds}
    });

    return locations;
}

async function getAllLocationsServingFoodItemsByNames(foodNameList){
    const foodIds = await Food.findAll({
        where: {name: {[Op.in]: foodNameList}},
        attributes: ["foodId"]
    });

    const foodIdList = foodIds.map((food) => food.foodId);
    
    return await findAllLocationsServingFoodItems(foodIdList);
}


// TODO: TEST
async function getAllLocationsServingFoodItemOnDate(foodItemId, date){
    let locations = await LocationFoodBridge.findAll({
        where: {
            [Op.and]: {
                foodId: foodItemId,
                Date: date
            }
        },
        attributes: ["locationId"]
    });

    let locationObjects = await Location.findAll({
        where: {[Op.in]: {locationId: locations}}
    });    

    return locationObjects;
}

//TODO: TEST
async function getAllLocationsServingFoodItemOnDateAtTime(foodItem, date, time){
    let locations = await LocationFoodBridge.findAll({
        where: {
            [Op.and]: {
                foodId: foodItem,
                Date: date,
                Time: time
            }
        },
        attributes: ["locationId"]
    });

    let locationObjects = await Location.findAll({
        where: {[Op.in]: {locationId: locations}}
    });
    
    return locationObjects;
}

// User Favorite Location Functions
async function getFavoriteLocationsForUser(uid){
    const user = await User.findOne({
        where: {userId: uid}
    });

    if(user == null){
        throw new Error("No such user exists");
    }

    const favoriteLocations = await Location.findAll({
        include: {
            model: User,
            where: {
                userId: {[Op.eq]: uid}
            },
            through: {attributes: []}
        }
    });

    return favoriteLocations;
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

async function removeFavoriteLocationFromUser(uid, lid){
    const user = await User.findOne({
        where: {userId: uid}
    });

    const location = await Location.findOne({
        where: {locationId: lid}
    });

    let success = false;
    await user.removeLocation(location).then(() => {success = true;});

    if(success == false){
        throw new Error("Could not add location '" + location.locationName + "' as favorite location for user with id '" + user.userId + "'");
    }
}


// Location Times Functions
async function getAllTimesForLocation(lid){
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

async function getTimesForLocationOnDay(dayOfWeek, lid){
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
    const location = Location.findOne({
        where: {
            locationId: lid
        }
    });

    if(lid == null){
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
const app = express()
app.use(express.json())
const port = 3000

app.post('/createLocation', (req, res) => {
    let name = toString(req.body.name);

    (async function anon(){
        let sendVal = await createLocation(name);
        res.end(sendVal)
    })();
});

app.delete('/deleteLocationById', (req, res) => {
    let id = Number(req.body.locationId);

    (async function anon() {
        deleteLocation(id)
            .then(() => {res.end("Succes");})
            .catch(() => {res.end("Failure")});
    })();
});

app.delete('/deleteLocationByName', (req, res) => {
    let name = req.body.locationName;

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

app.get('/getLocationByName:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);
    let name = jsonParams.name;

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

app.get('/getLocationIdsByName:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);
    let name = jsonParams.name;

    (async function anon(){
        try{
            let locationIds = await getLocationIdsFromName(name);
            res.end(JSON.stringify(locationIds));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.get('/findAllLocationsServingFoodItems:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);
    let foodItems = jsonParams.foodItems;

    (async function anon(){
        try{
            let locations = await findAllLocationsServingFoodItems(foodItems);
            res.end(JSON.stringify(locationIds));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});


app.get('/getAllLocationsServingFoodItemOnDate:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);
    let foodId = jsonParams.foodItemId;
    let date = jsonParams.date;

    (async function anon(){
        try{
            let locations = await getAllLocationsServingFoodItemOnDate(foodId, date);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.get('/getAllLocationsServingFoodItemOnDateAtTime:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let foodItem = jsonParams.foodItemId;
    let date = jsonParams.date;
    let time = jsonParams.time;

    (async function anon(){
        try{
            let locations = await getAllLocationsServingFoodItemOnDateAtTime(foodItem, date, time);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.get('/getAllLocationsServingFoodByNames:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let foodNames = jsonParams.foodNames;

    (async function anon(){
        try{
            let locations = await getAllLocationsServingFoodItemsByNames(foodNames);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.get('/getFavoriteLocationsForUser:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let uid = jsonParams.userId;

    (async function anon(){
        try{
            let locations = await getFavoriteLocationsForUser(uid);
            res.end(JSON.stringify(locations));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.post('/addNewFavoriteLocationForUser', (req, res) => {

    let uid = req.body.userId;
    let lid = req.body.locationId;

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

app.delete('/removeFavoriteLocationFromUser', (req, res) => {
    let uid = req.body.userId;
    let lid = req.body.locationId;

    (async function anon(){
        try{
            await removeFavoriteLocationFromUser(uid, lid);
            res.end("Success");
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.get('/getAllTimesForLocation:lid', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let lid = jsonParams.locationId;

    (async function anon(){
        try{
            let times = await getAllTimesForLocation(lid);
            res.end(JSON.stringify(times));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.get('/getTimesForLocationOnDay:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let lid = jsonParams.locationId;
    let day = jsonParams.day;

    (async function anon(){
        try{
            let time = await getTimesForLocationOnDay(day, lid);
            res.end(JSON.stringify(time));
        }
        catch(e){
            res.end(e.message);
        }
    })();
});

app.get('/createLocationTimesForDay:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let lid = jsonParams.locationId;
    let day = jsonParams.day;
    let open = jsonParams.openTime;
    let close = jsonParams.closeTime;

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

app.get('/createTimesForEveryDayOfWeekForLocation:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let lid = jsonParams.locationId;
    let open = JjsonParams.openTime;
    let close = jsonParams.closeTime;

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

app.get('/setMealTimeForLocationOnDay:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let lid = jsonParams.locationId;
    let timeLabel = jsonParams.timeLabel;
    let time = jsonParams.time;
    let day = jsonParams.day;

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

app.get('/deleteLocationTimeRowForDay:jsonParams', (req, res) => {
    let jsonParams = JSON.parse(req.params.jsonParams);

    let lid = jsonParams.locationId;
    let day = jsonParams.day;

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

app.delete('/deleteAllLocationTimes', (req, res) => {
    let lid = req.body.locationId;

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

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});