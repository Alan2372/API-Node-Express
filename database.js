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

export default {connection, saveUser, getUserByEmail};