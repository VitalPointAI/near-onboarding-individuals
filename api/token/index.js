const jwt = require('jsonwebtoken')
const { DefaultAzureCredential } = require("@azure/identity")
const { SecretClient } = require("@azure/keyvault-secrets")

const credential = new DefaultAzureCredential()

const vaultName = process.env.VAULT_NAME

const url = `https://${vaultName}.vault.azure.net`

const client = new SecretClient(url, credential)

const secretKey = process.env.SECRET_KEY
const secretSeed = process.env.SEED
const fundingSeed = process.env.FUNDING_SEED
const sendyAPI = process.env.SENDY_API

module.exports = async function (context, req) {
    const accountId = req.body.accountId
    console.log('account in token', accountId)
    if(!accountId) res.sendStatus(403)
    const latestTokenSecret = await client.getSecret(secretKey)
    jwt.sign({ accountId: accountId }, latestTokenSecret.value, (err, token) => {
        context.res.json({
        token
        })
    })
}