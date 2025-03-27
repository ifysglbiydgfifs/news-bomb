const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'db.json');

function readDb() {
    try {
        const data = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading db.json:', err);
        return { posts: [], favorites: [] };
    }
}

function writeDb(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error writing to db.json:', err);
    }
}

app.get('/posts', (req, res) => {
    const db = readDb();
    res.json(db.posts);
});

app.get('/favorites', (req, res) => {
    const db = readDb();
    res.json(db.favorites);
});

app.post('/favorites', (req, res) => {
    const post = req.body;
    const db = readDb();

    if (db.favorites.some(savedPost => savedPost.id === post.id)) {
        return res.status(200).json({ message: 'Post already in favorites' });
    }

    db.favorites.push(post);
    writeDb(db);
    return res.status(201).json({ message: 'Post added to favorites' });
});

app.delete('/favorites', (req, res) => {
    console.log('Request body:', req.body);

    const { id } = req.body;
    const db = readDb();

    const postIndex = db.favorites.findIndex(post => post.id === parseInt(id));

    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    db.favorites.splice(postIndex, 1);
    writeDb(db);
    return res.status(200).json({ message: 'Post removed from favorites' });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});