const express = require('express');
const axios = require('axios');

const app = express();
const port = 9876;
const windowSize = 10;
const storedNumbers = [];

const fetchNumbersFromAPI = async (type) => {
    try {
        const response = await axios.get(`http://thirdpartyserver.com/${type}`, { timeout: 500 });
        return response.data.numbers;
    } catch (error) {
        console.error('Error fetching numbers:', error);
        return [];
    }
};

const calculateAverage = (numbers) => {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
};

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const validIds = ['p', 'f', 'e', 'r'];

    if (!validIds.includes(numberid)) {
        return res.status(400).json({ error: 'Invalid number ID' });
    }

    const newNumbers = await fetchNumbersFromAPI(numberid);

    // Store unique numbers
    newNumbers.forEach(num => {
        if (!storedNumbers.includes(num)) {
            if (storedNumbers.length >= windowSize) {
                storedNumbers.shift(); // Remove oldest number
            }
            storedNumbers.push(num);
        }
    });

    const average = calculateAverage(storedNumbers);

    res.json({
        windowPrevState: storedNumbers.slice(0, -newNumbers.length),
        windowCurrState: storedNumbers,
        numbers: newNumbers,
        avg: average.toFixed(2),
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
