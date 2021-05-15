const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

/**
 * A block on a blockchain
 */

class Block {
    /**
     * 
     * @param {Date} timestamp Block created
     * @param {Object} transactions List of transactions
     * @param {String} previousHash Hash of the previous block
     */
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        // hash of this block
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    /**
     * 
     * @returns SHA256 string which will be the hash of the current block
     */
    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    /**
     * Mines a block and verifies if the hash value has the number of zeroes set by difficulty
     * Same method is used in bitcoin mining.
     * @param {int} difficulty Length of characters to be checked
     */
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce += 1;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

/**
 * A Blockchain
 */
class Blockchain {
    constructor() {
        // initialize the chain with one block
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    /**
     * Creates a first block on the blockchain
     * The first block on a blockchain is called 'Genesis Block'
     */
    createGenesisBlock() {
        return new Block(Date.now(), "Genesis block", "0")
    }

    /**
     * 
     * @returns Last block on the blockchain
     */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * 
     * @param {Object} newBlock New block to be added
     */
    addBlock(newBlock) {
        // set previous hash to the hash of the last block on the chain
        newBlock.previousHash = this.getLatestBlock().hash;
        // mine block
        newBlock.mineBlock(this.difficulty);
        // push the block to the chain
        this.chain.push(newBlock);
    }

    /**
     * Miner - Validate a set of transactions and allocate them to a block, and in turn earn a reward
     * @param {String} miningRewardAddress Address of the miner's wallet
     */
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log("Blocked successfully mined!");
        this.chain.push(block);
        
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    /**
     * Adds a transaction to the pending transactions list
     * @param {Transaction} transaction Transaction includes from & to address, amount
     */
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }


    /**
     * Retrieve the balance of the given address
     * @param {String} address Wallet address
     * @returns Balance amount
     */
    getBalanceOfAddress(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const transaction of block.transactions) {
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }

                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }

        return balance;
    }

    /**
     * A block should not be modified without invalidating rest of the chain
     * @returns true if data in every block is not tampered.
     */
    isChainValid() {
        // loop through the chain, avoid i = 0, since it's a genesis block
        for (let i = 1; i < this.chain.length; i += 1) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            // Re-calculate hash. The hash value would be changed if any data is tampered.
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // check if previous hash is accurate
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            
            return true;
        }
    }
}

// create blockchain
let kaushikCoin = new Blockchain();
kaushikCoin.createTransaction(new Transaction('address1', 'address2', 100));
kaushikCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.log("\nStarting the miner...");
kaushikCoin.minePendingTransactions('kaushiks-address');

console.log("\nBalance of Kaushik is: " + kaushikCoin.getBalanceOfAddress('kaushiks-address')); 

console.log("\nStarting the miner...");
kaushikCoin.minePendingTransactions('kaushiks-address');

console.log("\nBalance of Kaushik is: " + kaushikCoin.getBalanceOfAddress('kaushiks-address')); 