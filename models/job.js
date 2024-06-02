const mongoose = require('mongoose')
const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide company name'],
        maxLenght: 50
    },
    position: {
        type: String,
        required: [true, 'Please provide the position'],
        maxLenght: 100
    },
    status: {
        type: String,
        enum: ['interview','pending','decline'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: [true, 'Please provide createdBy']
    }
}, {timestamps: true})

module.exports = mongoose.model('job',jobSchema)