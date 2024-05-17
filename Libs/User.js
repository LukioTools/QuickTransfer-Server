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
        UUID varchar(36) NOT NULL UNIQUE,
        key varchar(500) NOT NULL UNIQUE
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

function CreateUser(password){
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, 0, function(err, hash){
            if(err){
                console.error("Error hashing password:", err);
                return;
            }
            uuid = crypto.randomUUID()
            db.run(`INSERT INTO users (key, UUID) VALUES (?,?)`, [hash, uuid], function(err){
                if(err){
                    console.error("Error inserting user:", err);
                    reject("Error inserting user");
                    return;
                }
                console.log("User inserted successfully.");
                resolve(uuid)
            });
        });            
    })
}

function VerifyUser(pwd){
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", function(err, rows) {
            if (err) {
                console.log("database error:", err);
                reject(err); // Reject the promise if there's a database error
                return;
            }
    
            console.log("finding");

            found = 0
    
            let comparisonCount = 0; // Track the number of comparisons made
    
            for (const user of rows) {
                console.log("pwd: " + pwd + " key: " + user.key);
                bcrypt.compare(pwd, user.key, function(err, result) {
                    if (err) {
                        console.log("error while comparing keys:", err);
                        found = 1
                        reject(err); // Reject the promise if there's a comparison error
                        return;
                    }
                    
                    console.log(result);
    
                    if (result) {
                        found = 1
                        resolve(user.ID); // Resolve the promise with the user ID if the password matches
                        return;
                    }
    
                    comparisonCount++; // Increment the comparison count
    
                    if (comparisonCount === rows.length) {
                        // If all comparisons have been made and none matched, resolve with -1
                        found = 1
                        resolve(-1);
                        return;
                    }
                });
            }
        });
    });
    
}

function VerifyUserV2(uuid, pwd){
    db.run('SELECT * FROM users WHERE UUID=?', [uuid], function(err, usr){
        console.log(usr)
    })
}

exports.Connect = Connect
exports.CreateUserTable = CreateUserTable 
exports.DropUserTable = DropUserTable 
exports.CreateUser = CreateUser 
exports.VerifyUser = VerifyUser 