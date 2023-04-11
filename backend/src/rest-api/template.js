import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb');

const jane = User.build({ userId: "123456789", name: "Jane Doe", email: "jane@email.com", phone: "555-555-5555"});
console.log('-----------Created Jane Object-----------------')
console.log(jane instanceof User);
console.log(jane.userId);
console.log(jane.name);
console.log(jane.email);
console.log(jane.phone);

await jane.save()
console.log("Saved Jane")

const users = await User.findAll({
    where: {
        userId: "123456789",
    }
});

users.forEach(user => {
    console.log(user);
    console.log('------------Retrieved Jane Object---------------')
    console.log(user instanceof User);
    console.log(user.userId);
    console.log(user.name);
    console.log(user.email);
    console.log(user.phone);
    console.log('----------------------------');
});

// Delete all rows where name = Jane Doe
await User.destroy({
    where: {
      name: "Jane Doe"
    }
  });

// -------------------------
// Rest API
// -------------------------
const app = express()
const port = 3000

app.get('/endpoint1', (req, res) => {
    res.end('endpoint1');
});

app.get('/endpoint2', (req, res) => {
    res.end('endpoint2');
});

app.get('/endpoint3', (req, res) => {
    res.end('endpoint3');
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});