import fetch from 'node-fetch'
import { PAYTM_TX_URL } from './constants'

export async function postTransactionRequest(content: Record<string, any>): Promise<Record<string, any>> {
    const response = await fetch(`${PAYTM_TX_URL}?mid=${content.mid}&orderId=${content.orderId}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
    })

    console.log(content)

    if (!response.ok) {
        console.error(
            `Failed to send request --> ${response.status} - ${response.statusText} - ${await response.text()}`
        )
    }
    const jsonResponse = await response.json()
    return jsonResponse
}
