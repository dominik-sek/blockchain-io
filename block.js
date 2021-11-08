//create a blockchain block class
const SHA256 = require("crypto-js/sha256");
const asyncFunction = (t) => new Promise(resolve => setTimeout(resolve, t));
class Block {
    
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index; // unique id to keep track of the block
        this.timestamp = timestamp; // time of creation of the block in unix seconds
        this.data = data; // data about the transactions happening in the block
        this.previousHash = previousHash; // index of the previous block
        this.hash = this.calculateHash(); // sha256 hash of the block
        this.nonce = 0; // number of tries to find a valid hash
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp
             + JSON.stringify(this.data) + this.nonce).toString();
    }
    
    proofOfWork = async (difficulty) => {

    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
        console.log("first condition: "+this.hash.substring(0, difficulty))
        console.log("2nd condition: "+Array(difficulty + 1).join("0"))
        // console.log("Block index: "+ this.index)
        //await asyncFunction(1000)
        this.nonce++;
        this.hash = this.calculateHash();
        // console.log("trying: ", this.hash);

    }
    console.log("award:: "+this.hash.substring(0, difficulty))
    console.log("award:: 2: "+Array(difficulty + 1).join("0"))
    // console.log("Block mined: "+ this.index +"has hash: "+ this.hash);
}

} // end of class




class blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; 
    }
    //create a genesis block method
    createGenesisBlock(){
        return new Block(0, Date.now().toString, "Genesis Block", "0");
    }
    //get last block method
    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }
    // add block method
    addBlock(newBlock){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.proofOfWork(this.difficulty);
        this.chain.push(newBlock);
    }
    // check if chain is valid method
    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }

}
test = new blockchain();

test.addBlock(
  new Block(1, Date.now().toString(), {
    sender: "test1",
    recipient: "test2",
    quantity: 1
  })
);
test.addBlock(
  new Block(2, Date.now().toString(), {
    sender: "test2",
    recipient: "test1",
    quantity: 15
  })
);
console.log(JSON.stringify(test,null,4))

// console.log(test)
