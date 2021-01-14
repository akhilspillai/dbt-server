import express from 'express'
import { createOrder } from '../controllers/paymentController'

export function handleRoutes(app: express.Express) {
  app.post("/createOrder", createOrder)
}
