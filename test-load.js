const simpleChain = require('./simpleChain.js')
const chainDB = './chaindata';
var blockchain = new simpleChain.Blockchain(chainDB);
blockchain.getBlockHeight().then(function(value){console.log(`Block Height: ${value}`)});
blockchain.getBlock(1).then(function(value){console.log('1st block:');console.log(value);});
blockchain.getBlock(2).then(function(value){console.log('2nd block:');console.log(value)});
