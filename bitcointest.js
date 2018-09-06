const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');
const Client = require('node-rest-client').Client;
const keyPair = bitcoin.ECPair.makeRandom()
const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey })
console.log(address)
var client = new Client();
var address_msg = {
    data: { address: address },
    headers: { "Content-Type": "application/json" }
};
var data_msg = {
                data: {address: address,
                       star: {
                       dec: "-26° 29' 24.9",
                       ra: "16h 29m 1.0s",
                       story: "Found star using https://www.google.com/sky/"
                       }
                      },
                headers: { "Content-Type": "application/json" }
                };
 
client.post("http://localhost:8000/requestValidation", address_msg, function (data, response) {
    // parsed response body as js object
    console.log(data);
    console.log(data.message);
    var signature = bitcoinMessage.sign(data.message, keyPair.privateKey, keyPair.compressed);
    var arg2 =  {
                data: {address: address,
                       signature: signature.toString('base64')
                      },
                headers: { "Content-Type": "application/json" }
                };
    client.post("http://localhost:8000/message-signature/validate", arg2, function(data, response){
       console.log(data)

       client.post("http://localhost:8000/block", data_msg, function(data, response){
           console.log(data);
           data_msg.data.star.story = 'hello'
client.post("http://localhost:8000/requestValidation", address_msg, function (data, response) {
    // parsed response body as js object
    console.log(data);
    var signature = bitcoinMessage.sign(data.message, keyPair.privateKey, keyPair.compressed);
    var arg2 =  {
                data: {address: address,
                       signature: signature.toString('base64')
                      },
                headers: { "Content-Type": "application/json" }
                };
    client.post("http://localhost:8000/message-signature/validate", arg2, function(data, response){
       console.log(data) 

       client.post("http://localhost:8000/block", data_msg, function(data, response){
           console.log(data);
       })
    })
    
});

       })
    })
    
});


