import jwt from 'jsonwebtoken';

const secretKey = 'tracered';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token provided.');
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;