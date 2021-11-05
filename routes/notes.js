const app = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');


// GET route for retrieving all the notes
app.get('/', (req, res) => {
  readFromFile('./db/notes.json')
    .then((data) => 
      {return res.json(JSON.parse(data))});
});

// POST route for a new note
app.post('/', (req, res) => {
  const { title, note } = req.body;

  if (req.body) {
    const newNote = {
      title,
      note,
      id: uuid(),
    };
    readAndAppend(newNote, './db/notes.json');
    res.json('Noted!');
  } else {
    res.error('Error in adding note');
  }
});

// DELETE route for deleting a note with a specific ID
app.delete('/:id', (req, res) => {
  let id = req.params.id;

  readFromFile('./db/notes.json')
    .then((data) => {
      let noteData = JSON.parse(data);
      for (let i = 0; i < noteData.length; i++) {
        if (noteData[i].id === id) {
          noteData.splice([i], 1);
        }
      }
      writeToFile('./db/notes.json', noteData)
      res.json('Note deleted!')
    });
});

module.exports = app;
