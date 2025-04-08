const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'DigestBot',
    password: '123',
    port: 5432,
});

app.get('/posts', async (req, res) => {
    try {
        const newsResult = await pool.query('SELECT * FROM news');
        const entitiesResult = await pool.query('SELECT * FROM entities');

        const entitiesMap = entitiesResult.rows.reduce((acc, entity) => {
            const links = entity.link ? entity.link.split(',').map(Number) : [];
            acc[entity.id] = {
                name: entity.name,
                links: links,
            };
            return acc;
        }, {});

        const postMap = newsResult.rows.map(news => {
            const entityInfo = entitiesMap[news.id] || {};
            const link = entityInfo.links || [];

            return {
                ...news,
                title: entityInfo.name || news.title,
                time: parseInt(news.time),
                link: link,
            };
        });
        res.json(postMap);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

app.get('/favorites', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM news WHERE id IN (SELECT news_id FROM favorites)');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching favorites:', err);
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

app.post('/favorites', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('INSERT INTO favorites(news_id) VALUES($1) ON CONFLICT DO NOTHING', [id]);
        res.status(201).json({ message: 'Post added to favorites' });
    } catch (err) {
        console.error('Error adding to favorites:', err);
        res.status(500).json({ error: 'Failed to add to favorites' });
    }
});

app.delete('/favorites', async (req, res) => {
    const { id } = req.body;
    try {
        await pool.query('DELETE FROM favorites WHERE news_id = $1', [id]);
        res.status(200).json({ message: 'Post removed from favorites' });
    } catch (err) {
        console.error('Error removing from favorites:', err);
        res.status(500).json({ error: 'Failed to remove from favorites' });
    }
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});