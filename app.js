const express = require('express')
const fs = require('fs');
const bcrypt = require('bcrypt');

const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log(11)
    res.send('Welcome to the Express.js Tutorial');
})


app.post('/sign-in', async (req, res) => {
    const { username, email, password } = req.body;

    function valid(email) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email);
    }

    if (valid(email)) {
        const saltRounds = 10; // Adjust the salt rounds as needed
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
    
        const data = { username, email, hashedPassword };
    
        const jsonString = JSON.stringify(data, null, 2); // Convert data to JSON string with indentation
        fs.writeFileSync('data.json', jsonString);
    
        res.send({ message: 'User created successfully.', username:username }).status(200);
    }
    
    
    res.send({ message: 'Invalid email address.' }).status(400);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
