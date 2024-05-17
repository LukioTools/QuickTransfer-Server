const express = require('express');
const fs = require('fs');
const path = require('path');

const UserDB = require('./Libs/User.js');
UserDB.Connect("users.db")

const app = express();
const PORT = process.env.PORT || 8080;

// Route to handle file upload
app.post('/postback', async(req, res) => {
    console.log(req.headers.cookie)
    console.log(req.headers.key)
    const isValid = await UserDB.VerifyUser(req.headers.key);

    if(isValid)
    {
        console.log("validate: " + req.headers.validate)
        if(req.headers.validate){
            console.log("validates")
            res.send("correct Key")
            return
        }

        var name = req.headers.cookie;
        const fileStream = fs.createWriteStream(path.join(__dirname, "/uploads/", name))
        req.pipe(fileStream)
        res.send("done")
    }else{
        console.log("key auth failed")
        res.status(401).send("key fucked")
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
