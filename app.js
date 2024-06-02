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

// Extra Security Package----------------------
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const { rateLimit } = require('express-rate-limit')

app.set('trust proxy',1)
app.use(helmet())
app.use(cors())
app.use(xss())
// To limit the request as per this limit is 100 per 15 min.
app.use(rateLimit({
    windowMs: 15*60*1000, //15 min
    limit:100 // limit 100 requests per 15 min
}))
//--------------------------------------------
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