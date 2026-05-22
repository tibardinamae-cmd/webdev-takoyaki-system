CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(100),
  role VARCHAR(20) DEFAULT 'customer'
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  items JSON,
  total DECIMAL(10,2),
  address TEXT,
  city TEXT,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Order Received',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);