const express = require('express');
const fs = require('fs');
const path = require('path');

const UserDB = require('./Libs/User.js');
UserDB.Connect("users.db")

const app = express();
const PORT = process.env.PORT || 8080;

app.get('/singup', (req, res)=>{
    UserDB.CreateUser(req.headers.username, req.headers.password)
})

app.get('/verifyUser', async(req, res)=>{
    const isValid = await UserDB.VerifyUser(req.headers.username, req.headers.password);
    if (isValid)
        res.status(200).send("authentication succeed")
    res.status(401).send(failed)
})

// Route to handle file upload
app.post('/postback', async(req, res) => {
    console.log("username: " + req.headers.username + " password: " + req.headers.password)
    
    const isValid = await UserDB.VerifyUser(req.headers.username, req.headers.password);
    if(isValid)
    {
        var name = req.headers.name;
        const fileStream = fs.createWriteStream(path.join(__dirname, "/uploads/", name))
        req.pipe(fileStream)
        res.send("upload succesfully")
    }else{
        res.status(401).send("authentication failed")
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
