import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MySQL Connection
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

// Test Connection
db.getConnection((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err);
  } else {
    console.log("✅ Connected to Aiven MySQL");
  }
});

// ==================== AUTO CREATE TABLES ====================

const createTables = () => {
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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      item_name VARCHAR(100),
      quantity INT,
      price DECIMAL(10,2),
      notes TEXT
    )
  `);

  console.log("✅ All MySQL tables are ready");
};

createTables();

// ==================== API ROUTES ====================

// Register
app.post("/api/register", (req, res) => {
  const { name, email, phone, password } = req.body;
  const sql = "INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, phone, password], (err, result) => {
    if (err) return res.status(400).json({ error: "User already exists" });
    res.json({ id: result.insertId, name, email, phone });
  });
});

// Login
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
    res.json({ id: result.insertId });
  });
});

// Get Orders
app.get("/api/orders/:userId", (req, res) => {
  const sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
  db.query(sql, [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to fetch orders" });
    res.json(results);
  });
});

// Update Order Status (Admin)
app.put("/api/orders/:id/status", (req, res) => {
  const sql = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(sql, [req.body.status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to update" });
    res.json({ message: "Status updated" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});