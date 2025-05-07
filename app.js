const express = require('express')
const fs = require('fs');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

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

    if (!valid(email)) {
        return res.send({ message: 'Invalid email address.' }).status(400);
    }

    let users = [];
    try {
        const data = fs.readFileSync('data.json', 'utf8');
        users = JSON.parse(data);
        if (!Array.isArray(users)) users = [];
    } catch (err) {
        users = [];
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).send({ message: 'Username already exists.' });
    }


    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const id = uuidv4();

    const newUser = { id, username, email, hashedPassword };

    users.push(newUser);

    fs.writeFileSync('data.json', JSON.stringify(users, null, 2));

    return res.send({ message: 'User created successfully.', id: id }).status(200);

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
