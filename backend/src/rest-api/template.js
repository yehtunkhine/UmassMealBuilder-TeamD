import {User, Food, FoodRestriction, UserRestriction, Meal, Location, LocationTimes} from './models.js'
import { Sequelize, Op } from 'sequelize';
import express from 'express'

const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb');

async function createJaneDoe(){
    const jane = await User.create({ userId: Date.now() + '', name: "Jane Doe", email: "jane@email.com", phone: "555-555-5555"});
    console.log('-----------Created Jane Object-----------------')
    console.log(jane instanceof User);
    console.log(jane.userId);
    console.log(jane.name);
    console.log(jane.email);
    console.log(jane.phone);
    console.log("Saved Jane")
    return "Created " + JSON.stringify(jane)
}

async function findJaneDoe(){
    let list = []
    const users = await User.findAll({
        where: {
            name: "Jane Doe",
        }
    });
    
    users.forEach(user => {
        list.push({
            id: user.userId,
            name: user.name,
            email: user.email,
            phone: user.phone
        })
    });
    
    return list
}

// Delete all rows where name = Jane Doe
async function deleteJaneDoe(){
    await User.destroy({
        where: {
          name: "Jane Doe"
        }
      });
    
      return "Deleted Jane Does'"
}

// -------------------------
// Rest API
// -------------------------
const router = express.Router()

router.get('/createUser', (req, res) => {
    (async function createAndSend(){
        let sendVal = await createJaneDoe()
        res.end(sendVal)
    })();
});

router.get('/getUsers', (req, res) => {
    (async function getAndSend() {
        let users = await findJaneDoe()
        let str = JSON.stringify(users)
        res.end(str);
    })();
});

router.get('/deleteUsers', (req, res) => {
    (async function deleteAndSend(){
        let retVal = await deleteJaneDoe();
        res.end(retVal);
    })();
});

export default router