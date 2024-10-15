import CryptoJS from "crypto-js"; 
import { serialize ,unserialize } from "php-serialize";  
import { APT_KEY_DEC, APT_DECRYPT_IV_KEY, API_KEY_ENC, API_ENCRYPT_IV_KEY } from "../services/config"; 


class Security { 
    constructor() { }

    encrypt(value, _serialize = false) {
        const iv = API_ENCRYPT_IV_KEY;
        console.log("API_KEY_ENC", API_KEY_ENC);
        console.log("API_ENCRYPT_IV_KEY", API_ENCRYPT_IV_KEY);
        
        const dataToEncrypt = _serialize ? serialize(JSON.stringify(value)) : JSON.stringify(value);

        const encrypted = CryptoJS.AES.encrypt(dataToEncrypt, CryptoJS.enc.Utf8.parse(API_KEY_ENC), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        }).toString();

        const base64Iv = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(iv));
        const mac = CryptoJS.HmacSHA256(base64Iv + encrypted, API_KEY_ENC).toString();

        return { value: encrypted, mac };
    }
  
    decrypt(response, _unserialize = false) { 
        const value= response.data.value;        
        try {         
            const decrypted = CryptoJS.AES.decrypt(value, CryptoJS.enc.Utf8.parse(APT_KEY_DEC), { 
                iv: CryptoJS.enc.Utf8.parse(APT_DECRYPT_IV_KEY), 
                padding: CryptoJS.pad.Pkcs7, 
                mode: CryptoJS.mode.CBC, 
            }).toString(CryptoJS.enc.Utf8);        
            if (!decrypted) { 
                throw new Error("Decryption failed. Invalid data."); 
            } 
            return _unserialize ? unserialize(JSON.parse(decrypted)) : JSON.parse(decrypted); 
        } catch (error) { 
            console.error("Decryption error:", error); 
            throw new Error("DecryptionException - The data could not be decrypted."); 
        } 
    } 
} 

export default Security;