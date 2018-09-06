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
const wordLimit = 250;
function postProcessBlock(block){
  block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString('utf8');
  return block;
}
function checkTimeout(session){
  return session.requestTimeStamp + validWindows > Math.round(new Date().getTime() / 1000)
}
app.get('/block/:height(\\d+)', function (req, res) {
    blockchain.getBlock(req.params.height).then((block)=>res.json(postProcessBlock(block)), (err)=>res.status(404).end());
    
  });
app.get('/stars/hash::hash', function (req, res) {
    console.log(req.params);
    blockchain.getBlockHash(req.params.hash).then((block)=>res.json(postProcessBlock(block)), (err)=>res.status(404).end());
    
  });
app.get('/stars/address::address', async function (req, res) {
    console.log(req.params);
    blockchain.getBlockByAddress(req.params.address, function(result){
      for (let data of result){
         postProcessBlock(data)
      }
      res.json(result);
    })
    
  });

app.post('/block', function (req, res) {
    
    var message = req.body
    console.log(message);
    if(reqisterUsers[message.address]){
     let userinfo = reqisterUsers[message.address];
     if(userinfo.validate == 'valid' && checkTimeout(userinfo) && message.star.story.length<wordLimit){
      message.star.story = Buffer.from(message.star.story, 'utf8').toString('hex'); 
      blockchain.addBlock(new Block(message)).then((block)=>res.json(block), (err)=>{if(err===1){res.status(500).end()}else{res.status(409).end()}});
      delete reqisterUsers[message.address];
     }else{
      res.json('Your wallet address is not verified or has been timeout.')
     }
    }else{
     res.json('Your wallet address is not registered')
    }
});
app.post('/message-signature/validate', function(req, res){
    let result = {};
    result.registerStar = false;
    console.log(req.body);
    regiterInfo = reqisterUsers[req.body.address];  
    if(regiterInfo){
      result.status = regiterInfo;
      if (checkTimeout(regiterInfo)){
         if(bitcoinMessage.verify(regiterInfo.message, req.body.address, req.body.signature)){
           result.registerStar = true;
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
     let expiredtime = userRegistry.requestTimeStamp + validWindows
     if(expiredtime > d){
       userRegistry.validationWindow = expiredtime - d;
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
