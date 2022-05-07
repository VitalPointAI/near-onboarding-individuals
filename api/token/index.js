const { DefaultAzureCredential } = require("@azure/identity")
const { SecretClient } = require("@azure/keyvault-secrets")
const jwt = require('jsonwebtoken')

const credential = new DefaultAzureCredential()

const vaultName = process.env.VAULT_NAME
const url = `https://${vaultName}.vault.azure.net`

const client = new SecretClient(url, credential)

// const secretSeed = process.env.SEED
// const fundingSeed = process.env.FUNDING_SEED
// const sendyAPI = process.env.SENDY_API
const secretKey = process.env.SECRET_KEY

module.exports = async function (context, req) {
    const accountId = req.body.accountId
    console.log('account', accountId)
    if(!accountId) context.res.sendStatus(403)
    const latestTokenSecret = await client.getSecret(secretKey)
    
    jwt.sign({ accountId: accountId }, latestTokenSecret.value, (err, token) => {
        context.res.json({
        token
        })
    })
}