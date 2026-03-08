const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// Корневой маршрут — для проверки
app.get('/', (req, res) => {
    res.send('Прокси-сервер работает. Используйте POST /api/detect');
});

// ✅ Маршрут /api/detect теперь должен работать
app.post('/api/detect', async (req, res) => {
    try {
        const { texts, images } = req.body;

        // ✅ Правильный URL: с дефисом, а не подчёркиванием
        const targetUrl = 'https://ivanm151-ai-detector.hf.space/detect';

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ texts, images }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ошибка от AI Detector:', response.status, errorText);
            return res.status(500).json({ error: 'Ошибка при анализе' });
        }

        const data = await response.json();
        res.json(data); // Возвращаем JSON фронтенду
    } catch (error) {
        console.error('Ошибка при обращении к AI Detector:', error);
        res.status(500).json({ error: 'Не удалось выполнить анализ' });
    }
});

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`✅ Прокси-сервер запущен на http://localhost:${PORT}`);
    console.log(`→ Проверка: http://localhost:${PORT}/`);
    console.log(`→ API: POST http://localhost:${PORT}/api/detect`);
});