const signToken = (req, res, next) => {
    const authToken = req.header["authorization"]
    if (authToken == undefined) {
        console.log(authToken);
        next()
    } else {
        res.statusCode(403)
    }
}