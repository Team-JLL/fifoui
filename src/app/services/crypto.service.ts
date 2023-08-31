import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  key = 'U2F';
  conversionEncryptOutput?: string;
  conversionDecryptOutput?: string;
  constructor() { }
  encryptData(plainData: string) {
    this.conversionEncryptOutput = CryptoJS.AES.encrypt(plainData.trim(), this.key.trim()).toString();
    return this.conversionEncryptOutput;
  }
  decryptData(decryptedData: string) {
    this.conversionDecryptOutput = CryptoJS.AES.decrypt(decryptedData.trim(), this.key.trim(), {}).toString(CryptoJS.enc.Utf8);
    return this.conversionDecryptOutput;
  }
}

