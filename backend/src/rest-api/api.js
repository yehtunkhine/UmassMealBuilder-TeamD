import foodRoutes from './food-rest.js'
import locationRoutes from './location.js'
import userRoutes from './users.js'
import express from 'express'

let app = express()
const port = 3000

app.use('', foodRoutes)
app.use('', locationRoutes)
app.use('', userRoutes)

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});