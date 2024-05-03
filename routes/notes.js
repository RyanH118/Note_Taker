const notes = require('express').Router();

// Helper functions for reading and writing to the JSON file
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');

// Helper method for generating unique ids
const uuid = require('../helpers/uuid');

notes.get('/', (req, res) => {
    console.info(`${req.method} request received for notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
  });  

notes.post('/', (req, res) => {
    console.info(`${req.method} request received to add a note`);
  
    const { title, text } = req.body;
  
    if (title && text) {
      const newNote = {
        title,
        text,
        id: uuid(),
      };
  
      readAndAppend(newNote, './db/db.json');
      res.json(`Note added successfully`);
    } else {
      res.error('Error in adding note');
    }
  });

  notes.delete("/:id", (req, res) => {

    const id = req.params.id;

    readFromFile("./db/db.json").then((data) => JSON.parse(data))
    .then((json) => {
      const result = json.filter((note) => note.id != id);
      writeToFile("./db/db.json", result);
      res.json("Note deleted!");
      console.info(`${req.method} request received to delete a note`);
    });
  });

module.exports = notes;