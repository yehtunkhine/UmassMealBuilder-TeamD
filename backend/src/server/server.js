import foodRoutes from '../rest-api/food-rest.js'
import locationRoutes from '../rest-api/location.js'
import userRoutes from '../rest-api/users.js'
import {sequelize, LocationFoodBridge} from '../rest-api/models.js'
import {Op} from 'sequelize'
import express from 'express'
import moment from 'moment'
import { where } from 'sequelize'

let app = express()
const port = 3000

app.use('', foodRoutes)
app.use('', locationRoutes)
app.use('', userRoutes)

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});

while(true){
    console.log('waiting');
    let currdate = moment().startOf('day').tz('America/New_York').format("YYYY-MM-DD");
    console.log(currdate);
    await LocationFoodBridge.destroy({
        where: {
            Date: {[Op.lt]: currdate}
        }
    });
    
    await new Promise(resolve => setTimeout(resolve, 86400));
}