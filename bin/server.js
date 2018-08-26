#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('server');
var http = require('http');
var fs = require('fs');
var path = require('path');

/**
 * Read server configuration data.
 */

var configFileName = 'config-server.json';
var configFileDir = path.join(__dirname, '../config');
var configFileFull;
var configData;

try {
  configFileFull = path.join(configFileDir, configFileName);
  configData = JSON.parse(fs.readFileSync(configFileFull))
}
catch (exception) {
  console.log('Error reading configuration file ' + configFileFull + ':\n' + exception);
  process.exit(1);
}

app.set('port', configData.server.port.value);

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || app.get('port'));

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

console.log(configData.server.desc.value + ' started listening on port ' + port);
console.log('Listening on ' + 'bind');
console.log('date          = ' + new Date());
console.log('description   = ' + configData.server.desc.value);
console.log('server type   = ' + configData.server.env.value);
console.log('environment   = ' + app.get('env'));
console.log('version       = ' + process.version);
console.log('language      = ' + app.get('currentLang'));
console.log('directory     = ' + __dirname);
console.log('file          = ' + __filename);
console.log('configuration = ' + configFileFull);
console.log('process       = ' + process.argv);
console.log('mongoDBURL    = ' + process.env.DB_URL);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
