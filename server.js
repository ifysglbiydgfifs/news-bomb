const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3001;

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
        const entitiesResult = await pool.query('SELECT * FROM entities');
        const entities = entitiesResult.rows;

        const linksResult = await pool.query('SELECT * FROM news_entity_links');
        const links = linksResult.rows;

        const newsResult = await pool.query('SELECT * FROM news');
        const news = newsResult.rows;

        const newsMap = new Map();
        for (const n of news) {
            newsMap.set(n.id, {
                title: n.title,
                text: n.text,
                time: new Date(Number(n.time)).getTime(),
            });
        }

        const entityNewsMap = {};
        for (const link of links) {
            const { entity_id, news_id } = link;
            if (!entityNewsMap[entity_id]) entityNewsMap[entity_id] = [];
            if (newsMap.has(news_id)) {
                entityNewsMap[entity_id].push(newsMap.get(news_id));
            }
        }

        const result = entities.map(entity => ({
            ...entity,
            link: entity.link ? entity.link.split(',').map(Number).filter(Boolean) : [],
            news: entityNewsMap[entity.id] || [],
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
