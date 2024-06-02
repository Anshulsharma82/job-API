const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name'],
        minLength: [4, 'name should have atleast 4 characters'],
        maxLength: [50, 'name should have atmost 50 characters']
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: [8, 'password should contain atleast 8 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        unique: true, // need to check and verify,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    }
})

// This will be hit authomatically before we do the DB call of creating the doc..
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

// This we can use after getting the model...
userSchema.methods.createJWT = function () {
    const token = jwt.sign({ name: this.name, userId: this._id }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION_TIME })
    return token
}

userSchema.methods.comparePassword = async function (dbPWD) {
    return await bcrypt.compare(dbPWD, this.password)
}

const userModel = mongoose.model('user', userSchema)

module.exports = userModel