import foodRoutes from './food-rest.js'
import locationRoutes from './location.js'
import userRoutes from './users.js'
import express from 'express'
import cors from 'cors'

let app = express()
const port = 3001

// Enable CORS for all requests
app.use(cors())

app.use('', foodRoutes)
app.use('', locationRoutes)
app.use('', userRoutes)

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});
