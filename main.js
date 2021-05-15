const SHA256 = require('crypto-js/sha256');

/**
 * A block on a blockchain
 */

class Block {
    /**
     * 
     * @param {int} index Optional - indicates where the block sits on the chain
     * @param {Date} timestamp Block created
     * @param {Object} data Type of data associated with the block (Example: Transaction details)
     * @param {String} previousHash Hash of the previous block
     */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        // hash of this block
        this.hash = this.calculateHash();
    }

    /**
     * 
     * @returns SHA256 string which will be the hash of the current block
     */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

/**
 * A Blockchain
 */
class Blockchain {
    constructor() {
        // initialize the chain with one block
        this.chain = [this.createGenesisBlock()];
    }

    /**
     * Creates a first block on the blockchain
     * The first block on a blockchain is called 'Genesis Block'
     */
    createGenesisBlock() {
        return new Block(0, "15/05/2021", "Genesis block", "0")
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
     * @param {*} newBlock 
     */
    addBlock(newBlock) {
        // set previous hash to the hash of the last block on the chain
        newBlock.previousHash = this.getLatestBlock().hash;
        // re-calculate the hash as data was changed in the previous step
        newBlock.hash = newBlock.calculateHash();
        // push the block to the chain
        this.chain.push(newBlock);
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

// create blockchain and add 2 blocks
let kaushikCoin = new Blockchain();
kaushikCoin.addBlock(new Block(1, "15/05/2021", { amount: 420 }));
kaushikCoin.addBlock(new Block(2, "15/05/2021", { amount: 69 }));

console.log("Is blockchain valid? " + kaushikCoin.isChainValid());

kaushikCoin.chain[1].data = { amount: 100 };

console.log("Is blockchain valid? " + kaushikCoin.isChainValid());

// console.log(JSON.stringify(kaushikCoin, null, 4));