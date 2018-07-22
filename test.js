const simpleChain = require('./simpleChain.js');
const chainDB = './chaindata';
var blockchain = new simpleChain.Blockchain(chainDB);
blockchain.initdb()
.then(function(){return blockchain.getBlockHeight()})
.then(function(height){return blockchain.validateBlock(height-1)})
.then(function(value){console.log(value)})
.then(function(){return blockchain.addBlock(new simpleChain.Block('1st'))})
.then(function(value){console.log(value)})
.then(function(){return blockchain.getBlock(1)})
.then(function(value){console.log(value)})
.then(function(){return blockchain.addBlock(new simpleChain.Block('2nd'))})
.then(function(){return blockchain.validateChain()})
.then(function(value){console.log(value)})
.then(function(){return blockchain.getBlockHeight()})
.then(function(height){return blockchain.getBlock(height-1)})
.then(function(value){console.log(value)})
.then(function(){return blockchain.modifyBlockData(2, 'tamper');})
.then(function(){return blockchain.validateChain()})
.then(function(value){console.log(value)})
;
