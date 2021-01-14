import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { postTransactionRequest } from '../../util/api'
import { MERCHANT_KEY, MID } from '../../util/constants'

import PaytmChecksum from '../../util/PaytmChecksum'

async function sendPaytmRequest(orderId: string) {

    const body = {
        requestType: 'Payment',
        mid: MID,
        websiteName: 'WEBSTAGING',
        orderId,
        callbackUrl: 'https://c84eb0b435e21977d0983f6cce0c1abf.m.pipedream.net',
        txnAmount: {
            value: '1.00',
            currency: 'INR',
        },
        userInfo: {
            custId: 'CUST_001',
        },
    }

    const checksum = await PaytmChecksum.generateSignature(body, MERCHANT_KEY)
    const head = {
        channelId: 'WAP',
        signature: checksum,
    }

    const content = {
        body,
        head,
    }

    return postTransactionRequest(content)
}

export async function createTransaction(request: express.Request, response: express.Response) {
    console.log(request.body)
    try {
        const responseBody = await sendPaytmRequest(uuidv4())
        response.send(responseBody)
    } catch(e) {
        console.error(e)
        response.send({ error: e.message })
    }
}

export async function onTransactionStatusChange(request: express.Request) {
    console.log('status request', request.body)
}
