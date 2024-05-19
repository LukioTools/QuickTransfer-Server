const express = require('express')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')


const UserDB = require('./Libs/UserManagement.js')
const FileDB = require('./Libs/FileManagement.js')

UserDB.Connect("DBs/users.db")
FileDB.Connect("DBs/files.db")

const app = express()
const PORT = process.env.PORT || 8080

app.get('/singup', (req, res)=>{
    UserDB.CreateUser(req.headers.username, req.headers.password)
})

app.get('/verifyUser', async(req, res)=>{
    console.log("loginin: " + req.headers.username + " : " + req.headers.password)
    if(req.headers.username && req.headers.password) {
        const isValid = await UserDB.VerifyUser(req.headers.username, req.headers.password);
        if (isValid)
            res.status(200).send("authentication succeed")
    }
    res.status(401).send("failed")
})

app.get('/Files', async(req, res)=>{
    const isvalid = await UserDB.VerifyUser(req.headers.username, req.headers.password)
    if(isvalid.status){
        FileDB.GetFiles(isvalid.id).then((val)=>{
            res.send(val)
        })
    }
})

// Route to handle file upload
app.post('/postback', async(req, res) => {
    console.log("username: " + req.headers.username + " password: " + req.headers.password)
    
    const isValid = await UserDB.VerifyUser(req.headers.username, req.headers.password);
    if(isValid.status)
    {
        var name = crypto.randomUUID();
        const fileStream = fs.createWriteStream(path.join(__dirname, "/uploads/", name))
        req.pipe(fileStream)
        FileDB.CreateFile(isValid.id, name)
        res.send("upload succesfully")
    }else{
        res.status(401).send("authentication failed")
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
