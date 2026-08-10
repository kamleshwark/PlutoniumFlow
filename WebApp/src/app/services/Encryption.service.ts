import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  // Generate an encryption key
  async generateKey() {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // Extractable key
      ['encrypt', 'decrypt']
    );
  }

  // Encrypt a string
  async encrypt(data: string, key: CryptoKey) {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Initialization vector

    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encoder.encode(data) // Convert data to byte array
    );

    // Combine the IV with the encrypted data for storage
    return {
      encryptedData: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv.buffer as ArrayBuffer)
    };
  }

  // Decrypt the data
  async decrypt(encryptedData: string, iv: string, key: CryptoKey) {
    const decoder = new TextDecoder();
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: this.base64ToArrayBuffer(iv), // Decode the IV
      },
      key,
      this.base64ToArrayBuffer(encryptedData) // Decode the encrypted data
    );
    return decoder.decode(decrypted); // Convert decrypted byte array to string
  }

  // Helper function to convert ArrayBuffer to base64 string
  arrayBufferToBase64(buffer: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }

  // Helper function to convert base64 string to ArrayBuffer
  base64ToArrayBuffer(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Function to export a key as Base64
  async exportKeyAsBase64(key: CryptoKey) {
    // Export the key to JWK format (use 'raw' for symmetric keys like AES if needed)
    const exportedKey = await crypto.subtle.exportKey('jwk', key);

    // Convert the JWK (JSON Web Key) to a JSON string
    const keyAsJson = JSON.stringify(exportedKey);

    // Encode the JSON string to Base64
    const keyAsBase64 = btoa(keyAsJson);

    return keyAsBase64;
  }

  // Function to retrieve and import the Base64-encoded key
  async importKeyFromBase64(keyAsBase64: any) {

    // // Decode the Base64 key to a JSON string
    const keyAsJson = atob(keyAsBase64);

    // Parse the JSON string back to a JWK object
    const exportedKey = JSON.parse(keyAsJson);

    // Import the key back to a CryptoKey object
    const importedKey = await crypto.subtle.importKey(
      'jwk',                // Format of the key
      exportedKey,           // Key material
      { name: 'AES-GCM' },   // Algorithm the key will be used for
      true,                  // Extractable
      ['encrypt', 'decrypt'] // Allowed key usages
    );
    return importedKey;
  }
}
