const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Simulated database
let db = {
  users: [],
  sessions: []
};

// Create db.json if it doesn't exist
if (!fs.existsSync('db.json')) {
  fs.writeFileSync('db.json', JSON.stringify(db));
} else {
  db = JSON.parse(fs.readFileSync('db.json'));
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'futuristic-slot-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true in production with HTTPS
}));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/profile', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, 'views', 'profile.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// API Endpoints
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.users.find(u => u.username === username && u.password === password);
  
  if (user) {
    req.session.userId = user.id;
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;
  
  if (db.users.some(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }
  
  const newUser = {
    id: Date.now().toString(),
    username,
    password,
    email,
    balance: 1000, // Starting balance
    level: 1,
    experience: 0,
    profilePicture: 'default.png',
    theme: 'default',
    achievements: [],
    lastLogin: new Date().toISOString()
  };
  
  db.users.push(newUser);
  fs.writeFileSync('db.json', JSON.stringify(db));
  
  req.session.userId = newUser.id;
  res.json({ success: true, user: newUser });
});

app.get('/api/user', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const user = db.users.find(u => u.id === req.session.userId);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.post('/api/user/update', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const userIndex = db.users.findIndex(u => u.id === req.session.userId);
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const updates = req.body;
  db.users[userIndex] = { ...db.users[userIndex], ...updates };
  fs.writeFileSync('db.json', JSON.stringify(db));
  
  res.json({ success: true, user: db.users[userIndex] });
});

app.post('/api/slot/spin', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  
  const { betAmount } = req.body;
  const userIndex = db.users.findIndex(u => u.id === req.session.userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  if (db.users[userIndex].balance < betAmount) {
    return res.status(400).json({ success: false, message: 'Insufficient balance' });
  }
  
  // Deduct bet amount
  db.users[userIndex].balance -= betAmount;
  
  // Generate random symbols (3 reels)
  const symbols = ['seven', 'bar', 'cherry', 'bell', 'diamond', 'horseshoe'];
  const result = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)]
  ];
  
  // Calculate winnings
  let winnings = 0;
  let multiplier = 0;
  
  // Check for winning combinations
  if (result[0] === result[1] && result[1] === result[2]) {
    // All three symbols match
    multiplier = {
      'seven': 10,
      'bar': 8,
      'bell': 6,
      'diamond': 5,
      'horseshoe': 4,
      'cherry': 3
    }[result[0]];
  } else if (result[0] === 'cherry' || result[1] === 'cherry' || result[2] === 'cherry') {
    // At least one cherry
    multiplier = 1;
  }
  
  winnings = betAmount * multiplier;
  db.users[userIndex].balance += winnings;
  
  // Add experience
  db.users[userIndex].experience += 10;
  
  // Check for level up
  if (db.users[userIndex].experience >= 100) {
    db.users[userIndex].level += 1;
    db.users[userIndex].experience = 0;
  }
  
  fs.writeFileSync('db.json', JSON.stringify(db));
  
  res.json({
    success: true,
    result,
    winnings,
    newBalance: db.users[userIndex].balance,
    level: db.users[userIndex].level,
    experience: db.users[userIndex].experience
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});