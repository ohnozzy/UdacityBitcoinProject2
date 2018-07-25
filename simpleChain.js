/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/
"use strict";
const SHA256 = require('crypto-js/sha256');
const level = require('level');
const Block = require('./Block');





/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(path){
    this.db = level(path);
    
    
  }
  //initialize leveldb. 
  async initdb(){
    try {
       var height = await this.getBlockHeight();
       return height;
    } catch(e) {
        var block = new Block("First block in the chain - Genesis block");
        block.height = 0;
        block.time = new Date().getTime().toString().slice(0,-3);
        block.hash = SHA256(JSON.stringify(block)).toString();    
        return this.db.batch().put('height',1).put(0, JSON.stringify(block)).write().then(function(){return 1;});
    }
    
  }

  // Add new block
  async addBlock(newBlock){
    
    var chain = this;
    var height = await this.getBlockHeight();
    var block = await this.getBlock(height -1);
    newBlock.height = height;
    newBlock.previousBlockHash = block.hash;
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    return this.db.batch().put('height', +newBlock.height+1).put(newBlock.height, JSON.stringify(newBlock)).write().then(function(){return true;}, function(err){return false});
    
  }

  // Get block height
    getBlockHeight(){
      return this.db.get('height');
    }

    // get block
    getBlock(blockHeight){
      // return object as a single string
      return this.db.get(blockHeight).then(function(blockstr){return JSON.parse(blockstr)}, function(err){console.log(err)});
     
    }


    async modifyBlockData(blockHeight, data){
      
      var block = await this.getBlock(blockHeight);
      block.body=data
      return await this.db.put(blockHeight, JSON.stringify(block));
    }
    // validate block
    async validateBlock(blockHeight){
      // get block object
      var block = await this.getBlock(blockHeight);  
      
       var blockHash = block.hash;
         block.hash = '';
         var validBlockHash = SHA256(JSON.stringify(block)).toString();
         if (blockHash===validBlockHash) {          
          return true
        } else {
          return false;
        }
      
    }

    
   // Validate blockchain
    async validateChain(){
      var errorLog = [];
      var chain = this;
      var height = await this.getBlockHeight();
       
      for (var i=0; i < height; ++i){
         var block = await this.getBlock(i);
         var blockHash = block.hash;
         block.hash = '';
         var validBlockHash = SHA256(JSON.stringify(block)).toString();
         if (blockHash!==validBlockHash) {          
               errorLog.push(i);
               continue;
         }
         if(i>0){
           var preblock = await this.getBlock(i-1);
           if(preblock.hash!==block.previousBlockHash){
                errorLog.push(i)
           }
         }
         
      }
      
      return errorLog; 
      
    }
}


module.exports=exports=Blockchain;





