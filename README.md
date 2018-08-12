# BlockChain Server

RESTful API for manipulating blockchain data. This is just a course project, please don't use in production. 

## Package Requirement

* nodejs 
* leveldb
* expressjs

## RESTful End Points

### Retrieve Block Data
* request
  GET http://localhost:8000/block/{BLOCK_HEIGHT}
* response 
  {"hash":"hash string","height": height,"body":"data string","time":"time string","previousBlockHash":"previsou block hash string"}

### Append Blockchain
* request
  POST http://localhost:8000/block
  Content-Type: application/json
  Request body: {"body":"data"}
* reponse
  {"hash":"hash string","height": height,"body":"data string","time":"time string","previousBlockHash":"previsou block hash string"}