const net = require('net');
const port = process.env.PORT ? process.env.PORT - 100 : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const client = new net.Socket();

// this code does the fast refresh of React together with Electron.
let startedElectron = false;
const tryConnection = () => {
  client.connect({ port: port }, () => {
    client.end();
    if (!startedElectron) {
      console.log('starting electron');
      startedElectron = true;
      const { exec } = require('child_process');
      const electron = exec('yarn electron');
      electron.stdout.on('data', data => {
        console.log('stdout: ' + data.toString());
      });
    }
  });
}

tryConnection();

client.on('error', error => {
  setTimeout(tryConnection, 1000);
});