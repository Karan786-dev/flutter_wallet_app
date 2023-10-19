const { ObjectId } = require('mongodb')
const { db } = require('../..')
const authUser = require('../../middleware/user/auth')

const router = require('express').Router()

//ROUTE 1: POST /api/layout/user
router.post('/home', authUser, async (req, res, next) => {
    try {
        const { id: user_id } = req.user
        const userData = await db.collection('user_accounts').findOne({ _id: typeof user_id == 'string' ? new ObjectId(user_id) : user_id })
        if (!userData) return res.status(400).send({ message: 'Account not exist', code: 'ACCOUNT_NOT_EXIST' })
        let transactions = await db.collection('user_transactions').find({ user_id: typeof user_id == 'string' ? new ObjectId(user_id) : user_id }).toArray()
        res.status(200).send({ data: { balance: userData.balance || 0, phone: userData.phone, name: userData.name, transactions } })
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: 'Internal server error' })
    }
})


//ROUTE 2: POST /api/layout/user/getTransactions
router.post('/getTransactions', authUser, async (req, res, next) => {
    try {
        const { id: user_id } = req.user
        let _id = typeof user_id == 'string' ? new ObjectId(user_id) : user_id
        const transactions = await db.collection('transactions').find({
            $or: [
                { ['merchant.id']: _id },
                { user_id: _id }
            ]
        }).sort({ createdAt: -1 }).toArray()
        res.status(200).send({ message: `Found ${transactions.length} transaction `, data: { transactions, _id: _id.toString() } })
        return next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: 'Internal server error' })
    }
})



module.exports = router