const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://neondb_owner:npg_EOqlbT56BJCF@ep-calm-frog-allsu9ui-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require' });
client.connect()
  .then(() => Promise.all([
      client.query("SELECT COUNT(*) FROM product").catch(e => e.message),
      client.query("SELECT COUNT(*) FROM \"Product\"").catch(e => e.message)
  ]))
  .then(res => console.log('product count:', res[0].rows || res[0], '"Product" count:', res[1].rows || res[1]))
  .catch(console.error)
  .finally(() => client.end());
