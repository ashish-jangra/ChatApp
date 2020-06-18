const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 512});
console.log(key.getMaxMessageSize())
console.log(key.generateKeyPair())