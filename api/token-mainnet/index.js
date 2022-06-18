const jwt = require('jsonwebtoken')

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    const accountId = req.body.accountId
    if(!accountId) context.res.sendStatus(403)
    let token = jwt.sign({accountId: accountId }, process.env["PERSONAS_MAINNET_SECRET_KEY"])
    // jwt.sign({ accountId: accountId }, process.env["PERSONAS_MAINNET_SECRET_KEY"], (err, token) => {
    //   context.res.json({
    //     token
    //   })
    // });
    context.log('token', token)
    if(token){
      context.res.json({
        token
      })
    } else {
      context.res.sendStatus(404)
    }
}