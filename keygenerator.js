const EC = require('elliptic').ec;
// elliptic curve - used in bitcoin as well
const ec = new EC('secp256k1');

const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

console.log("\nPrivate key: " + privateKey);

console.log("\nPublic key: " + publicKey);