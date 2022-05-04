module.exports = async function (context, req) {
     console.log('context', context)
     console.log('req', req)
    // const accountId = req.body.accountId
    // console.log('account in token', accountId)
    // if(!accountId) res.sendStatus(403)
    context.res.json({
        secret: 'secret'
    })
    // jwt.sign({ accountId: accountId }, latestTokenSecret.value, (err, token) => {
    //     context.res.json({
    //     token
    //     })
    // })
}