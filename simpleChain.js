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
       
       this.lastblock = await this.getBlock(height);
       
       
    } catch(e) {
        this.lastblock = new Block("First block in the chain - Genesis block");
        this.lastblock.height = 0;
        this.lastblock.time = new Date().getTime().toString().slice(0,-3);
        this.lastblock.hash = SHA256(JSON.stringify(this.lastblock)).toString();    
        await this.db.batch().put('height',0).put(0, JSON.stringify(this.lastblock)).write();
        
    }
    return this.lastblock;
    
  }

  // Add new block height -1 indicate failure.
  async addBlock(newBlock){
    if(this.lastblock){
    newBlock.height = this.lastblock.height+1;
    newBlock.previousBlockHash = this.lastblock.hash;
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    this.lastblock = newBlock;
    
    try{
    await this.db.batch().put('height', newBlock.height)
          .put('height.'+newBlock.height, JSON.stringify(newBlock))
          .put('hash.'+newBlock.hash,JSON.stringify(newBlock))
          .put('address.'+newBlock.body.address+'.'+newBlock.hash, newBlock.hash) 
          .write();
    }catch(e){
      throw 1;
    }
    return newBlock;
    }else{
      console.log('Not initiated');
      throw 2
    }
  }

  // Get block height
    async getBlockHeight(){
      var height = await this.db.get('height');
      return height;
    }

    // get block
    async getBlock(blockHeight){
      // return object as a single string

      var blockstr = await this.db.get('height.'+blockHeight);
      return JSON.parse(blockstr);
     
    }
    async getBlockHash(hash){
      var blockstr = await this.db.get('hash.'+hash);
      return JSON.parse(blockstr);
    }
    async getBlockByAddress(address, cb){
          var hasharray=[];
          var chain = this;
          this.db.createValueStream({gt: 'address.'+address+'.',lt: 'address.'+address+'0'})
          .on('data', function (data) {
              console.log(data)
              hasharray.push(data)
          })
          .on('end', async function(){
              var result=[];
              console.log(hasharray)
              for (const hash of hasharray){
                  var blockdata = await chain.getBlockHash(hash);
                  result.push(blockdata);
              }
              cb(result);
             }
          )
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





