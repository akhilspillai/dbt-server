import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { postTransactionRequest } from '../../util/api'
import { TransactionDetails } from '../models/paymentModel'

export async function createOrder(request: express.Request, response: express.Response) {
    const { amount, currency }: TransactionDetails = request.body
    console.log()
    try {
        const responseBody = await postTransactionRequest({
            amount,
            currency,
            receipt: uuidv4()
          })
        response.send(responseBody)
    } catch(e) {
        console.error(e)
        response.send({ error: e.message })
    }
}
