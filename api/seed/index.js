const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')
const jwt = require('jsonwebtoken')

const credential = new DefaultAzureCredential()

const vaultName = process.env.VAULT_NAME

const url = `https://${vaultName}.vault.azure.net`

const client = new SecretClient(url, credential)

const secretKey = process.env.SECRET_KEY
const secretSeed = process.env.SEED
//const fundingSeed = process.env.FUNDING_SEED
//const sendyAPI = process.env.SENDY_API

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
      next();
    } else {
      //Forbidden
      res.sendStatus(403);
    }
}

module.exports = async function (context, req) {
  const latestTokenResponse = await client.getSecret(secretKey)
  jwt.verify(req.token, latestTokenResponse.value, async (err, authData) => {
    if(err) {
      context.res.sendStatus(403);
    } else {
      const latestSecret = await client.getSecret(secretSeed)
      const seed = (latestSecret.value).slice(0, 32)
      context.res.json({
        seed: seed,
        authData
      });
    }
  })

}