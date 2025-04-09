require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});


app.get('/posts', async (req, res) => {
    try {
        const { clusterId, telegramId } = req.query;

        let entityQuery = 'SELECT * FROM entities WHERE telegram_id = $1';
        const queryParams = [telegramId];

        if (clusterId && clusterId !== 'all') {
            entityQuery += ' AND cluster_id = $2';
            queryParams.push(Number(clusterId));
        }

        const entitiesResult = await pool.query(entityQuery, queryParams);
        const entities = entitiesResult.rows;

        const linksResult = await pool.query('SELECT * FROM news_entity_links WHERE telegram_id = $1', [telegramId]);
        const links = linksResult.rows;

        const newsResult = await pool.query('SELECT * FROM news WHERE telegram_id = $1', [telegramId]);
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
            time: Number(entity.time),
            news: entityNewsMap[entity.id] || [],
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/digest', async (req, res) => {
    try {
        const { telegramId } = req.query;
        const result = await pool.query('SELECT * FROM digests WHERE telegram_id = $1', [telegramId]);

        if (result.rows.length > 0) {
            res.json(result.rows);
        } else {
            console.log('Дайджесты не найдены');
            res.status(404).json({ error: 'No digests found' });
        }
    } catch (error) {
        console.error('Ошибка при запросе дайджестов:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`✅ Server listening on http://localhost:${port}`);
});
