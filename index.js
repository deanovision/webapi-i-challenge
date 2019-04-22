// import express using CommonJS
const express = require("express");
// import database
const db = require("./data/db");
// setup server using express
const server = express();
// tell server to parse json
server.use(express.json());
//setup server to listen on port 5555
server.listen(5555, () => {
  console.log("\n****SERVER RUNNING ON PORT 5555****\n");
});
/// set up endpoints for /api/users
//// set up POST request
server.post("/api/users", (req, res) => {
  const userObj = req.body;
  // check to ensure the req.body includes a name and bio
  if (!userObj.name || !userObj.bio) {
    res
      .status(404)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(userObj)
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => {
        res.status(500).json({
          error: "There was an error while saving the user to the database"
        });
      });
  }
});
//// setup GET request for /api/users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({
        error: "The users information could not be retrieved."
      });
    });
});
//// setup GET request for /api/user/:id
server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(user => {
      //check to see if user exists in db if not return 404 message
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The user information could not be retrieved."
      });
    });
});

//// setup DELETE request for /api/users/:id
server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(user => {
      //check to see if user exists in db if not return 404 message
      if (!user) {
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      } else {
        res.status(200).json({ message: "The user was removed" });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The user could not be removed"
      });
    });
});
///// setup UPDATE request for /api/users/:id
server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const updatedObj = req.body;
  db.update(id, updatedObj)
    .then(user => {
      if (!user) {
        //check to see if user exists in db if not return 404 message
        res.status(404).json({
          message: "The user with the specified ID does not exist."
        });
      } else {
        res.status(200).json({ message: "user was updated succesfully" });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Please provide name and bio for the user."
      });
    });
});
