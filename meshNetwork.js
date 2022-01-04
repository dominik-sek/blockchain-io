const SHA256 = require("crypto-js/sha256");

class Mesh{

    constructor(id){
        this.id = id;
        this.peerList = []; 
        this.wallet = [];
    }
    
    addToMesh(miner){
        if(miner.peer != null){
            if(this.checkIfPeerExists(miner)){
                this.peerList.push(miner)
                //give the miner a wallet
                this.wallet.push({
                    id: miner.id,
                    balance: 0
                });
            }
        }else{
            this.peerList.push(miner)
            this.wallet.push({
                id: miner.id,
                balance: 0
            });
            
        }
    }

    checkIfPeerExists(miner){
        for(var i = 0; i < this.peerList.length+1; i++){
            if(this.peerList[i].id == miner.peer){
                this.peerList[i].peerChildren.push(miner);
                return true;
            }
        }
        return false;
    }

    showMesh(){
        console.log("Peer List: ");
        for(var i = 0; i < this.peerList.length; i++){
            console.log(this.peerList[i].id);
        }
    }

    showPeersForMiner(miner){
        console.log("Peers for Miner " + miner.id + ": ");
        for(var i = 0; i < this.peerList.length; i++){
            if(this.peerList[i].id == miner.id){
                console.log(this.peerList[i].peerChildren);
            }
        }
    }
    removePeer(miner){
        //remove miner from peer list
        for(var i = 0; i < this.peerList.length; i++){
            if(this.peerList[i].id == miner.id){
                this.peerList.splice(i, 1);
            }
        }
    }
    //TODO
    //add a transaction to the blockchain
    // addTransaction(transaction){
    //     this.currHeader.transactions.push(transaction);
    // }

    printPeerList(){
        console.log("Peer List: ");
        for(var i = 0; i < this.peerList.length; i++){
            console.log(this.peerList[i].id);
        }
    }


    printPeerListWithChildren(){
        console.log("Peer List: ");
        for(var i = 0; i < this.peerList.length; i++){
            console.log("\n"+this.peerList[i].id + " has children: ");
            console.log(this.peerList[i].peerChildren);
        }
    }

}

class Miner{
    constructor(id, name, power, peer){
        this.id = id;
        this.name = name;
        this.power = power;
        this.peer = peer;
        this.peerChildren = [];
        this.currHeader = null;
    }
    
}

class Block{ // contains current block and previous block
    constructor(miner,timestamp, balances, previousHash = '') {
        this.miner = miner;
        this.timestamp = timestamp; // time of creation of the block in unix seconds
        this.previousHash = previousHash; // index of the previous block
        this.nonce = 0; 
        this.hash = this.calculateHash(); // sha256 hash of the block
        this.balances = {}; //keeps track of balances for each miner
        
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp
             + JSON.stringify(this.data) + this.nonce).toString(); 
    }

    //guess a single nonce, hash it then check if its a block, if its not then increment the nonce, return 
    proofOfWork(difficulty){
        
    if(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
        this.nonce++;
        this.hash = this.calculateHash();
        return
    }
    // while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
         
    //     this.nonce++;
    //     this.hash = this.calculateHash();
    //    // console.log(`trying: ${this.hash} `);

    // }
//broadcast to all peers
}

}

class Blockchain{

constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; 
        this.miningReward = 40;
    }
   
    //constructor(miner,timestamp, balances, previousHash = '') {

    createGenesisBlock(){
        return new Block("SYSTEM",Date().toString,{},"Genesis Block", "0");
    }
    getLastBlock(){
        return this.chain[this.chain.length - 1];
    }
    broadcastBlock(broadcaster, block, meshNetwork){
        for(var i = 0; i < meshNetwork.peerList.length; i++){
            meshNetwork.peerList[i].currHeader = block.hash;
    }
}
    rewardMiner(miner,meshNetwork, newBlock){
        for(var i = 0; i < meshNetwork.wallet.length; i++){
            if(meshNetwork.wallet[i].id == miner.id){
                meshNetwork.wallet[i].balance += this.miningReward;
                newBlock.balances[miner.id] = meshNetwork.wallet[i].balance;
            }else{
                meshNetwork.wallet[i].balance -= (meshNetwork.peerList[i].power/this.miningReward)*0.1;
                newBlock.balances[meshNetwork.wallet[i].id] = meshNetwork.wallet[i].balance;
            
            }
        }
    
}

    addBlock(newBlock, miner, meshNetwork){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.proofOfWork(this.difficulty); //TODO: include the reward in the calculation
        //possiblh changing the reward 
        //reward the miner for mining the block
        this.rewardMiner(miner, meshNetwork,newBlock);
        this.chain.push(newBlock);
        this.broadcastBlock(miner,newBlock,meshNetwork); //broadcast to all peers
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

    
// mine the block asynchronously 


meshNetwork = new Mesh("meshNetwork");
// change difficulty of blockchain according to miner power 
let minerList = [];
// create a miner and add it to the mesh network


minerList.push(
    new Miner(1, "1", 100),
    new Miner(2, "2", 200,1),
    new Miner(3, "3", 300,1),
    new Miner(4, "4", 400,2),
    );

minerList.forEach(miner=>{
    meshNetwork.addToMesh(miner)
})

testBlockchain = new Blockchain();




//constructor(miner,timestamp, balances, previousHash = '') {


 async function mineBlock(miner){
    var date = new Date(Date.now());
    function getDate(){
        return date.getDate() 
        + "/" + date.getMonth() 
        + "/" + date.getFullYear() 
        + " " + date.getHours() 
        + ":" + date.getMinutes() 
        + ":" + date.getSeconds();
    }

    let newBlock = new Block(miner.id,getDate(), testBlockchain.getLastBlock().hash);
    testBlockchain.addBlock(newBlock, miner, meshNetwork);
    console.log("Block Mined: " + newBlock.hash + " by " + miner.id);
    // //log all balances
    // console.log("Balances: ");
    // for(var i = 0; i < minerList.length; i++){
    //     console.log(minerList[i].name + ": " + meshNetwork.wallet[i].balance);
    // }
    console.log(testBlockchain.chain);
}


for(var i = 0; i < minerList.length; i++){
    setInterval(mineBlock, (testBlockchain.difficulty/minerList[i].power)*100000, minerList[i]);
}


