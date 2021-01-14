import base64 from 'base-64'
import fetch from 'node-fetch'
import { ErrorResponse } from '../api/models/paymentModel'
import { PAYTM_TX_URL, KEY_ID, KEY } from './constants'

export async function postTransactionRequest(content: Record<string, any>): Promise<Record<string, any>> {
    const authorization = base64.encode(`${KEY_ID}:${KEY}`)
    const response = await fetch(PAYTM_TX_URL, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${authorization}`
        },
        body: JSON.stringify(content),
    })

    console.log(content)

    if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json()
        console.error(
            `Failed to send request --> ${response.status} - ${response.statusText} - ${}`
        )
        return { error: errorResponse.error.description }
    }
    const jsonResponse = await response.json()
    return jsonResponse
}
