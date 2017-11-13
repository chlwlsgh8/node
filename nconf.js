
var nconf = require('nconf');
nconf.env();

console.log('환경',nconf.get('OS'));
