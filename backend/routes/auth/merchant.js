const { db } = require('../..')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { JWT_SECRET } = require('../../config')
const generate_string = require('../../helpers/generate_string')
const authUser = require('../../middleware/user/auth')

const router = require('express').Router()

//ROUTE 1: PORT /api/auth/merchant/register
router.post('/register', async (req, res, next) => {
    try {
        let { phone, password, name, email } = req.body
        if (!phone || !password || !name || !email) {
            return res.status(400).send({ message: 'Information not completed', code: 'INCORRECT_PARAMS' })
        }
        email = email.toLowerCase().trimEnd()
        name = name.trimEnd()
        password = password.trimEnd()
        phone = phone.toString()
        phone.trimEnd()
        if (phone.length != 10) return res.status(400).send({ message: 'Incorrect phone number', code: 'INCORRECT_PARAMS' })
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).send({ message: 'Incorrect email address', code: 'INCORRECT_EMAIL' })
        let old_data = await db.collection('merchant_accounts').findOne({
            $or: [
                { phone },
                { email }
            ]
        })
        if (old_data) return res.status(400).send({ message: 'Account already existed', code: 'ACCOUNT_ALREADY_EXIST' })
        let salt = await bcrypt.genSalt(10)
        let password_hash = await bcrypt.hash(password, salt)
        let insertedData = await db.collection('merchant_accounts').insertOne({ phone, name,email, password: password_hash ,secret_token: generate_string(5)+'-'+generate_string(5)+'-'+generate_string(5)})
        let data = {
            id: insertedData.insertedId.toString()
        }
        const token = jwt.sign(data, JWT_SECRET);
        res.status(200).send({ message: 'Account registered', token })
        next()
    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Interval Server Error', code: 'ERROR' })
    }
})

//ROUTE 2: POST /api/auth/merchant/login
router.post('/login',async (req, res, next) => {
    try {
        let { phone, password } = req.body
        if (!phone || !password) return res.status(400).send({ message: 'Information is not valid', code: 'INCORRECT_PARAMS' })
        const userData = await db.collection('merchant_accounts').findOne({ phone: phone })
        if (!userData) return res.status(400).send({ message: 'Account does not exists', code: 'ACCOUNT_NOT_EXIST' })
        const passwordCompare = await bcrypt.compare(password, userData.password)
        if (!passwordCompare) return res.status(400).send({ message: "Incorrect details", error: 'INVALID_DETAILS' })
        const data = {
            id: userData._id.toString()
        }
        const token = jwt.sign(data, JWT_SECRET)
        res.status(200).send({ message: 'Login success', token })
        next()
    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Interval Server Error', code: 'ERROR' })
    }
})


module.exports = router