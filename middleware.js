module.exports = (req, res, next) => {
    // res.header('X-Hello', 'World123')
    // next()
    if (req.method === 'POST' && req.originalUrl === '/authToken') {
        return res.jsonp({
            "authenticationToken": "string",
            "failureReason": "0"
        })
    }
    next()
}