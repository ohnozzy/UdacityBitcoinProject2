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
       this.height = height;
       
    } catch(e) {
        var block = new Block("First block in the chain - Genesis block");
        block.height = 0;
        block.time = new Date().getTime().toString().slice(0,-3);
        block.hash = SHA256(JSON.stringify(block)).toString();    
        await this.db.batch().put('height',0).put(0, JSON.stringify(block)).write();
        this.height =0 ;
    }
    return this.height;
    
  }

  // Add new block height -1 indicate failure.
  async addBlock(newBlock){
    let preblocknumber = this.height; 
    this.height++;
    newBlock.height = this.height;
    while(true){
    try{
    let block = await this.getBlock(preblocknumber);
    newBlock.previousBlockHash = block.hash;
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    break;
    }catch(e){
      continue;
    }
    }
    
    try{
    await this.db.batch().put('height', newBlock.height).put(newBlock.height, JSON.stringify(newBlock)).write();
    }catch(e){
      throw 1;
    }
    return newBlock;
  }

  // Get block height
    async getBlockHeight(){
      var height = await this.db.get('height');
      return height;
    }

    // get block
    async getBlock(blockHeight){
      // return object as a single string

      var blockstr = await this.db.get(blockHeight);
      return JSON.parse(blockstr);
     
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





