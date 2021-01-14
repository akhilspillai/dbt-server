import crypto from 'crypto'

class PaytmChecksum {
    private static iv = '@@@@&&&&####$$$$'

    static encrypt(input: string, key: crypto.CipherKey) {
        var cipher = crypto.createCipheriv('AES-128-CBC', key, PaytmChecksum.iv)
        var encrypted = cipher.update(input, 'binary', 'base64')
        encrypted += cipher.final('base64')
        return encrypted
	}

    static decrypt(encrypted: string, key: crypto.CipherKey) {
        var decipher = crypto.createDecipheriv('AES-128-CBC', key, PaytmChecksum.iv)
        var decrypted = decipher.update(encrypted, 'base64', 'binary')
        try {
            decrypted += decipher.final('binary')
        } catch (e) {
            console.log(e)
        }
        return decrypted
	}

    static async generateSignature(params: Record<string, any>, key: crypto.CipherKey) {
        // const value = PaytmChecksum.getStringByParams(params);
        const value = JSON.stringify(params)
        return PaytmChecksum.generateSignatureByString(value, key)
    }

    static verifySignature(params: Record<string, any>, key: crypto.CipherKey, checksum: string) {
        if (params.CHECKSUMHASH) {
            delete params.CHECKSUMHASH
        }
        const value = JSON.stringify(params)
        return PaytmChecksum.verifySignatureByString(value, key, checksum)
    }

    static async generateSignatureByString(params: string, key: crypto.CipherKey) {
        var salt = await PaytmChecksum.generateRandomString(4)
        return PaytmChecksum.calculateChecksum(params, key, salt)
    }

    static verifySignatureByString(params: string, key: crypto.CipherKey, checksum: string) {
        var paytm_hash = PaytmChecksum.decrypt(checksum, key)
        var salt = paytm_hash.substr(paytm_hash.length - 4)
        return paytm_hash === PaytmChecksum.calculateHash(params, salt)
    }

    static generateRandomString(length: number): Promise<string> {
        return new Promise(function (resolve, reject) {
            crypto.randomBytes((length * 3.0) / 4.0, function (err, buf) {
                if (!err) {
                    var salt = buf.toString('base64')
                    resolve(salt)
                } else {
                    console.log('error occurred in generateRandomString: ' + err)
                    reject(err)
                }
            })
        })
    }

    static getStringByParams(params: Record<string, any>) {
        const data: Record<string, any> = {}
        Object.keys(params)
            .sort()
            .forEach((key: string) => {
                data[key] = params[key] !== null && params[key].toLowerCase() !== 'null' ? params[key] : ''
            })
        return Object.values(data).join('|')
    }

    static calculateHash(params: string, salt: string) {
        var finalString = params + '|' + salt
        return crypto.createHash('sha256').update(finalString).digest('hex') + salt
    }
    static calculateChecksum(params: string, key: crypto.CipherKey, salt: string) {
        var hashString = PaytmChecksum.calculateHash(params, salt)
        return PaytmChecksum.encrypt(hashString, key)
    }
}

export default PaytmChecksum
