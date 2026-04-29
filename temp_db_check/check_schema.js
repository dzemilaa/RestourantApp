const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://neondb_owner:npg_EOqlbT56BJCF@ep-calm-frog-allsu9ui-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require' });
client.connect()
  .then(() => Promise.all([
      client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'product'"),
      client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Product'")
  ]))
  .then(res => console.log('product:', res[0].rows, '"Product":', res[1].rows))
  .catch(console.error)
  .finally(() => client.end());
