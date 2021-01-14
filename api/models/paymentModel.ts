export interface TransactionDetails {
    amount: number
    currency: string
}

export interface ErrorResponse {
    error: ErrorMsg
}

export interface ErrorMsg {
    code: string
    description: string
}
