var fs = require('fs');
var path = require('path');
const readFile = fileName => {
    try {
      return fs.readFileSync(path.resolve(fileName));
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
  /*
    Please check the proton documentation on how to create the SSL Files needed below.
  */
  const rootCertificate = readFile('./certificates/ca_hl.crt');
  const clientCertificate = readFile('./certificates/app1_hl.crt');
  const clientKey = readFile('./certificates/app1_hl.key');
  
  
  
  const { useServer } = require('@domino/domino-db');
  const serverConfig = {
      hostName: 'your-dns-hostname to proton server', // DNS (!) Host name of your server
      // See scripts to create kyr-file and ca for adoption !
      connection: {
          port: 'your-proton-port', // Proton port on your server
          secure: true,
      },
      credentials: {
        rootCertificate,
        clientCertificate,
        clientKey
      }
  };

  module.exports = serverConfig;