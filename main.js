const { Blockchain, Transaction } = require('./blockchain');
const EC = require('elliptic').ec;
// elliptic curve - used in bitcoin as well
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('bd4496733f9061f0d38a9a7f2f228d2a7897cd0b76725e3bfab77f1356ba1981');
const myWalletAddress = myKey.getPublic('hex');

// create blockchain
let kaushikCoin = new Blockchain();
const tx1 = new Transaction(myWalletAddress, 'public key goes here', 70);
tx1.signTransaction(myKey);
kaushikCoin.addTransaction(tx1);

const tx2 = new Transaction(myWalletAddress, 'public key goes here', 70);
tx2.signTransaction(myKey);
kaushikCoin.addTransaction(tx2);

console.log("\nStarting the miner...");
kaushikCoin.minePendingTransactions(myWalletAddress);

console.log("\nBalance of Kaushik is: " + kaushikCoin.getBalanceOfAddress(myWalletAddress)); 

// console.log("\nStarting the miner again...");
kaushikCoin.minePendingTransactions(myWalletAddress);

console.log("\nBalance of Kaushik is: " + kaushikCoin.getBalanceOfAddress(myWalletAddress)); 

console.log("\nIs chain valid: " + kaushikCoin.isChainValid()); 

console.log(JSON.stringify(kaushikCoin, null, 4));