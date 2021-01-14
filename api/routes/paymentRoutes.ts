import express from 'express'
import { createTransaction, onTransactionStatusChange } from '../controllers/paymentController'

export function handleRoutes(app: express.Express) {
  app.post("/createTransaction", createTransaction)
  app.post("/callback", onTransactionStatusChange)
}
