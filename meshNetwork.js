const SHA256 = require("crypto-js/sha256");

class Wallet{
    constructor(miner){
        this.walletAddress = this.generateAddress(miner);
        this.balance = 50;
    }
    createWallet(){
        return new Wallet();
    }
    addToWallet(amount){
        this.balance += amount;
    }
    removeFromWallet(amount){
        this.balance -= amount;
    }
    generateAddress(miner){
        let stringAddress = miner.power + miner.address;
        let hash = SHA256(stringAddress).toString().substring(0,17);
        return "1x0"+hash;
    }
}

class Mesh{

    constructor(id){
        this.id = id;
        this.peerList = []; 
        // this.wallet = [];
    }
    
    addToMesh(miner){
        if(miner.peer != null){
            if(this.checkIfPeerExists(miner)){
                this.peerList.push(miner)
                //give the miner a wallet
                // new Wallet(miner.address); 


                // this.wallet.push({
                //     id: miner.id,
                //     balance: 0
                // });
            }
        }else{
            this.peerList.push(miner)
            // new Wallet(miner.address);
            // this.wallet.push({
            //     id: miner.id,
            //     balance: 0
            // });
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
    constructor(id, name, power, peer, address, wallet){
        this.id = id;
        this.name = name;
        this.power = power;
        this.peer = peer;
        this.peerChildren = [];
        this.currHeader = null;
        this.address = this.generateAddress(this);
        this.wallet = new Wallet(this);
    }
    
    generateAddress(miner){
        let stringAddress = miner.id + miner.name + miner.power + miner.peer;
        let hash = SHA256(stringAddress).toString().substring(0,20);
        return "0x"+hash;
    }
}

class Block{ // contains current block and previous block
    constructor(minerAddress,timestamp, transactions, previousHash = '') {
        this.minerAddress = minerAddress;
        this.timestamp = timestamp; // time of creation of the block in unix seconds
        this.previousHash = previousHash; // index of the previous block
        this.nonce = 0; 
        this.hash = this.calculateHash(); // sha256 hash of the block
        this.transactions = []; //keeps track of balances for each miner
        
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp
             + JSON.stringify(this.data) + this.nonce).toString(); 
    }

    //guess a single nonce, hash it then check if its a block, if its not then increment the nonce, return 
    proofOfWork(difficulty){
        
        

    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
        this.nonce++;
        this.hash = this.calculateHash();

    }

}

}

class Blockchain {

constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; 
        this.miningReward = 25;
        this.pendingTransactions = [];
    }

    createGenesisBlock(){
        return new Block("SYSTEM",Date().toString,{
            0x0:0
        },"Genesis Block", "0");
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
        if(this.pendingTransactions.length > 0){
            this.pendingTransactions.forEach(transaction => {
                newBlock.transactions.push(transaction);
            });
            // newBlock.balances.push(this.pendingTransactions);
            this.pendingTransactions = [];
        }
        for(let i = 0; i < meshNetwork.peerList.length; i++){
            if(meshNetwork.peerList[i].id == miner.id){
                //add to pending transactions then return this list
                miner.wallet.addToWallet(this.miningReward);

                this.pendingTransactions.push({
                    from: "SYSTEM",
                    to: miner.address,
                    amount: this.miningReward
                });

                // newBlock.balances[miner.wallet.walletAddress] = miner.wallet.balance;
            }else{


                // newBlock.balances[meshNetwork.peerList[i].wallet.walletAddress] = meshNetwork.peerList[i].wallet.balance
            }
            // if(meshNetwork.wallet[i].id == miner.id){
            //     meshNetwork.wallet[i].balance += this.miningReward;
            //     newBlock.balances[miner.id] = meshNetwork.wallet[i].balance;
            // }else{
            //     meshNetwork.wallet[i].balance -= (meshNetwork.peerList[i].power/this.miningReward)*0.1;
            //     newBlock.balances[meshNetwork.wallet[i].id] = meshNetwork.wallet[i].balance;
            // }
        }

        }

    addBlock(newBlock, miner, meshNetwork){
        newBlock.previousHash = this.getLastBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        newBlock.proofOfWork(this.difficulty); //TODO: include the reward in the calculation
        this.rewardMiner(miner,meshNetwork,newBlock);
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
//transaction:
//from public address to private address 
//public address: 0x0
//private address: 0x00


meshNetwork = new Mesh("meshNetwork");
// change difficulty of blockchain according to miner power 
let minerList = [];
// create a miner and add it to the mesh network

//constructor(id, name, power, peer)
minerList.push(
    new Miner(1, "Adam", 100),
    new Miner(2, "Norman", 150,1),
    new Miner(3, "Jack", 200,1),
    new Miner(4, "Lewis", 300,2),
    new Miner(5, "Adrian", 450,2),
    );

minerList.forEach(miner=>{
    meshNetwork.addToMesh(miner);
})


testBlockchain = new Blockchain();

function printValues(obj) {
    for (var key in obj) {
        if (typeof obj[key] === "object") {
            printValues(obj[key]);   
        } else {
            console.log(obj[key]);    
        }
    }
}


function mineBlock(miner){
    var date = new Date(Date.now());
    function getDate(){
        return date.getDate() 
        + "/" + date.getMonth()+1 
        + "/" + date.getFullYear() 
        + " " + date.getHours() 
        + ":" + date.getMinutes() 
        + ":" + date.getSeconds();
    }
    let newBlock = new Block(miner.id,getDate(), testBlockchain.getLastBlock().hash);

    if(miner.wallet.balance < 0){
        //TODO: remove miner from network
        console.log("Miners wallet is empty");
        return;
    }else{
        miner.wallet.removeFromWallet((miner.power/testBlockchain.miningReward)*0.1);
        testBlockchain.addBlock(newBlock, miner, meshNetwork);
        console.log("Block Mined: " + newBlock.hash + " by " + miner.id);
        testBlockchain.chain.map(
            block => {
                console.log(block);
            }
        )
        // var jsonString = JSON.stringify(testBlockchain.chain, null, '\t');
        // console.log(jsonString)
    }

}

// start mining 
for(var i = 0; i < minerList.length; i++){
    setInterval(mineBlock, (testBlockchain.difficulty/minerList[i].power)*100000, minerList[i]);
}