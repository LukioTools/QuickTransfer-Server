const express = require('express');
const fs = require('fs');
const path = require('path');

const UserDataDB = require('./Libs/UserManagement.js');
const FileDB = require('./Libs/FileManagement.js')

FileDB.Connect("DBs/files.db")
UserDataDB.Connect("DBs/users.db")
//UserDataDB.DropUserTable()
UserDataDB.CreateUserTable()
//FileDB.CreateFileTable()
//FileDB.CreateFile("1", "file")
//FileDB.DropUserTable()