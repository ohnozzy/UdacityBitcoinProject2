# BlockChain Server

RESTful API for manipulating blockchain data. This is just a course project, please don't use in production. 

## Package Requirement

* nodejs 
* leveldb
* expressjs
* crypto-js

## Install Dependent Packages

* `npm install level`
* `npm install crypto-js`
* `npm install express`


## Running the Server

`node server.js`

The server listens on port 8000 by default.


## RESTful End Points

### Retrieve Block Data with Height

* Request

  GET http://localhost:8000/block/{BLOCK_HEIGHT}

* Response
```
  {"hash":"hash string",
   "height": height,
   "body":{
     "address": "Wallet Address",
     "star": {
      "ra": "Right Ascension",
      "dec": "Declination",
      "story": "story string in hex format",
      "storyDecoded": "story string"
     }
   },
   "time":"time string",
   "previousBlockHash":"previsou block hash string"}
```

### Retrieve Block Data with Hash

* Request

  GET http://localhost:8000/block/hash:{HASH}

* Response
```
  {"hash":"hash string",
   "height": height,
   "body":{
     "address": "Wallet Address",
     "star": {
      "ra": "Right Ascension",
      "dec": "Declination",
      "story": "story string in hex format",
      "storyDecoded": "story string"
     }
   },
   "time":"time string",
   "previousBlockHash":"previsou block hash string"}
```
### Retrieve Block Data with Wallet Address

* Request

  GET http://localhost:8000/block/address:{Address}

* Response 
```
  [{"hash":"hash string",
   "height": height,
   "body":{
     "address": "Wallet Address",
     "star": {
      "ra": "Right Ascension",
      "dec": "Declination",
      "story": "story string in hex format",
      "storyDecoded": "story string"
     }
   },
   "time":"time string",
   "previousBlockHash":"previsou block hash string"},
   {"hash":"hash string",
   "height": height,
   "body":{
     "address": "Wallet Address",
     "star": {
      "ra": "Right Ascension",
      "dec": "Declination",
      "story": "story string in hex format",
      "storyDecoded": "story string"
     }
   },
   "time":"time string",
   "previousBlockHash":"previsou block hash string"}
   ]
```
### Append Blockchain

* Request

  POST http://localhost:8000/block
  
  Content-Type: application/json
  
  Request body:
  ```
  {
  "address": "Wallet Address",
  "star": {
    "dec": "Right Ascension",
    "ra": "Declination",
    "story": "story string"
  }
  ```

* reponse

```
  {"hash":"hash string",
   "height": height,
   "body":{
     "address": "Wallet Address",
     "star": {
      "ra": "Right Ascension",
      "dec": "Declination",
      "story": "story string in hex format",
      "storyDecoded": "story string"
     }
   },
   "time":"time string",
   "previousBlockHash":"previsou block hash string"}
```

### Validate Wallet Address

* Request

  POST http://localhost:8000/requestValidation
  
  Content-Type: application/json
  
  Request body:
  ```
  {
  "address": "Wallet Address",
  }
  ```

* reponse

```
  {
  "address": "Wallet Address",
  "requestTimeStamp": "current time in seconds since epoch",
  "message": "challenge message",
  "validationWindow": time window in seconds
 } 

```

### Validate Message Signature

* Request

  POST http://localhost:8000/message-signature/validate
  
  Content-Type: application/json
  
  Request body:
  ```
  {
  "address": "Wallet Address",
  "signature": "signature of the message returned from '/requestValidation'"
  }
  ```

* reponse

```
{
  "registerStar": true,
  "status": 
  {
  "address": "Wallet Address",
  "requestTimeStamp": "current time in seconds since epoch",
  "message": "challenge message",
  "validationWindow": time window in seconds
  "messageSignature": "valid/invalid"
  }
}

```
