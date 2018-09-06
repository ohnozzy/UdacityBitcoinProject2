const Blockchain = require('./simpleChain.js')
const Block = require('./Block.js')
const chainDB = './chaindata';
const express = require('express')
var bodyParser = require('body-parser');
var bitcoin = require('bitcoinjs-lib'); // v3.x.x
var bitcoinMessage = require('bitcoinjs-message');
var app = express();
var blockchain = new Blockchain(chainDB);
var reqisterUsers={};
app.use(bodyParser.json());
const validWindows = 300;
function postProcessBlock(block){
  block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('utf8');
  return block;
}
function checkTimeout(session){
  return session.requestTimeStamp+session.validationWindow > Math.round(new Date().getTime() / 1000)
}
app.get('/block/:height(\\d+)', function (req, res) {
    blockchain.getBlock(req.params.height).then((block)=>res.json(postProcessBlock(block)), (err)=>res.status(404).end());
    
  });
app.get('/block/hash::hash', function (req, res) {
    console.log(req.params);
    blockchain.getBlockHash(req.params.hash).then((block)=>res.json(postProcessBlock(block)), (err)=>res.status(404).end());
    
  });
app.get('/block/address::address', async function (req, res) {
    console.log(req.params);
    blockchain.getBlockByAddress(req.params.address, function(result){
      for (let data of result){
         postProcessBlock(data)
      }
      res.json(result);
    })
    
  });

app.post('/block', function (req, res) {
    
    message = req.body
    console.log(message);
    if(reqisterUsers[message.address]){
     let userinfo = reqisterUsers[message.address];
     if(userinfo.validate == 'valid' && checkTimeout(userinfo)){
      message.star.story = Buffer.from(message.star.story, 'utf8').toString('hex');
      blockchain.addBlock(new Block(message)).then((block)=>res.json(block), (err)=>{if(err===1){res.status(500).end()}else{res.status(409).end()}});
     }else{
      res.json('Your wallet address is not verified or has been timeout.')
     }
    }else{
     res.json('Your wallet address is not registered')
    }
});
app.post('/message-signature/validate', function(req, res){
    let result = {};
    result.registerStar = true;
    console.log(req.body);
    regiterInfo = reqisterUsers[req.body.address];  
    if(regiterInfo){
      result.status = regiterInfo;
      if (checkTimeout(regiterInfo)){
         if(bitcoinMessage.verify(regiterInfo.message, req.body.address, req.body.signature)){
           result.status.validate = 'valid';
         }else{
           result.status.validate = 'invalid';
         }
      }else{
           result.status.validate = 'timeout';
      }
    }else{
    	result.status={address: req.body.address, requestTimeStamp: "", message: "", validationWindow: 0, messageSignature: ""};
    }
    res.json(result); 
});
app.post('/requestValidation', function(req, res){
  let d = Math.round(new Date().getTime() / 1000);
  if (reqisterUsers[req.body.address]){
     let userRegistry = reqisterUsers[req.body.address];
     let originalendtime = userRegistry.requestTimeStamp + userRegistry.validationWindow
     if(originalendtime > d){
       userRegistry.requestTimeStamp = d;
       userRegistry.message = req.body.address+":"+d+":starRegistry";
       userRegistry.validationWindow = originalendtime - d;
       res.json(userRegistry);
       return;
     }
  }
    let userRegistry = {address: req.body.address, 
                        requestTimeStamp: d, 
                        message: req.body.address+":"+d+":starRegistry",
                        validationWindow: validWindows};
    reqisterUsers[userRegistry.address] = userRegistry;
    res.json(userRegistry);
  
});

app.listen(8000, () => blockchain.initdb());
