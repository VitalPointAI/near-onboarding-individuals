const jwt = require('jsonwebtoken')

// Verify Token
function verifyToken(req, res, next){
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
      // Split at the space
      const bearerToken = bearerHeader.split(' ')[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      return req.token
    } else {
      //Forbidden
      return false
    }
}

module.exports = async function (context, req) {
    context.log('AppSeed mainnet trigger function processed a request.');
    context.log('context', context)
    context.log('req', req)
    const token = verifyToken(req)
    context.log('token', token)
    if(token){
    jwt.verify(token, process.env["PERSONAS_MAINNET_SECRET_KEY"], async (err, authData) => {
        if(err) {
          context.res.sendStatus(403);
        } else {
          const appSeed = process.env["PERSONAS_MAINNET_APPSEED"];
          const seed = appSeed.slice(0, 32)
          context.res.json({
            seed: seed,
            authData
          });
        }
      })
    } else {
        context.res.sendStatus(403)
    }
}