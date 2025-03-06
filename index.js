import express from "express";
import db from "./database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const app = express();
const secretKey = 'tracered';

// To parse JSON bodies
app.use(express.json());

//Endpoint to register a new user
app.post("/register", async (req, res) => {
  console.log('Request body: ', req.body);
  const { name, email, password } = req.body;

  // Validate request parameters
  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  // Save user to database
  try {
    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    db.saveUser({ name, email, password: hashedPassword }, (error, results) => {
      if (error) {
        console.error("Error saving user to the database:", error);
        return res.status(500).send("An unexpected error occurred while saving the user");
      }
      res.status(201).send("User registered successfully");
    });

  } catch (error) {
    console.error("Error encrypting password:", error);
    return res.status(500).send("An unexpected error occurred while encrypting password");
  }
});


// Endpoint to login a user
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Missing required fields');
  }

  // Get user from database
  db.getUserByEmail(email, async (error, user) => {
    if (error) {
      console.error('Error fetching user from database:', error);
      return res.status(500).send('An unexpected error occurred while fetching user');
    }

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid email or password');
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });

    res.status(200).send({ message: 'Successfully logged in', token });
  });
});

// Endpoint to get user profile
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
