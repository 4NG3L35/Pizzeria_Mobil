const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Leer archivo .env manualmente ya que dotenv podría no estar instalado explícitamente para node scripts
const envPath = path.resolve(__dirname, '../.env');
const envFile = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('EXPO_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.replace('EXPO_PUBLIC_SUPABASE_URL=', '').replace(/"/g, '').trim();
  }
  if (line.startsWith('EXPO_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.replace('EXPO_PUBLIC_SUPABASE_ANON_KEY=', '').replace(/"/g, '').trim();
  }
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  const products = [
    // Más Pizzas
    { title: 'Pizza Vegetariana', description: 'Champiñones, pimientos, cebolla, aceitunas negras, mozzarella.', price: 70, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { title: 'Pizza Carnívora', description: 'Pepperoni, jamón, tocino, salchicha italiana, mozzarella.', price: 90, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { title: 'Pizza Barbacoa', description: 'Pollo BBQ, cebolla morada, tocino, extra queso.', price: 85, category: 'Pizzas', image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    
    // Bebidas Separadas
    { title: 'Coca Cola 2L', description: 'Refresco sabor cola 2 Litros.', price: 15, category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { title: 'Sprite 2L', description: 'Refresco sabor lima-limón 2 Litros.', price: 15, category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { title: 'Fanta Naranja 2L', description: 'Refresco sabor naranja 2 Litros.', price: 15, category: 'Bebidas', image_url: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    
    // Extras
    { title: 'Pan al Ajo Premium', description: '4 porciones de pan tostado con mantequilla de ajo y finas hierbas.', price: 20, category: 'Extras', image_url: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { title: 'Palitos de Queso', description: '6 palitos de mozzarella empanizados con salsa marinara.', price: 25, category: 'Extras', image_url: 'https://images.unsplash.com/photo-1531749668029-2af41527db2f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
    { title: 'Alitas BBQ', description: '6 alitas de pollo bañadas en salsa BBQ dulce.', price: 35, category: 'Extras', image_url: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' }
  ];

  const { data, error } = await supabase.from('pizzas').insert(products);
  if (error) {
    console.error('Error insertando productos:', error);
  } else {
    console.log('¡Nuevos productos (pizzas, bebidas individuales, extras) añadidos con éxito al catálogo de Supabase!');
  }
}

seed();
