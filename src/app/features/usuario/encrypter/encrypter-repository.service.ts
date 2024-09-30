import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private key = '9!@#$%^&*()_+[';  // Usa una clave segura y mantenla secreta

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.key).toString();
  }

  decrypt(value: string): string {
    const bytes = CryptoJS.AES.decrypt(value, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
