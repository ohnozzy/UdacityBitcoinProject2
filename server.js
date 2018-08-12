const Blockchain = require('./simpleChain.js')
const Block = require('./Block.js')
const chainDB = './chaindata';
const express = require('express')
var bodyParser = require('body-parser');
var app = express()
var blockchain = new Blockchain(chainDB);
app.use(bodyParser.json());
app.get('/block/:height(\\d+)', function (req, res) {
    blockchain.getBlock(req.params.height).then((block)=>res.json(block), (err)=>res.status(404).end());
    
  });
app.post('/block', function (req, res) {
    
    blockchain.addBlock(new Block(req.body.body)).then((block)=>res.json(block), (err)=>{if(err===1){res.status(500).end()}else{res.status(409).end()}});
});
app.listen(8000, () => blockchain.initdb());