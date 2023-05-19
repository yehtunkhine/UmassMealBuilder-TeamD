import foodRoutes from '../rest-api/food-rest.js'
import locationRoutes from '../rest-api/location.js'
import userRoutes from '../rest-api/users.js'
import {sequelize, LocationFoodBridge} from '../models.js'
import {Op} from 'sequelize'
import express from 'express'
import moment from 'moment'
import { where } from 'sequelize'
import fill_database from '../database_filler/webscraper/database_enterer.js'
import e from 'express'
import * as process from 'process'
import cors from 'cors'

let app = express()
app.use(cors())
const port = 3001

app.use('', foodRoutes)
app.use('', locationRoutes)
app.use('', userRoutes)

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

while(true){
    try{
        console.log('waiting');
        let currdate = moment().startOf('day').tz('America/New_York').format("YYYY-MM-DD");
        console.log(currdate);
        await LocationFoodBridge.destroy({
            where: {
                Date: {[Op.lt]: currdate}
            }
        });

        await fill_database();
        await new Promise(resolve => setTimeout(resolve, 86400000));
    }
    catch(e){
        console.log(e.message);
        await new Promise(resolve => setTimeout(resolve, 54000));
    }
}