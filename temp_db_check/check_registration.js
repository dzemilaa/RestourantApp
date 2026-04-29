const { Client } = require('pg');
const client = new Client({ connectionString: 'postgres://neondb_owner:npg_EOqlbT56BJCF@ep-calm-frog-allsu9ui-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require' });
client.connect()
  .then(() => client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'registration'"))
  .then(res => console.log('registration columns:', res.rows))
  .catch(console.error)
  .finally(() => client.end());
