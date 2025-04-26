const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// CORS setup — only allow your frontend URL
app.use(cors({
    origin: 'https://divyanshccfkotlin.netlify.app'
}));

app.use(bodyParser.json());

// Route to run Kotlin code
app.post('/run', (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is missing' });
    }

    const filename = 'temp.kt';

    // Save the code into a temp file
    fs.writeFileSync(filename, code);

    // Compile and run using kotlinc
    exec(`kotlinc temp.kt -include-runtime -d temp.jar && java -jar temp.jar`, (error, stdout, stderr) => {
        if (error) {
            console.error('Execution error:', error);
            return res.json({ output: stderr || error.message });
        }
        res.json({ output: stdout });
    });
});

// Route to save the code (optional future use)
app.post('/save', (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is missing' });
    }

    // Save to permanent file
    fs.writeFileSync('saved_code.kt', code);
    res.json({ message: 'Code saved successfully!' });
});

// Basic home route
app.get('/', (req, res) => {
    res.send('Kotlin Code Runner Backend is Working!');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
