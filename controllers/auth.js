const userModel = require('../models/user')
const { StatusCodes } = require("http-status-codes")
const { BadRequestError, UnauthenticatedError } = require('../errors')
const bcrypt = require('bcryptjs')

const register = async (req, res) => {
    const user = await userModel.create(req.body)
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token: user.createJWT() })
}

const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await userModel.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPwdMatched = await user.comparePassword(password)
    if (!isPwdMatched) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = await user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { register, login }