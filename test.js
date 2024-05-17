const express = require('express');
const fs = require('fs');
const path = require('path');

const db = require('./Libs/User.js');
const { CONSTRAINT } = require('sqlite3');
const { Console } = require('console');


db.Connect("users.db")
db.CreateUserTable();
db.CreateUser("hello")
