import mysql from 'mysql2';

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'task_manager'
});

// Open MySQL connection
connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

const saveUser = (user, callback) => {
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  connection.query(query, [user.name, user.email, user.password], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const getUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

const createTask = (task, callback) => {
  const query = 'INSERT INTO tasks (user_id, title, description, due_date, status, attachment, attachment_name) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [task.userId, task.title, task.description, task.dueDate, task.status, task.attachment, task.attachment_name], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const getTasksByUserId = (userId, callback) => {
  const query = 'SELECT * FROM tasks WHERE user_id = ?';
  connection.query(query, [userId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const getTaskById = (taskId, userId, callback) => {
  const query = 'SELECT * FROM tasks WHERE id = ? AND user_id = ?';
  connection.query(query, [taskId, userId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

const updateTask = (taskId, userId, task, callback) => {
  const query = 'UPDATE tasks SET title = ?, description = ?, due_date = ?, status = ?, attachment = ?, attachment_name = ? WHERE id = ? AND user_id = ?';
  connection.query(query, [task.title, task.description, task.dueDate, task.status, task.attachment, task.attachment_name, taskId, userId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const deleteTask = (taskId, userId, callback) => {
  const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
  connection.query(query, [taskId, userId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const getCategories = (callback) => {
  const query = 'SELECT * FROM categories';
  connection.query(query, (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const filterTasksByCategory = (userId, categoryId, callback) => {
  const query = 'SELECT * FROM tasks WHERE user_id = ? AND category_id = ?';
  connection.query(query, [userId, categoryId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

const filterTasksByStatus = (userId, status, callback) => {
  const query = 'SELECT * FROM tasks WHERE user_id = ? AND status = ?';
  connection.query(query, [userId, status], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

export default {
  connection, 
  saveUser, 
  getUserByEmail, 
  createTask, 
  getTasksByUserId, 
  getTaskById, 
  updateTask, 
  deleteTask,
  getCategories,
  filterTasksByCategory,
  filterTasksByStatus
};