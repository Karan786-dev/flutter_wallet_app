const { db } = require('../..')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { JWT_SECRET } = require('../../config')
const authUser = require('../../middleware/user/auth')
const send_email = require('../../helpers/send_email')
const generate_string = require('../../helpers/generate_string')
const { ObjectId } = require('mongodb')

const router = require('express').Router()

//ROUTE 1: PORT /api/auth/user/register
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
        let old_data = await db.collection('user_accounts').findOne({
            $or: [
                { phone },
                { email }
            ]
        })
        if (old_data) return res.status(400).send({ message: 'Account already existed', code: 'ACCOUNT_ALREADY_EXIST' })
        let salt = await bcrypt.genSalt(10)
        let password_hash = await bcrypt.hash(password, salt)
        let insertedData = await db.collection('user_accounts').insertOne({ phone, name, email, password: password_hash })
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

//ROUTE 2: POST /api/auth/user/login
router.post('/login', async (req, res, next) => {
    try {
        let { phone, password } = req.body
        if (!phone || !password) return res.status(400).send({ message: 'Information is not valid', code: 'INCORRECT_PARAMS' })
        const userData = await db.collection('user_accounts').findOne({ phone: phone })
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

let reset_tokens = {}

//ROUTE 3: POST /api/auth/user/reset
router.post('/reset', async (req, res, next) => {
    try {
        let { email } = req.body
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).send({ message: 'Incorrect email', code: 'INVALID_PARAMS' })
        let uData = await db.collection('user_accounts').findOne({ email })
        if (!uData) return res.status(400).send({ message: 'User account not found', code: 'ACCOUNT_NOT_EXISTS' })
        let reset_token = generate_string(10)
        reset_tokens[reset_token] = uData._id.toString()
        setTimeout(() => {
            delete reset_tokens[reset_token]
        }, 60 * 60 * 1000);
        send_email(
            email,
            'Password reset code: ' + reset_token + '\n\nThis code is only valid for 1 hour',
            'Verification code'
        )
        res.status(200).send({ message: 'Verification code is sended to registered email' })
        console.log(reset_token)
    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Interval Server Error', code: 'ERROR' })
    }
})

//ROUTE 4: POST /api/auth/user/verify
router.post('/verify', async (req, res, next) => {
    try {
        let {
            verification_code,
            new_password
        } = req.body
        if (!(verification_code in reset_tokens)) return res.status(400).send({ message: 'Invalid verification code', code: 'INVALID_CODE' })
        if (!new_password) return res.status(400).send({ message: 'New password is required' })
        let u_id = reset_tokens[verification_code]
        let uData = await db.collection('user_accounts').findOne({ _id: new ObjectId(u_id) })
        if(!uData) return res.status(400).send({message:'Invalid verification code',code:'INVALID_CODE'})
        let salt = await bcrypt.genSalt(10)
        let password_hash = await bcrypt.hash(new_password, salt)
        await db.collection('user_accounts').updateOne({_id:new ObjectId(u_id)},{$set:{password:password_hash}})
        res.status(200).send({message:'Password changed succesfully'})

    } catch (err) {
        console.log(err)
        res.status(401).send({ message: 'Interval Server Error', code: 'Error' })
    }
})

module.exports = router

