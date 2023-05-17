const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(express.json());

require('dotenv').config()

const routes = require('./routes/routes.js')
app.use('/', routes)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('Server operating... PORT: ' + port)
})