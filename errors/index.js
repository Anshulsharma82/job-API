const CustomError = require('./customError')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const NotFound = require('./not-found')

module.exports = {
    CustomError,
    BadRequestError,
    UnauthenticatedError,
    NotFound
}