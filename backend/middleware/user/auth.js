const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config')
const { db } = require('../..')
const { ObjectId } = require('mongodb')

const authUser = async (req, res, next) => {
    try {
        const token = req.header('auth-token')
        if (!token) return res.status(401).send({ message: 'Authenticate error', code: 'AUTH_ERROR' })
        const data = jwt.verify(token, JWT_SECRET)
        const promises = [
            new Promise(async (resolve, reject) => {
                var blockedID = await db.collection('user_accounts').findOne({ _id: new ObjectId(data.id), blocked: true })
                resolve(blockedID ? true : false)
            }),
            new Promise(async (resolve, reject) => {
                var blockedID = await db.collection('merchant_accounts').findOne({ _id: new ObjectId(data.id), blocked: true })
                resolve(blockedID ? true : false)
            })
        ]
        const promisesResult = await Promise.all(promises)
        if (promisesResult.includes(true)) return res.status(400).send({ message: 'Account is blocked' ,code:'ACCOUNT_BLOCKED'})
        req.user = data
        next();
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: 'Authenticate error', code: 'AUTH_ERROR' })
    }
}

module.exports = authUser