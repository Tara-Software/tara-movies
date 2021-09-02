import { SHA256 } from "crypto-js";

export default function hash_password(password) {
    const hash = SHA256(password).toString();
    return hash;
}