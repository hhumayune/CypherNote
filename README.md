# CypherNote

A web-based notes app developed in node.js that stores encrypted data on server but the key to decrypt it remains in the user's cookies or is entered when needed.  

This application allows users to save notes securely by encrypting them before storing them on the server. The code consists of a client-side HTML page and a server-side Node.js script. 
To run the provided application, you will need to have the following npm modules:

1. `http`: This module is a built-in module in Node.js, so there is no need to install it separately.

2. `crypto`: This module is also a built-in module in Node.js.

3. `opn`: This module is used to automatically open the application in a web browser. You can install it by running the following command:
  
  

4. `fs`: This module is a built-in module in Node.js, so no additional installation is required.

Once you have these modules installed, you can run the application by executing the server-side script using Node.js.

1. Server Setup:
   - The server is created using the Node.js `http` module and listens on `http://127.0.0.1:3000`.
   - The server also uses the `opn` module to automatically open the application in a web browser.

2. Client-side HTML:
   - The HTML page contains a form with input fields for entering a note and a key.
   - There are buttons for saving the note and viewing the decrypted notes.

3. Client-side JavaScript:
   - The JavaScript code runs in the browser and handles the user interactions.

4. Saving a Note:
   - When the user clicks the "Save Note" button, the `saveNote` function is called.
   - It retrieves the note and key values entered by the user.
   - If both the note and key are provided, the data is sent to the server via a POST request to '/notes'.
   - The note and key are encrypted using `AES-256-CBC` encryption with a randomly generated initialization vector and security key.
   - The encrypted note and key are then sent to the server for storage.
   - If the request is successful, the note and key input fields are cleared, and the `getNotes` function is called to retrieve the updated list of encrypted notes.

5. Retrieving Encrypted Notes:
   - The `getNotes` function sends a GET request to '/notes' to retrieve the encrypted notes stored on the server.
   - If the request is successful, the encrypted notes are received as a JSON response.
   - The existing notes in the HTML page are cleared.
   - The encrypted notes are iterated over, and each encrypted note is displayed in the unordered list (`<ul>`) on the page.

6. Viewing Decrypted Notes:
   - When the user clicks the "View Decrypted Notes" button, the `viewDecryptedNotes` function is called.
   - It retrieves the decryption key entered by the user.
   - If a key is provided, a GET request is made to '/notes' to retrieve the encrypted notes.
   - If the request is successful, the encrypted notes are received as a JSON response.
   - The existing notes in the HTML page are cleared.
   - Each encrypted note is decrypted using the `decryptNoteData` function, which makes a POST request to '/decrypt' with the encrypted note, encrypted key, and decryption key.
   - The decrypted notes are then displayed in the unordered list on the page.

7. Decrypting Note Data:
   - The `decryptNoteData` function is responsible for decrypting an individual note.
   - It sends a POST request to '/decrypt' with the encrypted note, encrypted key, and decryption key.
   - If the request is successful, the decrypted note is received as a response and displayed in the HTML page.

8. Handling Server Requests:
   - The server handles different types of requests.
   - When a POST request is made to '/notes', the server receives the note and key data, encrypts them using `AES-256-CBC` encryption, and stores the encrypted note and key in memory.
   - When a GET request is made to '/notes', the server retrieves the encrypted notes from memory and sends them back as a JSON response.
   - When a POST request is made to '/decrypt', the server receives the encrypted note, encrypted key, and decryption key, decrypts the note, and sends the decrypted note as a response.
   - The server also handles requests for the main HTML page ('/') and the 'style.css' file by serving the respective files.

In summary, this code allows users to save notes securely by encrypting them before storing them on the server. Users can also view their encrypted notes by entering a decryption key. The encryption and decryption operations are performed on the server side to ensure the security of the notes.

