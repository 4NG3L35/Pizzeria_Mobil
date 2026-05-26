const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function cleanup() {
  // 1. Borrar 'Refresco 2L'
  const { error: delError } = await supabase
    .from('pizzas')
    .delete()
    .eq('title', 'Refresco 2L');

  if (delError) {
    console.error('Error borrando Refresco 2L:', delError);
  } else {
    console.log('Refresco 2L eliminado.');
  }

  // 2. Insertar Jugos Naturales
  const jugos = [
    { title: 'Jugo de Naranja', description: 'Jugo de naranja natural recién exprimido 500ml.', price: 12, category: 'Bebidas', image_url: 'local' },
    { title: 'Jugo de Papaya', description: 'Jugo de papaya fresca 500ml.', price: 12, category: 'Bebidas', image_url: 'local' }
  ];

  const { error: insError } = await supabase.from('pizzas').insert(jugos);
  
  if (insError) {
    console.error('Error insertando jugos:', insError);
  } else {
    console.log('¡Jugos Naturales añadidos con éxito!');
  }
}

cleanup();
