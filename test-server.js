const Client = require('node-rest-client').Client;
var client = new Client();
var args1 = {
    data: { body: "hello1" },
    headers: { "Content-Type": "application/json" }
};

var args2 = {
    data: { body: "hello2" },
    headers: { "Content-Type": "application/json" }
};
 
client.post("http://localhost:8000/block", args1, function (data, response) {
    // parsed response body as js object
    console.log(data);
    
});

client.post("http://localhost:8000/block", args2, function (data, response) {
    // parsed response body as js object
    console.log(data);
    
});