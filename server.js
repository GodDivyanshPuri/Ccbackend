const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// POST route to run Kotlin code
app.post('/run', async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Code is required' });
    }

    try {
        // JDoodle API ke sath code compile karenge
        const response = await axios.post('https://api.jdoodle.com/v1/execute', {
            script: code,
            language: "kotlin",
            versionIndex: "3",
            clientId: "8b0ccb5a56740f040660f1f5c966982f",
            clientSecret: "2f6cc7133b6086f8bd28ebe86bba3a8b6108e54b69f707cffa27b5c32063f555"
        });

        return res.json({ output: response.data.output });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
