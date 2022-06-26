const jwt = require('jsonwebtoken')
const { Client } = require('pg')

const client = new Client({
  host: "mainnet.db.explorer.indexer.near.dev",
  user: "public_readonly",
  port: 5432,
  password: "nearprotocol",
  database: "mainnet_explorer",
});

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
  context.log('Activity mainnet trigger function processed a request.');
  const token = verifyToken(req)
  if(token){
    try{
      let verified = jwt.verify(token, process.env["PERSONAS_MAINNET_SECRET_KEY"])
      if(verified){
        client.connect()
        context.log('req', req)
        const { rows } = await client.query(`SELECT * FROM action_receipt_actions WHERE (receipt_predecessor_account_id=${req.body.accountId} OR receipt_receiver_account_id=${req.body.accountId})`)
        context.res.json({
          activity: rows
        });
      } else {
        context.res.sendStatus(403);
      }
    } catch (err) {
      context.log('error', err)
      context.res.sendStatus(403);
    }
  }
}