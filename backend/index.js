const { MongoClient, ServerApiVersion } = require('mongodb')
const { MONGO_URL } = require('./config')

const client = new MongoClient(MONGO_URL, { writeConcern: { w: 'majority' } })

client.connect()
    .then((client) => {
        const db = client.db('WalletApp')
        exports.db = db
        require('./server')
        console.log('Connected To MongoDB')
        require('./bot')
    })
    .catch((error) => {
        console.log("Error while connecting to MongoDB:", error)
    })