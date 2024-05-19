const express = require('express');
const fs = require('fs');
const path = require('path');

const db = require('./Libs/User.js');
const { CONSTRAINT } = require('sqlite3');
const { Console } = require('console');
const { verify } = require('crypto');


db.Connect("users.db")
//db.DropUserTable()
//db.CreateUserTable();
//db.CreateUser("vili", "Kala")
db.VerifyUserV2("vili", "Not password").then((responce)=>{
    console.log(responce)
}).catch((res)=>{
    console.log("failed: " + res)
})