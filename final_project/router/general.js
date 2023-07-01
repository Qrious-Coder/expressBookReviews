const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username
    const password = req.body.password
    if( username && password ){
        if( !isValid(username )){
            users.push({"username": username, "password": password})
            return res.status(200).json({ message: 'Successfully registered!'})
        } else {
            return res.status(404).json({message: 'User already exists!'})
        }
    }
    return res.status(404).json({message: 'Unable to register user.'})
});

// Get the book list with async/await
public_users.get('/', async function (req, res) {
    // Simulate 2' delay with Promise
    const getBooks = () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(books);
            }, 2000);  
        });
    };

    try {
        const booksData = await getBooks();
        res.send(JSON.stringify(booksData,null,4));
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'An error occurred!'});
    }
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    const getBookByIsbn = (isbn) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const book = books[isbn]
                if (book) {
                    resolve(book)
                } else {
                    reject(new Error('Book unfound'))
                }
            }, 2000);
        });
    };

    try {
        const bookData = await getBookByIsbn(isbn)
        res.status(200).json(bookData);
    } catch (error) {
        console.error(error)
        res.status(404).json({message: 'Book unfound'})
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author

    const getBooksByAuthor = (author) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredByAuthor = []
                Object.keys(books).forEach((key) => {
                    if (books[key].author === author) {
                        filteredByAuthor.push(books[key])
                    }
                });
                resolve(filteredByAuthor)
            }, 2000); 
        });
    };

    try {
        const booksData = await getBooksByAuthor(author)
        res.status(200).json(booksData)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Server error!'})
    }
});


// Get book based on title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title

    const getBooksByTitle = (title) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                let filteredByTitle = []
                Object.keys(books).forEach((key) => {
                    if (books[key].title === title) {
                        filteredByTitle.push(books[key]) 
                    }
                });
                resolve(filteredByTitle);
            }, 2000)
        });
    };

    try {
        const booksData = await getBooksByTitle(title)
        res.status(200).json(booksData)
    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'An error occurred'})
    }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    const book = books[isbn];

    if (book) {
      if (Object.keys(book.reviews).length === 0) {
        return res.status(200).json({ message: `${book.title} has no reviews yet.` });
      } else {
        return res.status(200).json(book.reviews);
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
