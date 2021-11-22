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
        //TODO
        for(var i = 0; i < this.peerList.length; i++){
            if(this.peerList[i].id == miner.id){
                
            }
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
    constructor(timestamp, balances, previousHash = '') {
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

    proofOfWork(difficulty){

    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){ // 
        this.nonce++;
        this.hash = this.calculateHash();
       // console.log(`trying: ${this.hash} `);

    }
//broadcast to all peers
    
    
    
}

}

class Blockchain{

constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 200; 
        this.miningReward = 10;
    }
   
    createGenesisBlock(){
        return new Block(Date().toString, "Genesis Block", "0");
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
                //give the miners that didnt mine the block a penalty
                meshNetwork.wallet[i].balance -= this.miningReward;
                newBlock.balances[meshNetwork.wallet[i].id] = meshNetwork.wallet[i].balance;

            }
        }
    
}

    addBlock(newBlock, miner, meshNetwork){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.proofOfWork(Math.floor(this.difficulty / miner.power));
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
minerList.push(new Miner(1, "Miner1", 50, null));
minerList.push(new Miner(2, "Miner2", 50, 1));
minerList.push(new Miner(3, "Miner3", 50, 2));
// minerList.push(new Miner(4, "Miner4", 80, 2));
// minerList.push(new Miner(5, "Miner5", 85, 1));
// minerList.push(new Miner(6, "Miner6", 90, 3));
minerList.forEach(miner => {
    meshNetwork.addToMesh(miner);
});
console.log(meshNetwork.wallet)

testBlockchain = new Blockchain();
var date = new Date(Date.now());
function getDate(){
    return date.getDate() 
    + "/" + date.getMonth() 
    + "/" + date.getFullYear() 
    + " " + date.getHours() 
    + ":" + date.getMinutes() 
    + ":" + date.getSeconds();
}



async function mineBlock(miner){
    let newBlock = new Block(getDate(), testBlockchain.getLastBlock().hash);
    await testBlockchain.addBlock(newBlock, miner, meshNetwork);
    console.log("Block Mined: " + newBlock.hash + " by " + miner.id);
    //log all balances
    console.log("Balances: ");
    for(var i = 0; i < minerList.length; i++){
        console.log(minerList[i].name + ": " + meshNetwork.wallet[i].balance);
    }
}

// }

// mine the block asynchronously, if the block is mined, proceed to the next block
minerList.forEach(miner => {
    setInterval(async () => {
        await mineBlock(miner);
    }, miner.power );
});




console.log(testBlockchain.chain)
// console.log(meshNetwork.transactionPool)

// testBlockchain.addBlock(

//     new Block(
//         getDate(),
//         meshNetwork.transactionPool),
        
//         minerList[0],meshNetwork);

// console.log(meshNetwork.peerList);
// meshNetwork.assignMinersToBlock
// meshNetwork.showMesh();
// meshNetwork.showPeersForMiner(minerList[0]);

// add the miner id to the block