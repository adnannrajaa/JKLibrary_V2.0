import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
import { PayloadCryptography } from '../../@shared/constants/constant';
@Injectable({
    providedIn: 'root'
})
export class CryptographyService {
    private key = enc.Utf8.parse(PayloadCryptography.Key);
    private iv = enc.Utf8.parse(PayloadCryptography.IV);
    constructor() { }
    // Methods for the encrypt and decrypt Using AES
    encryptPayload(text:any): any {
        if (text == null || text == "" || text.length < 0) {
            return "";
        }
        const serializedBody = JSON.stringify(text);
        const ciphertext = AES.encrypt(serializedBody, this.key, { iv: this.iv });
        var encryptedText = ciphertext.toString();
        var obj = {
            payload: encryptedText
        };
        return obj;
    }
    decryptPayload(response: any) {
        var encryptedText = response?.payload;
        if (encryptedText == null || encryptedText == "" || encryptedText.length < 0) {
            return "";
        }
        const decryptedText = AES.decrypt(encryptedText, this.key, { iv: this.iv });
        const decryptedBody = JSON.parse(decryptedText.toString(enc.Utf8));
        return decryptedBody;
    }
    decryptImageURL(imageUrl: string) {
        const decryptedText = AES.decrypt(imageUrl, this.key, { iv: this.iv });
        const decryptedBody = JSON.parse(decryptedText.toString(enc.Utf8));
        return decryptedBody;
    }
}
