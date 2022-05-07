
// const { DefaultAzureCredential } = require("@azure/identity")
// const { SecretClient } = require("@azure/keyvault-secrets")

// const credential = new DefaultAzureCredential()
// console.log('credential', credential)

const vaultName = process.env.VAULT_NAME
console.log('vault name', vaultName)

const url = `https://${vaultName}.vault.azure.net`
console.log('url', url)

const client = new SecretClient(url, credential)
console.log('client', client)

const secretKey = process.env.SECRET_KEY
console.log('secretkey', secretKey)
// const secretSeed = process.env.SEED
// const fundingSeed = process.env.FUNDING_SEED
// const sendyAPI = process.env.SENDY_API

// const latestTokenSecret = await client.getSecret(secretKey)
// console.log('latesttoken', latestTokenSecret)

module.exports = async function (context, req) {
    // const accountId = req.body.accountId
    // console.log('account in token', accountId)
    // if(!accountId) res.sendStatus(403)
    context.res.json({
        secret: 'yes'
    })
    // jwt.sign({ accountId: accountId }, latestTokenSecret.value, (err, token) => {
    //     context.res.json({
    //     token
    //     })
    // })
}