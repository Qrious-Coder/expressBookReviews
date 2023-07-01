const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const session = require('express-session')

let users = [];

const isValid = (username)=>{
    const duplicateUsername = users.filter((user) => {
        return user.username === username
    })
    if( duplicateUsername.length > 0){
        return true
    }else{
        return false
    }
 }

const authenticatedUser = (username,password)=>{ 
    let validUsers = users.filter( user => {
        return (user.username === username && user.password === password )
    })
    if(validUsers.length > 0){
        return true
    }else{
        return false
    }
}

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body
  console.log(`@@@`,users)
    if (!username || !password) {
    return res.status(404).json({message: "Neither username nor password is provided!"});
    }
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60*60 })

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({token: accessToken})
    }else{
        return res.status(208).json({message: "Invalid login"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
