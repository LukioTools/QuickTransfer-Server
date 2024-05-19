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
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        USR varchar(36) NOT NULL UNIQUE,
        PWD varchar(500) NOT NULL UNIQUE
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
            db.run(`INSERT INTO users (PWD, USR) VALUES (?,?)`, [hash, usr], function(err){
                if(err){
                    console.error("Error inserting user:", err);
                    reject("Error inserting user");
                    return;
                }
                console.log("User inserted successfully.");
                resolve("completed")
            });
        });            
    })
}

// 1: successfull
// 0: usermame or password is incorrect 

function VerifyUser(USR, PWD){
    return new Promise((res, rej)=>{
        db.get('SELECT * FROM users WHERE USR=?', [USR], function(err, usr){
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