# BlockChain Server

RESTful API for manipulating blockchain data. This is just a course project, please don't use in production. 

## Package Requirement

* nodejs 
* leveldb
* expressjs
* crypto-js

## Install Dependent Packages

`npm install level`
`npm install crypto-js`
`npm install express`


## Running the Server

`node server.js`

The server listens on port 8000 by default.


## RESTful End Points

### Retrieve Block Data

* Request

  GET http://localhost:8000/block/{BLOCK_HEIGHT}

* Response

  {"hash":"hash string","height": height,"body":"data string","time":"time string","previousBlockHash":"previsou block hash string"}

### Append Blockchain

* Request

  POST http://localhost:8000/block
  Content-Type: application/json
  Request body: {"body":"data"}

* reponse

  {"hash":"hash string","height": height,"body":"data string","time":"time string","previousBlockHash":"previsou block hash string"}