import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CRYPT as string;

export function decrypt(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
