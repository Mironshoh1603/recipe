const mongoose = require("mongoose");
const db = process.env.DATABASE.replace("<password>", process.env.PASSWORD);
mongoose.connect(db, {}).then(() => console.log("DATABASE connnected.."));
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: db,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Models
require("./Category");
require("./Recipe");
