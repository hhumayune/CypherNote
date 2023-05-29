const http = require('http');
const crypto = require('crypto');
const opn = require('opn');
const fs = require('fs');
const path = require('path');

const algorithm = 'aes-256-cbc';
const initVector = crypto.randomBytes(16);
const Securitykey = crypto.randomBytes(32);

const notes = [];

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/notes' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { note, key } = data;
        const encryptedNote = encrypt(note, Securitykey, initVector);
        const encryptedKey = encrypt(key, Securitykey, initVector);
        // Store the encrypted note and key on the server
        notes.push({ note, encryptedNote, key, encryptedKey });
        console.log('Note saved:', note);
        res.statusCode = 201;
        res.end();
      } catch (error) {
        res.statusCode = 400;
        res.end('Invalid request');
      }
    });
  } else if (req.url === '/notes' && req.method === 'GET') {
    // Retrieve the decrypted notes from the server
    const decryptedNotes = notes.map((note) => ({
      note: decrypt(note.encryptedNote, Securitykey, initVector),
      key: decrypt(note.encryptedKey, Securitykey, initVector),
      encryptedNote: note.encryptedNote,
    }));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(decryptedNotes));
  } else if (req.url === '/') {
    // Serve the index.html file
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
      }
    });
  } else if (req.url === '/style.css') {
    // Serve the style.css file
    fs.readFile(path.join(__dirname, 'style.css'), (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(data);
      }
    });
  } else if (req.url === '/decrypt' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { encryptedNote, encryptedKey, key } = data;
        const decryptedNote = decrypt(encryptedNote, decrypt(encryptedKey, Securitykey, initVector), key);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(decryptedNote);
      } catch (error) {
        res.statusCode = 400;
        res.end('Invalid request');
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  opn(`http://${hostname}:${port}`);
});

function encrypt(data, key, iv) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(data, 'utf-8', 'hex');
  encryptedData += cipher.final('hex');
  return encryptedData;
}

function decrypt(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf-8');
  decryptedData += decipher.final('utf-8');
  return decryptedData;
}
