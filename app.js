const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/notesdb')
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.log('MongoDB Error:', err));

// Schema + Model
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model('Note', noteSchema);

// Home route
app.get('/', (req, res) => {
    res.send('Notes API is running');
});

// GET all notes
app.get('/notes', async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

// CREATE note
app.post('/notes', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const newNote = await Note.create({ title, content });
    res.status(201).json(newNote);
});

// GET note by id
app.get('/notes/:id', async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
});

// UPDATE note
app.put('/notes/:id', async (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const note = await Note.findByIdAndUpdate(
        req.params.id,
        { title, content },
        { new: true }
    );

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    res.json(note);
});

// DELETE note
app.delete('/notes/:id', async (req, res) => {
    const note = await Note.findByIdAndDelete(req.params.id);

    if (!note) {
        return res.status(404).json({ error: 'Note not found' });
    }

    res.status(204).send();
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});