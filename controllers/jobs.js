const jobModel = require('../models/job')
const { StatusCodes } = require('http-status-codes')
const { NotFound, BadRequestError } = require('../errors')
const getAllJobs = async (req,res) => {
    const job = await jobModel.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({job, count: job.length})
}

const getJob = async (req,res) => {
    const { user: {userId}, params: {id: jobId}} = req
    const job = await jobModel.findOne({_id: jobId, createdBy: userId})
    if(!job) {
        throw new NotFound(`No job found for the provided jobId ${jobId}`)
    }
    res.status(200).json({job})
}

const createJob = async (req,res) => {
    req.body.createdBy = req.user.userId
    const job = await jobModel.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req,res) => {
    const {params: {id: jobId}, body: {position, company}, user: {userId}} = req
    if(!position || !company) {
        throw new BadRequestError('Please provide position and company')
    }
    const job = await jobModel.findOneAndUpdate({_id: jobId, createdBy: userId},
        req.body,{new: true, runValidators: true}
    )
    if(!job) {
        throw new NotFound('Job not found')
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async (req,res) => {
    const {params: {id: jobId}, user: {userId}} = req
    const job = await jobModel.findOneAndDelete({_id: jobId, createdBy: userId})
    if(!job) {
        throw new NotFound('Job does not exist')
    }
    res.status(StatusCodes.OK).json({msg: 'Job Deleted Successfully!'})
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}