const { db } = require('../..')
const generate_string = require('../../helpers/generate_string')

const router = require('express').Router()


//ROUTE 1: POST /api/merchant/api/check_balance
router.post('/check_balance', async (req, res, next) => {
    try {
        const token = req.query.guid
        const UData = await db.collection('merchant_accounts').findOne({ secret_token: token })
        if (!UData) return re.status(400).send({ message: 'Wrong guid token', code: 'INVALID_GUID' })
        res.status(200).send({ message: 'Balance found', data: { balance: UData.balance || 0 } })
        return next()
    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Interval Server Error', code: 'ERROR' })
    }
})

//ROUTE 2: POST /api/merchant/api/pay
router.all('/pay', async (req, res, next) => {
    try {
        const guid = req.query.guid
        const amount = req.query.amount
        const wallet_number = req.query.mobile
        const comment = req.query.comment
        if (!guid || !amount || !wallet_number || !comment) return res.status(400).send({ message: 'Information not completed', code: 'INVALID_PARAMS' })
        let MData = await db.collection('merchant_accounts').findOne({ secret_token: guid })
        if (!(MData)) return res.status(400).send({ message: "Invalid guid token" })
        if (isNaN(amount) || isNaN(wallet_number)) return res.status(400).send({ message: 'Invalid amount', code: 'INVALID_PARAMS' })
        if (parseFloat(amount) > (MData.balance || 0)) return res.status(400).send({ message: 'Merchant account does have enough balance' })
        let UData = await db.collection('user_accounts').findOne({ phone: wallet_number })
        if (!UData) return res.status(400).send({ message: `User with wallet number: ${wallet_number} not found, make sure user created an account on wallet app`, code: 'ACCOUNT_NOT_EXISTS' })
        await db.collection('user_accounts').updateOne({ _id: UData._id }, { $inc: { balance: +(parseFloat(amount)) } })
        await db.collection('merchant_accounts').updateOne({ _id: MData._id }, { $inc: { balance: -(parseFloat(amount)), total_payout: +(parseFloat(amount)) } })
        let transaction_id = 'PAYMENT' + generate_string(10)
        await db.collection("transactions").insertOne({ user_id: UData._id, amount: parseFloat(amount), wallet_number: parseInt(wallet_number), transaction_id, time: new Date().getTime(), type: 'payout', merchant: { id: MData._id, logo: MData.logo || 'https://Task.cb-campaign.in/logo.jpg', name: MData.name } })
        res.status(200).send({ message: 'Payment successfull', data: { transaction_id, amount: parseFloat(amount), wallet_number: parseInt(wallet_number) } })
        next()
    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Interval Server Error', code: 'ERROR' })
    }
})

module.exports = router