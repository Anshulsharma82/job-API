const { CustomError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const hanldeErrors = async (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || 500,
        msg: err.message || 'Internal Server Error'
    }
    console.log("Error in handleErrors middleware and the error is:", err)
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ msg: err.message })
    }
    if(err.code === 11000) {
        console.log("keys>>>>>>>>", typeof `${Object.keys(err.errorResponse)}`)
        customError.statusCode = 400
        customError.msg = `Duplicate value for field ${Object.keys(err.keyValue)}, Please provide different value for field ${Object.keys(err.keyValue)}`
    }
    if(err.name === "ValidationError") {
        customError.statusCode = 400
        const msgArr = Object.values(err.errors).map((item) => item.message)
        customError.msg = ""
        for(let i = 0;i<msgArr.length;i++) {
           customError.msg = customError.msg + ". " + msgArr[i]
        }
    }
    if(err.name === "CastError") {
        customError.statusCode = 400
        customError.msg = `Cast to ObjectId failed for value ${err.value}`
    }
    return res.status(customError.statusCode).json({ msg: customError.msg })
    // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
}

module.exports = hanldeErrors