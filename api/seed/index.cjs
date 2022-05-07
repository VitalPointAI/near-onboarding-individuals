import { DefaultAzureCredential } from '@azure/identity'
import { SecretClient } from '@azure/keyvault-secrets'

const credential = new DefaultAzureCredential()

const vaultName = process.env["VAULT_NAME"]

const url = `https://${vaultName}.vault.azure.net`

const client = new SecretClient(url, credential)

//const secretKey = process.env.SECRET_KEY
const secretSeed = process.env["SEED"]
//onst fundingSeed = process.env.FUNDING_SEED
//const sendyAPI = process.env.SENDY_API

export default async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    const latestSecret = await client.getSecret(secretSeed)
    const seed = (latestSecret.value).slice(0, 32)

    const responseMessage = seed
      
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}