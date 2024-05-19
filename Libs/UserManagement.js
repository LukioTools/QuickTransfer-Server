const bcrypt = require("bcrypt");
const { verbose } = require("sqlite3");
const sqlite3 = require('sqlite3').verbose();

const crypto = require('crypto');

let db 

function Connect(name){
    db = new sqlite3.Database(name)
}

function CreateUserTable(){
    db.run(`
    CREATE TABLE users
    (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usr TEXT NOT NULL UNIQUE,
        pwd TEXT NOT NULL UNIQUE
    )
    `, function(err){
        if(err)
            console.log("table is there already: " + err)
    })
}

function DropUserTable(){
    db.run(`
        DROP TABLE users;
    `)
}

function CreateUser(usr, password){
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, 0, function(err, hash){
            if(err){
                console.error("Error hashing password:", err);
                resolve("failed hashing password")
                return;
            }
            uuid = crypto.randomUUID()
            db.run(`INSERT INTO users (pwd, usr) VALUES (?,?)`, [hash, usr], function(err){
                if(err){
                    reject("Error inserting user");
                    return;
                }
                resolve("completed")
            });
        });            
    })
}

function VerifyUser(USR, PWD){
    return new Promise((res, rej)=>{
        db.get('SELECT * FROM users WHERE usr=?', [USR], function(err, usr){
            if(err)
                res(false)
            console.log(usr)
            bcrypt.compare(PWD, usr.PWD, function(err, valid){
                if(err)
                    res(false)
                if(!valid)
                    res(false)
                res(true)
            })
        })
    })
}

exports.Connect = Connect
exports.CreateUserTable = CreateUserTable 
exports.DropUserTable = DropUserTable 
exports.CreateUser = CreateUser 
exports.VerifyUser = VerifyUser