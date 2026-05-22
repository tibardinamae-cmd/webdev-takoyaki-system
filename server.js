const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MySQL Connection (Aiven)
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ==================== AUTO CREATE TABLES ====================

const createTables = () => {
  // Users Table
  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      phone VARCHAR(20),
      password VARCHAR(100) NOT NULL,
      role ENUM('customer', 'admin') DEFAULT 'customer',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders Table
  db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      total DECIMAL(10,2) NOT NULL,
      address TEXT,
      city TEXT,
      notes TEXT,
      status ENUM('Order Received', 'Preparing', 'Cooking', 'On the Way', 'Delivered') 
             DEFAULT 'Order Received',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order Items Table
  db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      item_name VARCHAR(100),
      quantity INT,
      price DECIMAL(10,2),
      notes TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  // Menu Items Table (Optional)
  db.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category ENUM('classic', 'premium', 'spicy', 'sides', 'drinks') NOT NULL,
      image_url TEXT,
      popular BOOLEAN DEFAULT FALSE,
      spicy BOOLEAN DEFAULT FALSE,
      vegetarian BOOLEAN DEFAULT FALSE,
      pieces_per_serving INT DEFAULT 6,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ All MySQL tables checked/created successfully");
};

// Call table creation on server start
createTables();

// ==================== API ROUTES ====================

// Register User
app.post("/api/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) return res.status(400).json({ error: "User already exists or invalid data" });
    res.json({ id: result.insertId, name, email, phone });
  });
});

// Login User
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.json(results[0]);
  });
});

// Create Order
app.post("/api/orders", (req, res) => {
  const { user_id, items, total, address, city, notes } = req.body;
  const sql = `
    INSERT INTO orders (user_id, items, total, address, city, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, 'Order Received')
  `;
  db.query(sql, [user_id, JSON.stringify(items), total, address, city, notes], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to create order" });
    res.json({ id: result.insertId, status: "Order Received" });
  });
});

// Get Orders by User
app.get("/api/orders/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.json(results);
  });
});

// Update Order Status (Admin)
app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update status" });
    res.json({ message: "Status updated" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});