const routeNotFound = async (req,res) => {
    res.status(404).json({msg: 'Route not found.'})
}

module.exports = routeNotFound