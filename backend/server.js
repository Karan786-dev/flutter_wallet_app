const express = require('express')
const { createServer } = require('http')
const path = require('path')
const { PORT } = require('./config')
const app = express()
const http = createServer(app)
const cors = require('cors')

//Allow requests from our origin
app.use(cors({
    origin: '*',
    optionSuccessStatus: 200,
}))

app.use(express.json())

http.listen(process.env.PORT || PORT, (error) => {
    if (error) throw new Error(error)
    console.log('Server listining to: ', process.env.PORT || PORT)
})

app.use('/api/auth/user', require('./routes/auth/user'))
app.use('/api/auth/merchant', require('./routes/auth/merchant'))
app.use('/api/layout/merchant', require('./routes/layout/merchant'))
app.use('/api/layout/user', require('./routes/layout/user'))

app.use('/api/merchant/api',require('./routes/api/merchant'))