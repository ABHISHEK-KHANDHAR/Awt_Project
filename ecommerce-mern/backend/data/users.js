const bcrypt = require("bcryptjs");

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123", // the model hooks will handle hashing later, wait no they won't during insertMany
    isAdmin: true
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    isAdmin: false
  }
];

module.exports = users;
