const Blockchain = require('./simpleChain.js')
const Block = require('./Block.js')
const chainDB = './chaindata';
var blockchain = new Blockchain(chainDB);
blockchain.initdb().then(
function(){
blockchain.getBlockHeight().then(function(value){console.log(`Block Height: ${value}`)});
blockchain.getBlock(0).then(function(value){console.log('genesis:');console.log(value);});

}
)
