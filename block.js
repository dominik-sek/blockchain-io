//create a blockchain block class
const SHA256 = require("crypto-js/sha256");
const asyncFunction = (t) => new Promise(resolve => setTimeout(resolve, t));
class Block {
    
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index; // unique id to keep track of the block
        this.timestamp = timestamp; // time of creation of the block in unix seconds
        this.data = data; // data about the transactions happening in the block
        this.previousHash = previousHash; // index of the previous block
        this.nonce = 0; 
        this.hash = this.calculateHash(); // sha256 hash of the block
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp
             + JSON.stringify(this.data) + this.nonce).toString(); 
    }
        //Choosing leading zeroes for a “nonce” is just a convention. You could specify any sequence of leading digits,
         //and the difficulty would be the same. Instead of “000” you could look for “123”. The difficulty lies in matching a specified sequence, 
         //and each possible sequence is equally difficult to match. 
        //The difficulty stems from having to match an exact sequence, not from the values that sequence has.
    proofOfWork = async (difficulty) => {

    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){ // 
        // console.log(this.hash.substring(0, difficulty))
        //await asyncFunction(1000)
        this.nonce++;
        this.hash = this.calculateHash();

        //block no: ${this.index} 
        console.log(`trying: ${this.hash} `);

    }

    console.log("Block mined: "+ this.hash);
}

} // end of block class




class blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; 
    }
   
    createGenesisBlock(){
        return new Block(0, Date().toString, "Genesis Block", "0");
    }
    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.proofOfWork(this.difficulty);
        this.chain.push(newBlock);
    }
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
var date = new Date(Date.now());
function getDate(){
    return date.getDate() 
    + "/" + date.getMonth() 
    + "/" + date.getFullYear() 
    + " " + date.getHours() 
    + ":" + date.getMinutes() 
    + ":" + date.getSeconds();
}

console.log(test.chain)
console.log("=====================================================================================================================================")

console.log(test.addBlock(
    new Block(1, getDate(), {
      sender: "test1",
      recipient: "test2",
      quantity: 1
       
    })
  ))

  console.log(test.addBlock(
    new Block(2, getDate()), { //16.11.2021 16:45:34
      sender: "test2",
      recipient: "test1",
      quantity: 10
    })
  )


console.log("=====================================================================================================================================")
console.log(JSON.stringify(test, null, 4));
// console.log(test)
//

