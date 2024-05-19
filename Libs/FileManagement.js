const bcrypt = require("bcrypt");
const { verbose } = require("sqlite3")
const sqlite3 = require("sqlite3").verbose();

let db

function Connect(name){
    db = new sqlite3.Database(name)
}

function CreateFileTable(){
    db.run(`
        CREATE TABLE files
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usr_id INTEGER NOT NULL
            file TEXT NOT NULL UNIQUE
            upload_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `)
}

function DropUserTable(){
    db.run(`
        DROP TABLE files;
    `)
}

function CreateFile(user_id, file_name){
    return new Promise((resolve, reject)=>{
        db.run(`INSERT INTO files (usr_id, file) VALUES (?, ?)`, [user_id, file_name], function(err){
            if(err)
                reject("file creation failed")
            resolve("file creation succeed")
        })
    })
}

function GetFiles(user_id){
    return new Promise((resolve, reject)=>{
        db.all(`SELECT usr_id, file, upload_timestamp FROM files WHERE usr_id=?`, [user_id], function(err, files){
            if(err)
                reject("sqlite failed: " + err);
            resolve(files);
        });
    });
}