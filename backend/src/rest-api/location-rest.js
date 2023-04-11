const express = require('express')
const app = express()
const port = 3000

const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://umassmealbuilderdb:Umass320!@34.145.185.28:5432/umassmealbuilderdb') // Example for postgres
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
 
testConnection()
  

app.get('/fetchLocationNames', (req, res) => {

    res.end('fetchLocationNames');
});

app.get('/getAllTimesForLocation', (req, res) => {
    res.end('getAllTimesForLocation');
});

app.get('/getOpenCloseTimesForLocation', (req, res) => {
    res.end('getOpenCloseTimesForLocation');
});

app.get('/getOpenCloseTimeForLocationForDay', (req, res) => {
    res.end('getOpenCloseTimeForLocationForDay');
})

app.get('/', (req, res) => {
    res.end('fetchLocationNames');
});

app.get('/getFoodItemsByLocation', (req, res) => {
    res.end('fetchLocationNames');
});

app.get('/getFoodItemsByLocation', (req, res) => {
    res.end('fetchLocationNames');
});

app.get('/getFoodItemsByLocation', (req, res) => {
    res.end('fetchLocationNames');
});

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});