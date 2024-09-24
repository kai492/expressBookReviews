const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require('fs');
const { error } = require('console');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password){
      if (!users.find(user => user.username === username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered."});

      } else {
        return res.status(400).json({message: "Username already exists."});
      }

    } else {
      return res.status(400).json({message: "Username and password are required."});
    }

});

// Get the book list available in the shop
//public_users.get('/',function (req, res) {res.send(JSON.stringify(books,null,4));});
// use Promise callbacks
public_users.get('/', function (req, res){
  fs.promises.readFile('./router/booksdb.js', 'utf8')
  .then(booksData => {
    const books = eval(booksData);
    res.send(JSON.stringify(books, null, 4));
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error reading file');
  });
});



// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //const isbn = req.params.isbn;
  //res.send(books[isbn]);});
//using async/await
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.send(book);
    } else {
      res.status(404).send({ error: 'Book not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});




  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const authorBooks = {};
  for (let isbn in books) {
    if (books[isbn].author === author){
      authorBooks[isbn] = books[isbn];
    }
  }
  res.send(authorBooks);
  
});

// using promises
public_users.get('/author2/:author', function (req, res) {
  const author = req.params.author;
  Promise.resolve()
    .then(() => {
      const authorBooks = {};
      for (let isbn in books) {
        if (books[isbn].author === author){
          authorBooks[isbn] = books[isbn];
        }
      }
      res.send(authorBooks);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({ error: 'Internal Server Error' });
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const titleBooks = {};
  for (let isbn in books) {
    if (books[isbn].title === title){ 
      titleBooks[isbn] = books[isbn];
     }
    }
      res.send(titleBooks);})
    

//using async/await
public_users.get('/title2/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const titleBooks = {};
    for (let isbn in books) {
      if (books[isbn].title === title) {
        titleBooks[isbn] = books[isbn];
      }
    }
    res.send(titleBooks);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn =req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
