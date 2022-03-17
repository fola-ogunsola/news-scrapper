const db = require('./database.js')
function verifyApiKey (req, res, next){
    var api = req.headers['x-access-api']
    let query = 'SELECT * FROM apikeys WHERE api_key = $1'
     db.oneOrNone(query, [api])
     if(!api){
         console.log(api)
       return  res.status(401).send({auth: false, message: "Provide Your api-key"})
     } else {
         next()
     }
}

module.exports = verifyApiKey;

