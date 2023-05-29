// const noteInput = document.getElementById('note');
// const keyInput = document.getElementById('key');
// const saveButton = document.getElementById('saveButton');
// const notesList = document.getElementById('notesList');

// saveButton.addEventListener('click', () => {
//   const note = noteInput.value.trim();
//   const key = keyInput.value.trim();
//   if (note && key) {
//     saveNoteToServer(note, key);
//     noteInput.value = '';
//     keyInput.value = '';
//   }
// });

// function saveNoteToServer(note, key) {
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', '/notes');
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//       if (xhr.status === 201) {
//         fetchNotesFromServer();
//       } else {
//         alert('Failed to save note. Please try again.');
//       }
//     }
//   };
//   xhr.send(JSON.stringify({ note, key }));
// }

// function fetchNotesFromServer() {
//   const xhr = new XMLHttpRequest();
//   xhr.open('GET', '/notes');
//   xhr.onreadystatechange = function() {
//     if (xhr.readyState === XMLHttpRequest.DONE) {
//       if (xhr.status === 200) {
//         const notes = JSON.parse(xhr.responseText);
//         displayNotes(notes);
//       } else {
//         alert('Failed to fetch notes. Please try again.');
//       }
//     }
//   };
//   xhr.send();
// }

// function displayNotes(notes) {
//   notesList.innerHTML = '';
//   notes.forEach((note) => {
//     const li = document.createElement('li');
//     // li.textContent = 'Note: ' + note.note;

//     const decryptedLi = document.createElement('li');
//     decryptedLi.textContent = 'Decrypted note: ' + decrypt(note.encryptedNote, Securitykey, initVector);

//     notesList.appendChild(li);
//     notesList.appendChild(decryptedLi);
//   });
// }

// // Fetch initial notes from the server
// fetchNotesFromServer();
