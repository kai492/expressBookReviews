const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
  let validuser = users.filter((user) => {
    return(user.username === username && user.password === password);
  });
  if (validuser.length > 0){return true;}
  else{return false;}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username =req.body.username;
  const password = req.body.password;

  if (!username || !password){
    res.status(400).send({message: "Please enter both username and password"});
  }
  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({data : password },'access', {expiresIn:60*60} );
    req.session.authorization = {accessToken, username}
    return res.status(200).send("User successfully logged in");
  } else {
    res.status(401).send({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  const book = books[isbn];

  if (!book) {
    return res.status(404).send({ message: "Book not found" });
  }
  const existingReview = book.reviews[username];

  if (existingReview){ existingReview.review = review;}
  else {book.reviews[username] = review;}

  res.send({message: "Review saved successfuly"});

  
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
  const isbn = req.params.isbn;
  const username = req.session.username;
  const book = books[isbn];
  if (!book){
    return res.status(404).send({message: "Book not found"});
  }
  if(!book.reviews){
    return res.status(404).send({message: "Book has no reviews"});
  }
  if (book.reviews[username]){
    delete book.reviews[username];
    res.send({message: "Review deleted successfully"});
  } else{
    res.status(404).send({message: "Review not found"});
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
