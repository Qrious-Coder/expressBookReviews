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

// Login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body
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
        return res.status(200).json({ 
            message: 'successfully logined', 
            token: accessToken})
    }else{
        return res.status(208).json({message: "Invalid login"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const review = req.body.review
    let username;
    if(req.session.authorization){ 
      username = req.session.authorization['username']
    } else {
      return res.status(403).json({
        message:"User is not authenticated."
      });
    }
    
    const book = books[isbn]
    if(!book){
      return res.status(404).json({message: "Book unfound!"})
    }
  
    const alreadyReviewed = book.reviews[username]
    if(alreadyReviewed) {
      book.reviews[username] = review
    } else {
      book.reviews[username] = review
    }
  
    return res.status(200).json(book)
});

// Delate a book
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    let username;
    if(req.session.authorization){ 
        username = req.session.authorization['username']
    } else {
        return res.status(403).json({
            message:"User is not authenticated."
        });
    }
    
    const book = books[isbn]
    if(!book){
        return res.status(404).json({message: "Book unfound!"})
    }
  
    const alreadyReviewed = book.reviews[username]
    if( alreadyReviewed ) {
        delete book.reviews[username];  
        return res.status(200).json({ message: `Deleted the reviews of Book ISBN ${isbn}`})
    } else {
        return res.status(400).json({message: 'Review unfound!'})
    }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
