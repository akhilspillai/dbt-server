import express from 'express'
import bodyParser from 'body-parser'
import { handleRoutes } from './api/routes/paymentRoutes'

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

handleRoutes(app)
app.listen(3000, '0.0.0.0', 10)

console.log('Payment server started on: ' + port)
