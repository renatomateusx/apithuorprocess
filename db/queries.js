const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'thuor',
  password: '02997841500',
  //password: 'Re029Na97To84Ma15Te00Us',
  port: 5432,
})
module.exports = pool;
