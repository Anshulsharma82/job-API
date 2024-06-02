require('express-async-errors')
require('dotenv').config()
const express = require('express')
const dbConnect = require('./db/connect')
const  authRoute = require('./routes/auth')
const jobsRoute = require('./routes/jobs')
const routeNotFound = require('./middleware/routeNotFound')
const handleError = require('./middleware/handle-error')
const authenticateUser = require('./middleware/authorization')
const app = express()

app.use(express.json())
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/jobs', authenticateUser, jobsRoute)
app.use(routeNotFound)
app.use(handleError)

const PORT = process.env.PORT || 8080
const start = async () => {
    try {
        await dbConnect(process.env.MONGO_URL)
        console.log("Connected to DB!")
        app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}...`))
    } catch (err) {
        console.log("Error in app file and error is:", err)
    }
}

start()