const { ObjectId } = require('mongodb')
const { db } = require('../..')
const authUser = require('../../middleware/user/auth')
const generate_string = require('../../helpers/generate_string')

const router = require('express').Router()

//ROUTE 1: POST /api/layout/merchant/home
router.post('/home', authUser, async (req, res, next) => {
    try {
        const { id: user_id } = req.user
        const userData = await db.collection('merchant_accounts').findOne({ _id: typeof user_id == 'string' ? new ObjectId(user_id) : user_id })
        if (!userData) return res.status(400).send({ message: 'Account not exist', code: 'ACCOUNT_NOT_EXIST' })
        res.status(200).send({ data: { balance: userData.balance || 0, phone: userData.phone, name: userData.name } })
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: 'Internal server error' })
    }
})


//ROUTE 2: POST /api/layout/merchant/getToken
router.post('/getToken', authUser, async (req, res, next) => {
    try {
        const { id: user_id } = req.user
        const userData = await db.collection('merchant_accounts').findOne({ _id: typeof user_id == 'string' ? new ObjectId(user_id) : user_id })
        if (!userData) return res.status(400).send({ message: 'Account not exist', code: 'ACCOUNT_NOT_EXIST' })
        res.status(200).send({ message: 'Token generated', token: userData.secret_token })
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: 'Internal server error' })
    }
})

//ROUTE 3: POST /api/layout/merchant/generateNewToken
router.post('/generateNewToken', authUser, (req, res, next) => {
    try {
        const { id: user_id } = req.user
        let newToken = generate_string(5) + '-' + generate_string(5) + '-' + generate_string(5)
        db.collection('merchant_accounts').updateOne({ _id: typeof user_id == 'string' ? new ObjectId(user_id) : user_id }, { $set: { secret_token: newToken } })
        res.status(200).send({ message: 'Generated new token', token: newToken })
        next()
    } catch (error) {
        console.log(error)
        res.status(401).send({ message: 'Internal server error' })
    }
})

//ROUTE 4: POST api/layout/merchant/editProfile
router.post('/editProfile', authUser, async (req, res, next) => {
    try {
        const { id: user_id } = req.user;
        const { name, logo } = req.body;

        // Create an empty update object
        const updateData = {};

        if (name) {
            updateData.name = name;
        }
        if (logo) {
            updateData.logo = logo;
        }


        // Update the merchant's profile in MongoDB
        // Assuming you have a MongoDB collection called 'merchant_accounts'
        const updatedMerchant = await db.collection('merchant_accounts').findOneAndUpdate(
            { _id: typeof user_id == 'string' ? new ObjectId(user_id) : user_id },
            { $set: updateData },
            { returnOriginal: false } // To get the updated document
        );
        console.log(updatedMerchant, user_id)
        if (!updatedMerchant) {
            return res.status(401).json({ message: 'Merchant not found' });
        }
        let data = { mobile: updatedMerchant.phone, name: updatedMerchant.name, email: updatedMerchant.email }
        data.logo = updatedMerchant.logo
        res.status(200).send({ message: 'Merchant profile updated', data: data });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'Internal server error' });
    }
});


//ROUTE 5 : POST /api/layout/merchant/getProfile
router.post('/getProfile', authUser, async (req, res, next) => {
    try {
        const { id: user_id } = req.user
        const userData = await db.collection('merchant_accounts').findOne({ _id: typeof user_id == 'string' ? new ObjectId(user_id) : user_id })
        if (!userData) return res.status(400).send({ message: 'Account not exist', code: 'ACCOUNT_NOT_EXIST' })
        let data = { mobile: userData.phone, name: userData.name, email: userData.email }
        data.logo = userData.logo
        res.status(200).send({ message: 'Profile data found', data: data })
        return next()
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'Internal server error' });
    }
})


module.exports = router