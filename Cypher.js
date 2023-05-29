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
    // Retrieve the encrypted notes from the server
    const encryptedNotes = notes.map(note => ({
      encryptedNote: note.encryptedNote,
      encryptedKey: note.encryptedKey
    }));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(encryptedNotes));
  } else if (req.url === '/decrypt' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { encryptedNote, encryptedKey, key } = data;
        const decryptedNote = decrypt(encryptedNote, encryptedKey, key);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(decryptedNote);
      } catch (error) {
        res.statusCode = 400;
        res.end('Invalid request');
      }
    });
  } else if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(content);
      }
    });
  } else if (req.url === '/style.css') {
    fs.readFile(path.join(__dirname, 'style.css'), (err, content) => {
      if (err) {
        res.statusCode = 500;
        res.end('Internal Server Error');
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/css');
        res.end(content);
      }
    });
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  opn(`http://${hostname}:${port}/`);
});

function encrypt(text, key, iv) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText, encryptedKey, iv) {
  const decipher = crypto.createDecipheriv(algorithm, encryptedKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
