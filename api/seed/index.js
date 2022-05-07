const { DefaultAzureCredential } = require('@azure/identity')
const { SecretClient } = require('@azure/keyvault-secrets')
const jwt = require('jsonwebtoken')

const credential = new DefaultAzureCredential()

const vaultName = process.env.VAULT_NAME

const url = `https://${vaultName}.vault.azure.net`

const client = new SecretClient(url, credential)

//const secretKey = process.env.SECRET_KEY
const secretSeed = process.env.SEED
//const fundingSeed = process.env.FUNDING_SEED
//const sendyAPI = process.env.SENDY_API

module.exports = async function (context, req) {

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