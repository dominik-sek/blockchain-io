class Mesh{

    constructor(id){
        this.id = id;
        this.peerList = []; 
    }
    
    addToMesh(miner){
        if(miner.peer != null){
            this.checkIfPeerExists(miner) ? this.peerList.push(miner) : console.log("invalid peer");
        }else{
            this.peerList.push(miner)
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

    //[miner1, miner2 ...]
    
}

class Miner{
    constructor(id, name, power, peer){
        this.id = id;
        this.name = name;
        this.power = power;
        this.peer = peer;
        this.peerChildren = [];
    }
    
}
let meshNetwork = new Mesh("meshNetwork");

let minerList = [];
minerList.push(new Miner(1, "Miner1", 100, null));
minerList.push(new Miner(2, "Miner2", 100, 1));
minerList.push(new Miner(3, "Miner3", 100, 2));
minerList.push(new Miner(4, "Miner4", 100, 2));
minerList.push(new Miner(5, "Miner5", 100, 1));
minerList.push(new Miner(6, "Miner6", 100, 3));
minerList.forEach(miner => {
    meshNetwork.addToMesh(miner);
});
meshNetwork.showMesh();
meshNetwork.showPeersForMiner(minerList[0]);
