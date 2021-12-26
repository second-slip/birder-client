module.exports = (req, res, next) => {
    // res.header('X-Hello', 'World123')
    // next()
    if (req.method === 'POST' && req.originalUrl === '/authToken') {
        return res.jsonp({
            "authenticationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZHJldy5jcm9zczExQGdtYWlsLmNvbSIsInVuaXF1ZV9uYW1lIjoiQW5kcmV3IiwiSW1hZ2VVcmwiOiJodHRwczovL2ltZy5pY29uczguY29tL2NvbG9yLzk2LzAwMDAwMC91c2VyLnBuZyIsIkRlZmF1bHRMYXRpdHVkZSI6IjUzLjQ0MjU5MzQiLCJEZWZhdWx0TG9uZ2l0dWRlIjoiLTIuMjc2OTA1MiIsIkZsaWNrcktleSI6IjAzMzM4ZTJjOThiNTA3YWFmOWZiZDBmOGYwNDU1ODFiIiwiTWFwS2V5IjoiQUl6YVN5RDRJZ2hxSTR4N1NsZDlLUDNzUDZGdGJON3dDUEd5U21ZIiwianRpIjoiNzNhMGQ1NTQtZGM0ZS00NWFmLThkOGItZGQyNzVjMWU3YmE5IiwiZXhwIjoxNjQwNjQ3NTAyLCJpc3MiOiJodHRwczovL2JpcmRlcndlYi5jb20iLCJhdWQiOiJodHRwczovL2JpcmRlcndlYi5jb20ifQ.gyrS6ZvHQGl-LjXYcq3cXh7NcFyz9YdQzmmJNMLDKT8",
            "failureReason": "0"
        })
    }
    next()
}