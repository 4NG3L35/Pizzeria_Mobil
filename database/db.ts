import * as SQLite from 'expo-sqlite';

// Open or create the database
export const getDatabase = async () => {
  return await SQLite.openDatabaseAsync('pizzeria.db');
};

export const initDatabase = async () => {
  try {
    const db = await getDatabase();
    
    // Create Users table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'client',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed admin user if empty
    const firstUser = await db.getFirstAsync('SELECT COUNT(*) as count FROM users');
    if ((firstUser as any).count === 0) {
      console.log('Inserting default admin user...');
      await db.runAsync(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        'Admin', 'admin@pizzeria.com', 'admin123', 'admin'
      );
    }

    // Create Pizzas table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS pizzas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        category TEXT DEFAULT 'Clásica'
      );
    `);

    // Create Orders table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total REAL NOT NULL,
        status TEXT DEFAULT 'Pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    // Create Order Items table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        pizza_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (pizza_id) REFERENCES pizzas (id)
      );
    `);

    // Seed initial data for pizzas if empty
    const firstPizza = await db.getFirstAsync('SELECT COUNT(*) as count FROM pizzas');
    if ((firstPizza as any).count === 0) {
      console.log('Inserting default pizzas...');
      await db.execAsync(`
        INSERT INTO pizzas (name, description, price, image_url, category) VALUES
        ('Margarita', 'Tomate, mozzarella fresca, albahaca y aceite de oliva.', 12.99, 'margarita.png', 'Clásica'),
        ('Pepperoni', 'Doble pepperoni con queso mozzarella derretido.', 14.50, 'pepperoni.png', 'Favoritas'),
        ('Cuatro Quesos', 'Mezcla perfecta de mozzarella, gorgonzola, parmesano y ricotta.', 16.00, 'quesos.png', 'Especialidad'),
        ('Hawaiana', 'Jamón, piña fresca y mozzarella.', 13.50, 'hawaiana.png', 'Clásica')
      `);
    }

    console.log('Database initialized correctly.');
  } catch (error) {
    console.error('Error initializing database: ', error);
  }
};
