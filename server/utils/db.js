const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:UTacSraSSrhOtIeLfzJDniXXIIKHMtDB@monorail.proxy.rlwy.net:43608/railway",
});

module.exports = pool;
