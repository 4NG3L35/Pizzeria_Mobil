const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
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

async function test() {
  const res1 = await supabase.from('pizzas').select('*');
  console.log('Pizzas:', res1.error || res1.data.length);
  const res2 = await supabase.from('orders').select('*');
  console.log('Orders:', res2.error || res2.data.length);
}
test();
