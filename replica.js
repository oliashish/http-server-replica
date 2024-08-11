import express from 'express';
// import { json } from 'body-parser';
// import { processTask } from './common/tasks';

const app = express();
const port = process.argv[2] || 3001;

let businessLogic;

app.use(express.json());

// Initialize business logic
app.post('/init', (req, res) => {
    const { code } = req.body;
    try {
        businessLogic = new Function('task', code);
        console.log('Business logic received and initialized');
        res.send('Business logic received and initialized');
    }catch (err) {
        console.log(`Error while distributing code to MS: ${err}`);

    }
});

// Execute task
app.post('/execute', (req, res) => {
    const { task } = req.body;
    if (businessLogic) {
        try {
            const {wordCount, charCount} = businessLogic(task);
            console.log(`result on replica: ${wordCount} - ${charCount}`);
            res.json({ wordCount, charCount }); // Ensure the response is JSON
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(500).json({ error: 'Business logic not initialized' });
    }
});
app.listen(port, () => {
    console.log(`Replica microservice running on port ${port}`);
});
