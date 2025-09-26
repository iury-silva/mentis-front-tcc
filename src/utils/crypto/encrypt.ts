import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_CRYPT as string;

export function encrypt(data: string): string {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}
