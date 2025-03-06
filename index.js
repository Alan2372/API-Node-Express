import express from "express";
import db from "./database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authenticateToken from "./authRoutes.js";
import upload from "./uploadFile.js";

const app = express();
const secretKey = 'tracered';

// To parse JSON bodies
app.use(express.json());

//--------------------------------------------------------------
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
//--------------------------------------------------------------

//--------------------------------------------------------------
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
//--------------------------------------------------------------

//--------------------------------------------------------------
// CRUD endpoints for tasks

// Create a new task
app.post('/createTask', authenticateToken, upload.single('attachment'), (req, res) => {
  const { title, description, dueDate, status } = req.body;
  const userId = req.user.id;
  const fileBuffer = req.file ? req.file.buffer : null;
  const fileName = req.file ? req.file.originalname : null;

  db.createTask({ userId, title, description, dueDate, status, attachment: fileBuffer, attachment_name: fileName }, (error, results) => {
    if (error) {
      console.error('Error creating task:', error);
      return res.status(500).send('An unexpected error occurred while creating the task');
    }
    res.status(201).send('Task created successfully');
  });
});

// List tasks for the authenticated user
app.get('/getTasks', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.getTasksByUserId(userId, (error, tasks) => {
    if (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).send('An unexpected error occurred while fetching tasks');
    }
    res.status(200).send(tasks);
  });
});

// Get details of a specific task
app.get('/getTask/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.getTaskById(taskId, userId, (error, task) => {
    if (error) {
      console.error('Error fetching task:', error);
      return res.status(500).send('An unexpected error occurred while fetching the task');
    }
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.status(200).send(task);
  });
});

// Update a task
app.put('/updateTask/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, dueDate, status } = req.body;

  db.updateTask(taskId, userId, { title, description, dueDate, status }, (error, results) => {
    if (error) {
      console.error('Error updating task:', error);
      return res.status(500).send('An unexpected error occurred while updating the task');
    }
    res.status(200).send('Task updated successfully');
  });
});

// Delete a task
app.delete('/deleteTask/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.deleteTask(taskId, userId, (error, results) => {
    if (error) {
      console.error('Error deleting task:', error);
      return res.status(500).send('An unexpected error occurred while deleting the task');
    }
    res.status(200).send('Task deleted successfully');
  });
});

//--------------------------------------------------------------


//--------------------------------------------------------------
// Endpoints for file attachments to tasks

// Attach a file to a task
app.post('/tasks/:id/addFile', authenticateToken, upload.single('attachment'), (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  db.updateTask(taskId, userId, { attachment: fileBuffer, attachment_name: fileName }, (error, results) => {
    if (error) {
      console.error('Error attaching file to task:', error);
      return res.status(500).send('An unexpected error occurred while attaching file to task');
    }
    res.status(200).send('File attached successfully');
  });
});

// Download an attachment
app.get('/tasks/:id/getFile', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.getTaskById(taskId, userId, (error, task) => {
    if (error) {
      console.error('Error fetching task:', error);
      return res.status(500).send('An unexpected error occurred while fetching the task');
    }
    if (!task || !task.attachment) {
      return res.status(404).send('Attachment not found');
    }
    res.setHeader('Content-Disposition', `attachment; filename=${task.attachment_name}`);
    res.send(task.attachment);
  });
});

// Delete an attachment
app.delete('/tasks/:id/deleteFile', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.getTaskById(taskId, userId, (error, task) => {
    if (error) {
      console.error('Error fetching task:', error);
      return res.status(500).send('An unexpected error occurred while fetching the task');
    }
    if (!task || !task.attachment) {
      return res.status(404).send('Attachment not found');
    }

    db.updateTask(taskId, userId, { attachment: null, attachment_name: null }, (error, results) => {
      if (error) {
        console.error('Error updating task:', error);
        return res.status(500).send('An unexpected error occurred while updating the task');
      }
      res.status(200).send('Attachment deleted successfully');
    });
  });
});


//--------------------------------------------------------------

//--------------------------------------------------------------
// Endpoints for filtering tasks

// Filter tasks by category
app.get('/tasks/category/:categoryId', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const categoryId = req.params.categoryId;

  db.filterTasksByCategory(userId, categoryId, (error, tasks) => {
    if (error) {
      console.error('Error fetching tasks by category:', error);
      return res.status(500).send('An unexpected error occurred while fetching tasks');
    }
    res.status(200).send(tasks);
  });
});

// Filter tasks by status
app.get('/tasks/status/:status', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const status = req.params.status;

  db.filterTasksByStatus(userId, status, (error, tasks) => {
    if (error) {
      console.error('Error fetching tasks by status:', error);
      return res.status(500).send('An unexpected error occurred while fetching tasks');
    }
    res.status(200).send(tasks);
  });
});

//--------------------------------------------------------------

//--------------------------------------------------------------
// Endpoint to get categories

// Get all categories
app.get('tasks/categories', authenticateToken, (req, res) => {
  db.getCategories((error, categories) => {
    if (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).send('An unexpected error occurred while fetching categories');
    }
    res.status(200).send(categories);
  });
});

//--------------------------------------------------------------


// Endpoint to get user profile
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
